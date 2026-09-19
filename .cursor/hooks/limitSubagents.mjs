#!/usr/bin/env node
/**
 * Cursor hook: cap subagent (Task/Subagent) starts per conversation.
 * See .cursor/hooks.json and https://cursor.com/docs/agent/hooks
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { stdin } from "node:process";

const MAX_SUBAGENTS_PER_CONVERSATION = 5;
const STATE_DIR = ".cursor/hooks/state";
const STATE_FILE = `${STATE_DIR}/subagent-limits.json`;

const readStdin = async () => {
  const chunks = [];
  for await (const chunk of stdin) {
    chunks.push(chunk);
  }
  const text = chunks.join("");
  if (!text.trim()) {
    return {};
  }
  return JSON.parse(text);
};

const loadStore = async () => {
  try {
    return JSON.parse(await readFile(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
};

const saveStore = async (store) => {
  await mkdir(STATE_DIR, { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(store, null, 2), "utf8");
};

const conversationKey = (input) => input.conversation_id ?? input.session_id ?? "unknown";

const main = async () => {
  const input = await readStdin();
  const event = input.hook_event_name;
  const key = conversationKey(input);

  if (event === "sessionStart") {
    const store = await loadStore();
    store[key] = { count: 0, updatedAt: new Date().toISOString() };
    await saveStore(store);
    process.stdout.write("{}\n");
    return;
  }

  if (event === "sessionEnd") {
    const store = await loadStore();
    delete store[key];
    await saveStore(store);
    process.stdout.write("{}\n");
    return;
  }

  if (event === "subagentStart") {
    const store = await loadStore();
    const entry = store[key] ?? { count: 0 };
    entry.count += 1;
    entry.updatedAt = new Date().toISOString();
    entry.lastType = input.subagent_type ?? null;
    store[key] = entry;
    await saveStore(store);

    if (entry.count > MAX_SUBAGENTS_PER_CONVERSATION) {
      entry.count -= 1;
      store[key] = entry;
      await saveStore(store);
      process.stdout.write(
        `${JSON.stringify({
          decision: "deny",
          reason: `Лимит subagent для этой беседы: не больше ${MAX_SUBAGENTS_PER_CONVERSATION} запусков (сейчас уже ${entry.count}). Выполни задачу сам без новых subagent.`,
        })}\n`
      );
      return;
    }

    process.stdout.write(`${JSON.stringify({ decision: "allow" })}\n`);
    return;
  }

  process.stdout.write("{}\n");
};

main().catch((error) => {
  console.error("[limitSubagents]", error);
  process.stdout.write(`${JSON.stringify({ decision: "allow" })}\n`);
});
