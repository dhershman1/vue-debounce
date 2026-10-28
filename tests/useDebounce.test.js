import test from 'node:test'
import assert from 'node:assert/strict'
import { createRenderer, h, defineComponent } from 'vue'
import useDebounce from '../src/useDebounce.js'

// A real Vue component lifecycle (mount/unmount), driven through a minimal
// headless renderer, the lifecycle hooks useDebounce relies on (onUnmounted)
// only need a component instance
function mount (setup) {
  const nodeOps = {
    createElement: () => ({}),
    createText: () => ({}),
    createComment: () => ({}),
    setText: () => {},
    setElementText: () => {},
    insert: () => {},
    remove: () => {},
    querySelector: () => null,
    setScopeId: () => {},
    cloneNode: node => node,
    parentNode: () => null,
    nextSibling: () => null
  }
  const { createApp } = createRenderer({ ...nodeOps, patchProp: () => {} })
  const Comp = defineComponent({
    setup () {
      setup()
      return () => h('div')
    }
  })
  const app = createApp(Comp)

  app.mount(nodeOps.createElement())

  return () => app.unmount()
}

test('behaves like a normal debounce while the component is mounted', (t, done) => {
  let lastValue = null

  mount(() => {
    const run = useDebounce((v) => { lastValue = v }, '30ms')
    run('a')
    run('b')
    run('c')
  })

  setTimeout(() => {
    assert.equal(lastValue, 'c')
    done()
  }, 60)
})

test('cancels a pending call when the component unmounts', (t, done) => {
  let fired = false

  const unmount = mount(() => {
    const run = useDebounce(() => { fired = true }, '30ms')
    run()
  })

  unmount()

  setTimeout(() => {
    assert.ok(!fired, 'pending call was cancelled instead of firing after unmount')
    done()
  }, 60)
})

test('cancel() still works manually, same as debounce()', (t, done) => {
  let fired = false

  mount(() => {
    const run = useDebounce(() => { fired = true }, '20ms')
    run()
    run.cancel()
  })

  setTimeout(() => {
    assert.ok(!fired)
    done()
  }, 40)
})
