import buble from 'rollup-plugin-buble'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: './src/index.js',
  plugins: [
    buble(),
    uglify()
  ],
  watch: {
    chokidar: true,
    include: 'src/**',
    clearScreen: false
  },
  output: {
    format: 'umd',
    name: 'vueDebounce',
    file: 'dist/vue-debounce.min.js'
  }
}
