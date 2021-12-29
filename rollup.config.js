import babel from '@rollup/plugin-babel'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'

export default [{
  input: './src/index.js',
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser(),
    filesize({
      showMinifiedSize: false
    })
  ],
  watch: {
    chokidar: true,
    include: 'src/**',
    clearScreen: false
  },
  output: {
    format: 'umd',
    name: 'vueDebounce',
    file: 'dist/vue-debounce.min.js',
    exports: 'named'
  }
}, {
  input: './src/debounce.js',
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser(),
    filesize({
      showMinifiedSize: false
    })
  ],
  output: {
    format: 'umd',
    name: 'debounce',
    file: 'dist/debounce.min.js'
  }
}, {
  input: './src/debounce.js',
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser(),
    filesize({
      showMinifiedSize: false
    })
  ],
  output: {
    format: 'es',
    name: 'debounce',
    file: 'dist/debounce.min.mjs'
  }
}, {
  input: './src/index.js',
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser(),
    filesize({
      showMinifiedSize: false
    })
  ],
  watch: {
    chokidar: true,
    include: 'src/**',
    clearScreen: false
  },
  output: {
    format: 'es',
    name: 'vueDebounce',
    file: 'dist/vue-debounce.min.mjs',
    exports: 'named'
  }
}]
