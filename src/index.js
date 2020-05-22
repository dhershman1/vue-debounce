import { ensureArray, toLower, map, isEmpty } from 'kyanite'
import debounce from './debounce'

// Helper Functions
/**
 * Maps through an array of strings and lowercases all of them
 * @param {Array} list an array of strings to map through
 */
const toLowerMap = map(toLower)

// Figures out the event we are using with the bound element
function mapOutListeningEvents (attrs, listenTo) {
  const { value = false } = attrs.getNamedItem('debounce-events') || {}

  // If they set an events attribute that overwrites everything
  if (value) {
    return toLowerMap(value.split(','))
  }

  return toLowerMap(ensureArray(listenTo))
}

function isCanceled (inputValue, modifiers) {
  return isEmpty(inputValue) && modifiers.cancelonempty
}

function isLocked (key, modifiers) {
  return key === 'Enter' && (!modifiers.lock || modifiers.unlock)
}

function shouldFireOnEmpty (inputValue, modifiers) {
  return isEmpty(inputValue) && modifiers.fireonempty
}

export { debounce }

export default {
  install (Vue, {
    lock = false,
    listenTo = 'keyup',
    defaultTime = '300ms',
    fireOnEmpty = false,
    cancelOnEmpty = false
  } = {}) {
    Vue.directive('debounce', {
      bind (el, {
        value: debouncedFn,
        arg: timer = defaultTime,
        modifiers
      }) {
        const combinedRules = Object.assign({ fireonempty: fireOnEmpty, cancelonempty: cancelOnEmpty, lock }, modifiers)
        const listener = mapOutListeningEvents(el.attributes, listenTo)
        const fn = debounce(e => {
          debouncedFn(e.target.value, e)
        }, timer)

        function handler (event) {
          if (isCanceled(event.target.value, combinedRules)) {
            fn.cancel()
          } else if (isLocked(event.key, combinedRules) || shouldFireOnEmpty(event.target.value, combinedRules)) {
            fn.cancel()
            debouncedFn(event.target.value, event)
          } else {
            fn(event)
          }
        }

        listener.forEach(e => {
          el.addEventListener(e, handler)
        })
      }
    })
  }
}
