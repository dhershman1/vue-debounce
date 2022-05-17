import debounce from './debounce'
import { mapOutListeningEvents, isEmpty, isLocked, shouldFireOnEmpty } from './_internals'

export default function ({
  lock = false,
  listenTo = 'keyup',
  defaultTime = '300ms',
  fireOnEmpty = false,
  cancelOnEmpty = false,
  trim = false
} = {}) {
  return {
    bind (el, {
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
      const events = mapOutListeningEvents(vnode.data.attrs, listenTo)
      const fn = debounce(e => {
        debouncedFn(e.target.value, e)
      }, timer)

      function handler (event) {
        const value = combinedRules.trim ? event.target.value.trim() : event.target.value

        if (isEmpty(value) && combinedRules.cancelonempty) {
          fn.cancel()
        } else if (isLocked(event.key, combinedRules) || shouldFireOnEmpty(value, event.key, combinedRules)) {
          fn.cancel()
          debouncedFn(event.target.value, event)
        } else {
          fn(event)
        }
      }

      events.forEach(e => {
        el.addEventListener(e, handler)
      })
    }
  }
}
