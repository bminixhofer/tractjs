# Contributing to tractjs

Contributions are very welcome!

To get started, here is a rough overview of tractjs:

1. tractjs consists of two parts:
   1. A Rust library using [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) to expose tract structures to Javascript on a fairly low level. Located in `src/`.
   2. A Typescript wrapper which calls the Rust library in the background in a Web Worker and adds a user-friendly API on top. Located in `wrapper/`.
2. Build commands for everything are located in `wrapper/package.json`. Assuming the working directory is `wrapper`:
   - `npm run build-pkg` uses `wasm-pack` to build the Rust library.
   - `npm run build-wrapper` uses Rollup to build the Typescript wrapper.
   - `npm run build-docs` uses [typedoc](http://typedoc.org/) to build the docs.
   - `npm run build` builds all of the above in the correct order.
3. `quality/` contains integration tests and the benchmarks shown on the website.
   - Run the tests with `npm run test` in the `wrapper` directory.
   - The benchmarks in `quality/benches` have to be built with `webpack`. They then automatically run when you access `quality/benches/index.html`.
4. If you are having problems with missing modules / CLI commands / etc. you can use `.github/workflows/test.yml` as a reference to see how CI is set up in a clean Linux environment.
5. Feel free to open an issue if anything is unclear!

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
