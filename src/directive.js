import debounce from './debounce.js'
import { mapOutListeningEvents, isEmpty, isLocked, shouldFireOnEmpty } from './_internals.js'

/**
 * Merges the configured default options with any modifiers passed to this
 * specific binding. Modifiers are always `true` when Vue passes them in, so
 * this can only ever turn a rule ON, never off, which is why `unlock` exists
 * as its own modifier rather than `lock` just being toggled directly
 * @param {boolean} lock Locks the debounce, preventing the enter key from triggering the function when pressed
 * @param {boolean} trim Whether we should trim out whitespace or not
 * @param {boolean} fireOnEmpty Fire the debounced function right away when the value is emptied
 * @param {boolean} cancelOnEmpty Cancel the debounced function when the value is emptied
 * @param {Object} modifiers The modifiers object from the directive's binding, e.g. `{ lock: true }`
 * @returns {Object} The combined rules the directive's event handler checks against
 */
function buildRules (lock, trim, fireOnEmpty, cancelOnEmpty, modifiers) {
  return Object.assign({
    lock,
    trim,
    fireonempty: fireOnEmpty,
    cancelonempty: cancelOnEmpty
  }, modifiers)
}

/**
 * Creates the v-debounce directive. Options here apply to every binding
 * supports per-element modifiers (e.g. `.lock`) layer on top
 * @param {Object} [options]
 * @param {boolean} [options.lock=false] Locks the enter key for every bound input
 * @param {string|Array} [options.listenTo='keyup'] The default event(s) to listen to
 * @param {string|number} [options.defaultTime='300ms'] The wait time used when a binding doesn't set its own
 * @param {boolean} [options.fireOnEmpty=false] Fire right away when a bound input is emptied
 * @param {boolean} [options.cancelOnEmpty=false] Cancel instead of firing when a bound input is emptied
 * @param {boolean} [options.trim=false] Trim whitespace from the value before checking/delivering it
 * @returns {Object} The Vue directive object
 */
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
      let combinedRules = buildRules(lock, trim, fireOnEmpty, cancelOnEmpty, modifiers)
      let events = mapOutListeningEvents(vnode.props, listenTo)
      let fn = debounce((value, e) => {
        debouncedFn(value, e)
      }, timer)

      function handler (event) {
        const rawValue = event.target.value
        // Elements with no real value (a button, a div, anything bound via
        // debounce-events on a non-input) fall back to the event itself
        const value = typeof rawValue !== 'string'
          ? event
          : combinedRules.trim ? rawValue.trim() : rawValue

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

      // Vue calls created/updated/unmounted as separate invocations on the
      // same shared directive object, so any per-element state (the vars
      // above) has to be reached through the element itself rather than a
      // closure shared across every el this directive is bound to
      el._vueDebounceUpdate = ({
        value,
        arg: newTimer = defaultTime,
        modifiers: newModifiers
      }, newVnode) => {
        debouncedFn = value
        combinedRules = buildRules(lock, trim, fireOnEmpty, cancelOnEmpty, newModifiers)

        // Only recreate the debounce timer if the wait time actually changed
        if (newTimer !== timer) {
          timer = newTimer
          fn.cancel()
          fn = debounce((value, e) => {
            debouncedFn(value, e)
          }, timer)
        }

        const newEvents = mapOutListeningEvents(newVnode.props, listenTo)

        events.forEach(e => {
          el.removeEventListener(e, handler)
        })
        events = newEvents
        events.forEach(e => {
          el.addEventListener(e, handler)
        })
      }

      el._vueDebounceCleanup = () => {
        fn.cancel()

        events.forEach(e => {
          el.removeEventListener(e, handler)
        })
      }
    },
    updated (el, binding, vnode) {
      if (el._vueDebounceUpdate) {
        el._vueDebounceUpdate(binding, vnode)
      }
    },
    unmounted (el) {
      if (el._vueDebounceCleanup) {
        el._vueDebounceCleanup()
        delete el._vueDebounceCleanup
        delete el._vueDebounceUpdate
      }
    }
  }
}
