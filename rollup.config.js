import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [json(), resolve(), commonjs(), babel({
    exclude: 'node_modules/**',
  })],
  dest: 'dist/bundle.js',
};
