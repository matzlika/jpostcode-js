import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true
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
    typescript({ tsconfig: './tsconfig.json' })
  ]
};
