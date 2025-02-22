import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/jpostcode.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/umd/index.js',
      format: 'umd',
      name: 'Jpostcode',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    copy({
      targets: [
        { src: 'jpostcode-data/data/json/*', dest: 'dist/jpostcode-data/data/json' }
      ]
    })
  ]
};
