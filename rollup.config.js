import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: './src/index.js',
  plugins: [commonjs(), buble(), uglify()],
  output: {
    format: 'umd',
    name: 'vueDebounce',
    file: 'dist/vue-debounce.min.js'
  }
}
