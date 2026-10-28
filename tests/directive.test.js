import test from 'tape'
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

test('fires the bound callback with the input value after the wait', t => {
  const directive = vueDebounce({})
  const el = makeEl()

  directive.created(el, {
    value: (value) => {
      t.same(value, 'hello')
      t.end()
    },
    arg: '20ms',
    modifiers: {}
  }, { props: {} })

  el.fire('keyup', makeEvent('hello', 'h'))
})

test('rapid events before the wait elapses only fire the callback once, with the last value', t => {
  const directive = vueDebounce({})
  const el = makeEl()
  let calls = 0

  directive.created(el, {
    value: (value) => {
      calls++
      t.same(value, 'c')
    },
    arg: '30ms',
    modifiers: {}
  }, { props: {} })

  el.fire('keyup', makeEvent('a', 'a'))
  el.fire('keyup', makeEvent('b', 'b'))
  el.fire('keyup', makeEvent('c', 'c'))

  setTimeout(() => {
    t.same(calls, 1)
    t.end()
  }, 80)
})

test('trim option trims the value delivered to the callback', t => {
  const directive = vueDebounce({ trim: true })
  const el = makeEl()

  directive.created(el, {
    value: (value) => {
      t.same(value, 'hello')
      t.end()
    },
    arg: '20ms',
    modifiers: {}
  }, { props: {} })

  el.fire('keyup', makeEvent('  hello  ', 'o'))
})

test('trim option does not throw on an element without a value (e.g. listenTo: click)', t => {
  const directive = vueDebounce({ trim: true, listenTo: 'click' })
  const el = makeEl()

  directive.created(el, {
    value: () => {
      t.pass('callback ran without throwing')
      t.end()
    },
    arg: '20ms',
    modifiers: {}
  }, { props: {} })

  t.doesNotThrow(() => {
    el.fire('click', { key: undefined, target: {} })
  })
})

test('Enter immediately fires the callback by default (unlocked)', t => {
  const directive = vueDebounce({})
  const el = makeEl()

  directive.created(el, {
    value: (value) => {
      t.same(value, 'typed')
      t.end()
    },
    arg: '10s',
    modifiers: {}
  }, { props: {} })

  el.fire('keyup', makeEvent('typed', 'Enter'))
})

test('lock modifier prevents Enter from firing immediately', t => {
  const directive = vueDebounce({})
  const el = makeEl()
  let fired = false

  directive.created(el, {
    value: () => { fired = true },
    arg: '20ms',
    modifiers: { lock: true }
  }, { props: {} })

  el.fire('keyup', makeEvent('typed', 'Enter'))
  t.notOk(fired, 'did not fire immediately on Enter while locked')

  setTimeout(() => {
    t.ok(fired, 'still fires after the debounce wait elapses')
    t.end()
  }, 50)
})

test('cancelonempty modifier cancels a pending call when the value is emptied', t => {
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
    t.notOk(fired, 'cancelled instead of firing')
    t.end()
  }, 80)
})

test('debounce-events attribute overrides the configured listenTo', t => {
  const directive = vueDebounce({ listenTo: 'keyup' })
  const el = makeEl()

  directive.created(el, {
    value: (value) => {
      t.same(value, 'clicked')
      t.end()
    },
    arg: '10ms',
    modifiers: {}
  }, { props: { 'debounce-events': 'click' } })

  t.same(el.listenerCount('keyup'), 0)
  t.same(el.listenerCount('click'), 1)

  el.fire('click', makeEvent('clicked'))
})

test('unmounted cancels any pending call and removes the event listeners', t => {
  const directive = vueDebounce({})
  const el = makeEl()
  let fired = false

  directive.created(el, {
    value: () => { fired = true },
    arg: '30ms',
    modifiers: {}
  }, { props: {} })

  el.fire('keyup', makeEvent('typed', 'd'))
  t.same(el.listenerCount('keyup'), 1)

  directive.unmounted(el)

  t.same(el.listenerCount('keyup'), 0, 'listener removed')

  setTimeout(() => {
    t.notOk(fired, 'pending debounce was cancelled on unmount')
    t.end()
  }, 60)
})
