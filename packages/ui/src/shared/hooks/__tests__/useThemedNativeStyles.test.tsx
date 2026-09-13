import { renderHook } from "@testing-library/react";
import { type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { ThemeContext } from "@/shared/contexts";
import { themes } from "@/shared/tokens";
import { type Theme } from "@/shared/types";

import { useThemedNativeStyles } from "../useThemedNativeStyles";

const createWrapper = (theme: Theme) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );

  return Wrapper;
};

describe("useThemedNativeStyles", () => {
  it('возвращает themes.light при theme="light"', () => {
    const { result } = renderHook(() => useThemedNativeStyles(), {
      wrapper: createWrapper("light"),
    });

    expect(result.current).toBe(themes.light);
  });

  it('возвращает themes.dark при theme="dark"', () => {
    const { result } = renderHook(() => useThemedNativeStyles(), {
      wrapper: createWrapper("dark"),
    });

    expect(result.current).toBe(themes.dark);
  });

  it("бросает ошибку при falsy значении theme в контексте", () => {
    const Wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeContext.Provider value={null as unknown as Theme}>{children}</ThemeContext.Provider>
    );

    expect(() => renderHook(() => useThemedNativeStyles(), { wrapper: Wrapper })).toThrow(
      /ThemeProvider/
    );
  });
});
