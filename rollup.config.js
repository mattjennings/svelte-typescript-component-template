import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import execute from "rollup-plugin-execute";

import pkg from "./package.json";

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
      plugins: [
        execute([
          "tsc --outDir ./dist", // create index.js file for pkg.svelte
          "tsc --outDir ./dist/ts --declaration --emitDeclarationOnly", // create types files for ts users
          "node scripts/preprocess.js",
        ]),
      ],
    },
    { file: pkg.main, format: "umd", name, sourcemap: true },
  ],
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
    resolve(),
    typescript(),
  ],
};
