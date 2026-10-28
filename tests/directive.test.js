import test from 'node:test'
import assert from 'node:assert/strict'
import vueDebounce from '../src/directive.js'

// Minimal stand-in for a DOM element, just enough for the directive to work with
function makeEl () {
  const listeners = {}

  return {
    addEventListener (type, fn) {
      ;(listeners[type] = listeners[type] || []).push(fn)
    },
    removeEventListener (type, fn) {
      listeners[type] = (listeners[type] || []).filter(f => f !== fn)
    },
    listenerCount (type) {
      return (listeners[type] || []).length
    },
    fire (type, event) {
      ;(listeners[type] || []).forEach(fn => fn(event))
    }
  }
}

function makeEvent (value, key) {
  return { key, target: { value } }
}

test('fires the bound callback with the input value after the wait', (t, done) => {
  const directive = vueDebounce({})
  const el = makeEl()

  directive.created(el, {
    value: (value) => {
      assert.equal(value, 'hello')
      done()
    },
    arg: '20ms',
    modifiers: {}
  }, { props: {} })

  el.fire('keyup', makeEvent('hello', 'h'))
})

test('rapid events before the wait elapses only fire the callback once, with the last value', (t, done) => {
  const directive = vueDebounce({})
  const el = makeEl()
  let calls = 0

  directive.created(el, {
    value: (value) => {
      calls++
      assert.equal(value, 'c')
    },
    arg: '30ms',
    modifiers: {}
  }, { props: {} })

  el.fire('keyup', makeEvent('a', 'a'))
  el.fire('keyup', makeEvent('b', 'b'))
  el.fire('keyup', makeEvent('c', 'c'))

  setTimeout(() => {
    assert.equal(calls, 1)
    done()
  }, 80)
})

test('trim option trims the value delivered to the callback', (t, done) => {
  const directive = vueDebounce({ trim: true })
  const el = makeEl()

  directive.created(el, {
    value: (value) => {
      assert.equal(value, 'hello')
      done()
    },
    arg: '20ms',
    modifiers: {}
  }, { props: {} })

  el.fire('keyup', makeEvent('  hello  ', 'o'))
})

test('trim option does not throw on an element without a value (e.g. listenTo: click)', (t, done) => {
  const directive = vueDebounce({ trim: true, listenTo: 'click' })
  const el = makeEl()

  directive.created(el, {
    value: () => {
      assert.ok(true, 'callback ran without throwing')
      done()
    },
    arg: '20ms',
    modifiers: {}
  }, { props: {} })

  assert.doesNotThrow(() => {
    el.fire('click', { key: undefined, target: {} })
  })
})

test('Enter immediately fires the callback by default (unlocked)', (t, done) => {
  const directive = vueDebounce({})
  const el = makeEl()

  directive.created(el, {
    value: (value) => {
      assert.equal(value, 'typed')
      done()
    },
    arg: '10s',
    modifiers: {}
  }, { props: {} })

  el.fire('keyup', makeEvent('typed', 'Enter'))
})

test('fireonempty modifier fires immediately when the input is cleared via Backspace', (t, done) => {
  const directive = vueDebounce({})
  const el = makeEl()

  directive.created(el, {
    value: (value) => {
      assert.equal(value, '')
      done()
    },
    arg: '10s',
    modifiers: { fireonempty: true }
  }, { props: {} })

  el.fire('keyup', makeEvent('typed', 't'))
  el.fire('keyup', makeEvent('', 'Backspace'))
})

test('lock modifier prevents Enter from firing immediately', (t, done) => {
  const directive = vueDebounce({})
  const el = makeEl()
  let fired = false

  directive.created(el, {
    value: () => { fired = true },
    arg: '20ms',
    modifiers: { lock: true }
  }, { props: {} })

  el.fire('keyup', makeEvent('typed', 'Enter'))
  assert.ok(!fired, 'did not fire immediately on Enter while locked')

  setTimeout(() => {
    assert.ok(fired, 'still fires after the debounce wait elapses')
    done()
  }, 50)
})

