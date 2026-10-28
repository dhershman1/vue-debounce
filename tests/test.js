import test from 'node:test'
import assert from 'node:assert/strict'
import debounce from '../src/debounce.js'

test('Handles defaults', (t, done) => {
  const runner = debounce((val) => {
    assert.ok(val)
    assert.equal(val, 'testing')
    done()
  })

  runner('testing')
})

test('Handles number type', (t, done) => {
  const runner = debounce(val => {
    assert.ok(val)
    assert.equal(val, 'testing')
    done()
  }, 400)

  runner('testing')
})

test('Handles no format set', (t, done) => {
  const runner = debounce(val => {
    assert.ok(val)
    assert.equal(val, 'testing')
    done()
  }, '500')

  runner('testing')
})

test('Handles sepcific time', (t, done) => {
  const runner = debounce((val) => {
    assert.ok(val)
    assert.equal(val, 'testing')
    done()
  }, '500ms')

  runner('testing')
})

test('Handles seconds', (t, done) => {
  const runner = debounce((val) => {
    assert.ok(val)
    assert.equal(val, 'testing')
    done()
  }, '1s')

  runner('testing')
})

test('Inherits parent scope', (t, done) => {
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
          assert.ok(val)
          assert.equal(this.somevalue, 'testing')
          done()
        })
      }
    })

    vm.somevalue = val
    vm.somefunction()
  }

  runner('testing')
})

test('Collapses rapid calls into a single invocation', (t, done) => {
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
    assert.equal(calls, 1)
    done()
  }, 150)
})

test('Fires with the arguments of the last call (trailing edge)', (t, done) => {
  const runner = debounce(val => {
    assert.equal(val, 'last')
    done()
  }, '50ms')

  runner('first')
  runner('second')
  runner('last')
})

test('cancel() prevents a pending invocation from firing', (t, done) => {
  let fired = false
  const runner = debounce(() => {
    fired = true
  }, '50ms')

  runner()
  runner.cancel()

  setTimeout(() => {
    assert.equal(fired, false)
    done()
  }, 100)
})

test('cancel() does not affect a later call', (t, done) => {
  const runner = debounce(val => {
    assert.equal(val, 'second')
    done()
  }, '50ms')

  runner('first')
  runner.cancel()
  runner('second')
})

test('Time units are case-insensitive', (t, done) => {
  let calls = 0
  const start = Date.now()
  const runner = debounce(() => {
    calls++
    assert.equal(calls, 1)
    assert.ok(Date.now() - start >= 90, 'waited roughly the configured time instead of firing immediately')
    done()
  }, '100MS')

  runner()
})

test('Seconds unit is case-insensitive', (t, done) => {
  const start = Date.now()
  const runner = debounce(() => {
    assert.ok(Date.now() - start >= 90, 'waited roughly the configured time instead of firing immediately')
    done()
  }, '0.1S')

  runner()
})
