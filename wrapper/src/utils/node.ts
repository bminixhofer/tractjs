const fs = require("fs");

export async function load(path: string): Promise<Uint8Array> {
  return fs.promises.readFile(path);
}
