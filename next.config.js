/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      // "@common_src": common_src_path,
    };
    config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx", ".vue"];
    config.devtool = "source-map";
    // config.optimization.minimize = true;
    // config.optimization.providedExports = true;
    // config.optimization.usedExports = true;
    // config.optimization.sideEffects = true;
    return config;
  },
};

export default config;
