import test from 'tape'
import debounce from '../src/debounce.js'

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

test('Collapses rapid calls into a single invocation', t => {
  let calls = 0
  const runner = debounce(() => {
    calls++
  }, '50ms')

  runner()
  runner()
  runner()
  runner()
  runner()

  setTimeout(() => {
    t.same(calls, 1)
    t.end()
  }, 150)
})

test('Fires with the arguments of the last call (trailing edge)', t => {
  const runner = debounce(val => {
    t.same(val, 'last')
    t.end()
  }, '50ms')

  runner('first')
  runner('second')
  runner('last')
})

test('cancel() prevents a pending invocation from firing', t => {
  let fired = false
  const runner = debounce(() => {
    fired = true
  }, '50ms')

  runner()
  runner.cancel()

  setTimeout(() => {
    t.same(fired, false)
    t.end()
  }, 100)
})

test('cancel() does not affect a later call', t => {
  const runner = debounce(val => {
    t.same(val, 'second')
    t.end()
  }, '50ms')

  runner('first')
  runner.cancel()
  runner('second')
})

test('Time units are case-insensitive', t => {
  let calls = 0
  const start = Date.now()
  const runner = debounce(() => {
    calls++
    t.same(calls, 1)
    t.ok(Date.now() - start >= 90, 'waited roughly the configured time instead of firing immediately')
    t.end()
  }, '100MS')

  runner()
})

test('Seconds unit is case-insensitive', t => {
  const start = Date.now()
  const runner = debounce(() => {
    t.ok(Date.now() - start >= 90, 'waited roughly the configured time instead of firing immediately')
    t.end()
  }, '0.1S')

  runner()
})
