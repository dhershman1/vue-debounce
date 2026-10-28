import debounce from './debounce.js'
import { mapOutListeningEvents, isEmpty, isLocked, shouldFireOnEmpty } from './_internals.js'

export default function ({
  lock = false,
  listenTo = 'keyup',
  defaultTime = '300ms',
  fireOnEmpty = false,
  cancelOnEmpty = false,
  trim = false
} = {}) {
  return {
    created (el, {
      value: debouncedFn,
      arg: timer = defaultTime,
      modifiers
    }, vnode) {
      const combinedRules = Object.assign({
        lock,
        trim,
        fireonempty: fireOnEmpty,
        cancelonempty: cancelOnEmpty
      }, modifiers)
      const events = mapOutListeningEvents(vnode.props, listenTo)
      const fn = debounce((value, e) => {
        debouncedFn(value, e)
      }, timer)

      function handler (event) {
        const rawValue = event.target.value
        const value = combinedRules.trim && typeof rawValue === 'string' ? rawValue.trim() : rawValue

        if (isEmpty(value) && combinedRules.cancelonempty) {
          fn.cancel()
        } else if (isLocked(event.key, combinedRules) || shouldFireOnEmpty(value, combinedRules)) {
          fn.cancel()
          debouncedFn(value, event)
        } else {
          fn(value, event)
        }
      }

      events.forEach(e => {
        el.addEventListener(e, handler)
      })

      el._vueDebounceCleanup = () => {
        fn.cancel()

        events.forEach(e => {
          el.removeEventListener(e, handler)
        })
      }
    },
    unmounted (el) {
      if (el._vueDebounceCleanup) {
        el._vueDebounceCleanup()
        delete el._vueDebounceCleanup
      }
    }
  }
}
