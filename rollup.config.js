import { gzipSync } from 'node:zlib'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

function filesize () {
  return {
    name: 'filesize',
    writeBundle (options, bundle) {
      for (const fileName in bundle) {
        const code = bundle[fileName].code

        if (typeof code !== 'string') {
          continue
        }

        const raw = Buffer.byteLength(code)
        const gzip = gzipSync(code).length

        console.log(`${fileName}: ${raw} B (gzip: ${gzip} B)`)
      }
    }
  }
}

export default [{
  input: './src/index.js',
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser(),
    filesize()
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
    filesize()
  ],
  output: {
    format: 'umd',
    name: 'debounce',
    file: 'dist/debounce.min.js'
  }
}]
