const { resolve } = require('path');
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    output: {
        webassemblyModuleFilename: "[hash].wasm",
        filename: 'index.js',
        path: resolve(__dirname, 'dist'),
        globalObject: "this",
    },
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: [
            '.js',
            '.ts'
        ]
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'ts-loader',
                    }
                ],
                exclude: /(?:node_modules)/,
            },
        ]
    }
};