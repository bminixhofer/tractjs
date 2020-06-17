const path = require("path");

module.exports = {
  entry: "./bench.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bench.js",
  },
  devtool: false,
};
