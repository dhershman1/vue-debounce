// Helper Functions
/**
 * Maps through an array of strings and lowercases all of them
 * @param {Array} list an array of strings to map through
 */
export function toLowerMap (list) {
  return list.map(x => x.toLowerCase())
}

/**
 * Takes in a value and ensures its wrapped within an array
 * @param {Any} value The value to ensure is an array
 */
export function ensureArray (value) {
  if (Array.isArray(value)) {
    return value
  }

  if (value == null) {
    return []
  }

  return [value]
}

// Figures out the event we are using with the bound element
export function mapOutListeningEvents (attrs, listenTo) {
  // Make sure attributes exist on the element
  const elEvents = attrs ? attrs['debounce-events'] : []
  // If they set an events attribute that overwrites everything
  if (elEvents && elEvents.length > 0) {
    // Since they can send in an array or a string we need to be prepared for both
    if (Array.isArray(elEvents)) {
      return toLowerMap(elEvents)
    }
    return toLowerMap(elEvents.split(','))
  }

  return toLowerMap(ensureArray(listenTo))
}

export function isEmpty (str) {
  return str === ''
}

export function isLocked (key, modifiers) {
  return key === 'Enter' && (!modifiers.lock || modifiers.unlock)
}

export function shouldFireOnEmpty (value, key, modifiers) {
  return isEmpty(value) && modifiers.fireonempty && (key === 'Enter' || key === ' ')
}
