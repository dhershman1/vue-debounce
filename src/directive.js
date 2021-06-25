import debounce from './debounce'

// Helper Functions
/**
 * Maps through an array of strings and lowercases all of them
 * @param {Array} list an array of strings to map through
 */
function toLowerMap (list) {
  return list.map(x => x.toLowerCase())
}

/**
 * Takes in a value and ensures its wrapped within an array
 * @param {Any} value The value to ensure is an array
 */
function ensureArray (value) {
  if (Array.isArray(value)) {
    return value
  }

  if (value == null) {
    return []
  }

  return [value]
}

// Figures out the event we are using with the bound element
function mapOutListeningEvents (attrs, listenTo) {
  const { value = false } = attrs.getNamedItem('debounce-events') || {}

  // If they set an events attribute that overwrites everything
  if (value) {
    return toLowerMap(value.split(','))
  }

  return toLowerMap(ensureArray(listenTo))
}

function isEmpty (str) {
  return str === ''
}

function isLocked (key, modifiers) {
  return key === 'Enter' && (!modifiers.lock || modifiers.unlock)
}

function shouldFireOnEmpty (value, key, modifiers) {
  return isEmpty(value) && modifiers.fireonempty && (key === 'Enter' || key === ' ')
}

function determineVersion (v) {
  const [major] = String(v).split('.')

  if (Number(major) >= 3) {
    return 'mounted'
  }

  return 'bind'
}

export function getDirective (version = '2', {
  lock = false,
  listenTo = 'keyup',
  defaultTime = '300ms',
  fireOnEmpty = false,
  cancelOnEmpty = false,
  trim = false
} = {}) {
  return {
    [determineVersion(version)] (el, {
      value: debouncedFn,
      arg: timer = defaultTime,
      modifiers
    }) {
      const combinedRules = Object.assign({
        lock,
        trim,
        fireonempty: fireOnEmpty,
        cancelonempty: cancelOnEmpty
      }, modifiers)
      const listener = mapOutListeningEvents(el.attributes, listenTo)
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

      listener.forEach(e => {
        el.addEventListener(e, handler)
      })
    }
  }
}

export default getDirective()
