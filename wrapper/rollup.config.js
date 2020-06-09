import typescript from 'rollup-plugin-typescript2';
import workerLoader from 'rollup-plugin-web-worker-loader';
import resolve from '@rollup/plugin-node-resolve';
import replace from "@rollup/plugin-replace";
import wasm from "@rollup/plugin-wasm";
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';
import toml from "toml";
import fs from "fs";
import fileReplace from "replace-in-file";

const tractVersion = toml.parse(fs.readFileSync("../Cargo.toml"))["dependencies"]["tract-core"];

function fileReplacePlugin(options) {
    return {
        name: "file-replace-plugin",
        writeBundle() {
            fileReplace.sync(options);
        }
    }
}

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: "cjs"
        },
        {
            file: pkg.module,
            format: "esm"
        },
        {
            file: pkg.minified,
            format: "iife",
            name: "tractjs",
            plugins: [terser()]
        }
    ],
    plugins: [
        wasm(),
        resolve(),
        replace({
            // import.meta does not work in a `Worker`, this is a VERY hacky way to fix wasm-pack usage of import.meta
            // TODO: open an issue in wasm-pack
            "include": "core/tractjs_core.js",
            "import.meta": "'unknown'"
        }),
        workerLoader({
            inline: true,
        }),
        typescript(),
        fileReplacePlugin({
            files: "dist/*",
            from: /__tractVersion__/g,
            to: tractVersion
        }),
    ]
};