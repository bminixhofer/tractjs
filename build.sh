#!/usr/bin/env sh
# builds the Rust library and the TypeScript wrapper

wasm-pack build --release --target web
cd wrapper
npm run build