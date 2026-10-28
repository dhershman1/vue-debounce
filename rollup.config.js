import babel from '@rollup/plugin-babel'
import filesize from 'rollup-plugin-filesize'
import terser from '@rollup/plugin-terser'

export default [{
  input: './src/index.js',
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser(),
    filesize({
      showMinifiedSize: false
    })
  ],
  output: [{
    format: 'umd',
    name: 'vueDebounce',
    exports: 'named',
    file: 'dist/vue-debounce.min.js'
  }, {
    // .cjs extension so Node resolves this as CommonJS regardless of
    // the package's "type": "module", letting require() work correctly
    format: 'umd',
    name: 'vueDebounce',
    exports: 'named',
    file: 'dist/vue-debounce.cjs'
  }]
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
}]
