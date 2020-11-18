import test from 'tape'
import debounce from '../src/debounce'

test('Handles defaults', t => {
  const runner = debounce((val) => {
    t.ok(val)
    t.same(val, 'testing')
    t.end()
  })

  runner('testing')
})

test('Handles number type', t => {
  const runner = debounce(val => {
    t.ok(val)
    t.same(val, 'testing')
    t.end()
  }, 400)

  runner('testing')
})

test('Handles no format set', t => {
  const runner = debounce(val => {
    t.ok(val)
    t.same(val, 'testing')
    t.end()
  }, '500')

  runner('testing')
})

test('Handles sepcific time', t => {
  const runner = debounce((val) => {
    t.ok(val)
    t.same(val, 'testing')
    t.end()
  }, '500ms')

  runner('testing')
})

test('Handles seconds', t => {
  const runner = debounce((val) => {
    t.ok(val)
    t.same(val, 'testing')
    t.end()
  }, '1s')

  runner('testing')
})

test('Inherits parent scope', t => {
  const runner = function (val) {
    const Someclass = function ($options) {
      this.somevalue = ''
      this.$options = $options

      this.bind = function (fn, ctx) {
        return function (a) {
          const l = arguments.length
          return l
            ? l > 1
                ? fn.apply(ctx, arguments)
                : fn.call(ctx, a)
            : fn.call(ctx)
        }
      }

      this._initMethods = function () {
        const methods = this.$options.methods
        if (methods) {
          for (const key in methods) {
            this[key] = this.bind(methods[key], this)
          }
        }
      }

      this._initMethods()
    }

    const vm = new Someclass({
      methods: {
        somefunction: debounce(function () {
          t.ok(val)
          t.same(this.somevalue, 'testing')
          t.end()
        })
      }
    })

    vm.somevalue = val
    vm.somefunction()
  }

  runner('testing')
})
