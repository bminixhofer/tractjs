const rollup = require("rollup");
const typescript = require("rollup-plugin-typescript2");
const resolve = require("@rollup/plugin-node-resolve").default;
const replace = require("@rollup/plugin-replace");
const commonjs = require("@rollup/plugin-commonjs");
const wasm = require("@rollup/plugin-wasm");
const url = require("@rollup/plugin-url");
const { terser } = require("rollup-plugin-terser");
const pkg = require("./package.json");
const toml = require("toml");
const fs = require("fs");
const fileReplace = require("replace-in-file");

const tractVersion = toml.parse(fs.readFileSync("../Cargo.toml"))[
  "dependencies"
]["tract-core"];

function fileReplacePlugin(options) {
  return {
    name: "file-replace-plugin",
    writeBundle() {
      fileReplace.sync(options);
    },
  };
}

function getOptions(env) {
  return {
    input: "src/index.ts",
    plugins: [
      replace({
        __utils__: "./utils/" + env, // replace imports using __utils__ with node / browser utils depending on env
      }),
      resolve({
        browser: env == "browser",
      }),
      commonjs(),
      typescript(),
      url({
        include: "./dist/worker.js",
        limit: Infinity, // always inline the worker
      }),
      fileReplacePlugin({
        files: "dist/*",
        from: /__tractVersion__/g,
        to: tractVersion,
      }),
    ],
    external: env == "browser" ? [] : ["web-worker"],
  };
}

async function build() {
  const worker_bundle = await rollup.rollup({
    input: "src/worker.ts",
    plugins: [
      wasm(),
      resolve(),
      replace({
        // import.meta does not work in a `Worker`, this is a VERY hacky way to fix wasm-pack usage of import.meta
        // TODO: open an issue in wasm-pack
        include: "core/tractjs_core.js",
        "import.meta": "'unknown'",
      }),
      typescript(),
    ],
  });

  await worker_bundle.write({
    file: "dist/worker.js",
    format: "iife",
  });

  const node_bundle = await rollup.rollup(getOptions("node"));

  await node_bundle.write({
    file: pkg.main,
    format: "cjs",
  });

  const browser_bundle = await rollup.rollup(getOptions("browser"));

  await browser_bundle.write({
    file: pkg.module,
    format: "esm",
  });

  await browser_bundle.write({
    file: pkg.minified,
    format: "iife",
    name: "tractjs",
    plugins: [terser()],
  });
}

build();