test('cancelonempty modifier cancels a pending call when the value is emptied', (t, done) => {
  const directive = vueDebounce({})
  const el = makeEl()
  let fired = false

  directive.created(el, {
    value: () => { fired = true },
    arg: '30ms',
    modifiers: { cancelonempty: true }
  }, { props: {} })

  el.fire('keyup', makeEvent('typed', 'd'))
  el.fire('keyup', makeEvent('', 'Backspace'))

  setTimeout(() => {
    assert.ok(!fired, 'cancelled instead of firing')
    done()
  }, 80)
})

test('debounce-events attribute overrides the configured listenTo', (t, done) => {
  const directive = vueDebounce({ listenTo: 'keyup' })
  const el = makeEl()

  directive.created(el, {
    value: (value) => {
      assert.equal(value, 'clicked')
      done()
    },
    arg: '10ms',
    modifiers: {}
  }, { props: { 'debounce-events': 'click' } })

  assert.equal(el.listenerCount('keyup'), 0)
  assert.equal(el.listenerCount('click'), 1)

  el.fire('click', makeEvent('clicked'))
})

test('updated rebinds to a new callback instead of keeping the mount-time one', (t, done) => {
  const directive = vueDebounce({})
  const el = makeEl()

  directive.created(el, {
    value: () => assert.fail('the original mount-time callback should not have run'),
    arg: '20ms',
    modifiers: {}
  }, { props: {} })

  directive.updated(el, {
    value: (value) => {
      assert.equal(value, 'hello')
      done()
    },
    arg: '20ms',
    modifiers: {}
  }, { props: {} }, {})

  el.fire('keyup', makeEvent('hello', 'o'))
})

test('updated applies a changed time argument to future calls', (t, done) => {
  const directive = vueDebounce({})
  const el = makeEl()
  const start = Date.now()

  directive.created(el, {
    value: () => assert.fail('should not fire at the original 1s wait'),
    arg: '1s',
    modifiers: {}
  }, { props: {} })

  directive.updated(el, {
    value: () => {
      assert.ok(Date.now() - start < 500, 'fired using the new, shorter wait instead of the original 1s')
      done()
    },
    arg: '30ms',
    modifiers: {}
  }, { props: {} }, {})

  el.fire('keyup', makeEvent('hello', 'o'))
})

test('updated re-wires listeners when debounce-events changes', (t, done) => {
  const directive = vueDebounce({ listenTo: 'keyup' })
  const el = makeEl()

  directive.created(el, {
    value: () => {},
    arg: '10ms',
    modifiers: {}
  }, { props: {} })

  directive.updated(el, {
    value: (value) => {
      assert.equal(value, 'clicked')
      done()
    },
    arg: '10ms',
    modifiers: {}
  }, { props: { 'debounce-events': 'click' } }, {})

  assert.equal(el.listenerCount('keyup'), 0, 'old event listener removed')
  assert.equal(el.listenerCount('click'), 1, 'new event listener attached')

  el.fire('click', makeEvent('clicked'))
})

test('unmounted cancels any pending call and removes the event listeners', (t, done) => {
  const directive = vueDebounce({})
  const el = makeEl()
  let fired = false

  directive.created(el, {
    value: () => { fired = true },
    arg: '30ms',
    modifiers: {}
  }, { props: {} })

  el.fire('keyup', makeEvent('typed', 'd'))
  assert.equal(el.listenerCount('keyup'), 1)

  directive.unmounted(el)

  assert.equal(el.listenerCount('keyup'), 0, 'listener removed')

  setTimeout(() => {
    assert.ok(!fired, 'pending debounce was cancelled on unmount')
    done()
  }, 60)
})

test('unmounted still cleans up correctly after an update changed the events/timer', (t, done) => {
  const directive = vueDebounce({ listenTo: 'keyup' })
  const el = makeEl()
  let fired = false

  directive.created(el, {
    value: () => { fired = true },
    arg: '10ms',
    modifiers: {}
  }, { props: {} })

  directive.updated(el, {
    value: () => { fired = true },
    arg: '30ms',
    modifiers: {}
  }, { props: { 'debounce-events': 'click' } }, {})

  el.fire('click', makeEvent('typed', 'd'))
  assert.equal(el.listenerCount('click'), 1)

  directive.unmounted(el)

  assert.equal(el.listenerCount('click'), 0, 'listener removed')

  setTimeout(() => {
    assert.ok(!fired, 'pending debounce from after the update was still cancelled on unmount')
    done()
  }, 60)
})
