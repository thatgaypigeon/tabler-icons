import fs from 'fs'
import { getRollupPlugins } from '../../.build/rollup-plugins.mjs'
import dts from "rollup-plugin-dts";

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

const packageName = '@tabler/icons-react';
const outputFileName = 'tabler-icons-react';
const outputDir = 'dist';
const inputs = ['./src/tabler-icons-react.ts'];
const bundles = [
  {
    format: 'umd',
    inputs,
    outputDir,
    minify: true,
  },
  {
    format: 'umd',
    inputs,
    outputDir,
  },
  {
    format: 'cjs',
    inputs,
    outputDir,
  },
  {
    format: 'esm',
    inputs,
    outputDir,
    preserveModules: true,
  },
];

const configs = bundles
  .map(({ inputs, outputDir, format, minify, preserveModules }) =>
    inputs.map(input => ({
      input,
      plugins: getRollupPlugins(pkg, minify),
      external: ['react'],
      output: {
        name: packageName,
        ...(preserveModules
          ? {
            dir: `${outputDir}/${format}`,
          }
          : {
            file: `${outputDir}/${format}/${outputFileName}${minify ? '.min' : ''}.js`,
          }),
        format,
        sourcemap: true,
        preserveModules,
        globals: {
          react: 'react'
        },
      },
    })),
  )
  .flat();

export default [
  {
    input: inputs[0],
    output: [{
      file: `dist/${outputFileName}.d.ts`, format: "es"
    }],
    plugins: [dts()],
  },
  ...configs
];
