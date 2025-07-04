import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import del from 'rollup-plugin-delete';
import { dts } from 'rollup-plugin-dts';

export default defineConfig([
  {
    input: 'typescript/index.ts',
    external: ['axios'],
    plugins: [
      del({ targets: 'dist/*', runOnce: true }),
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
      }),
    ],
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  },
  {
    input: 'typescript/index.ts',
    external: ['axios'],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
      }),
    ],
    output: {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    },
  },
  {
    input: 'typescript/index.ts',
    plugins: [dts()],
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
  },
]);
