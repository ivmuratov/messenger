const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const packageAliasRoots = [
  {
    packageRootFragment: "/packages/ui/",
    srcRoot: path.resolve(__dirname, "../../packages/ui/src"),
  },
  {
    packageRootFragment: "/packages/core/",
    srcRoot: path.resolve(__dirname, "../../packages/core/src"),
  },
];

const normalizePath = (filePath) => filePath.replace(/\\/g, "/");

const getPackageSrcRoot = (originModulePath) => {
  const normalizedOriginModulePath = normalizePath(originModulePath);

  return packageAliasRoots.find(({ packageRootFragment }) =>
    normalizedOriginModulePath.includes(packageRootFragment)
  )?.srcRoot;
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolveRequest = context.resolveRequest;

  if (!resolveRequest) {
    throw new Error("Metro resolveRequest is unavailable.");
  }

  if (!moduleName.startsWith("@/")) {
    return resolveRequest(context, moduleName, platform);
  }

  const packageSrcRoot = getPackageSrcRoot(context.originModulePath);
  if (!packageSrcRoot) {
    return resolveRequest(context, moduleName, platform);
  }

  const resolvedModuleName = path.resolve(packageSrcRoot, moduleName.slice(2));
  return resolveRequest(context, resolvedModuleName, platform);
};

module.exports = config;
