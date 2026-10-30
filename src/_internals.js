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
 * @param {*} value The value to ensure is an array
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

/**
 * Resolves which events to listen for. A debounce-events attribute on the
 * element overrides the configured listenTo entirely
 * @param {Object} attrs The bound element's vnode props
 * @param {string|Array} listenTo The configured default event(s)
 * @returns {Array} The lowercased event names to attach listeners for
 */
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

/**
 * Checks for an exact empty string
 * @param {string} str The value to check
 * @returns {boolean} True if str is empty
 */
export function isEmpty (str) {
  return str === ''
}

/**
 * Enter fires the debounced function right away unless lock is set,
 * in which case unlock turns it back on
 * @param {string} key The key that triggered the event
 * @param {Object} modifiers The combined rules for this binding
 * @returns {boolean} True if Enter should fire the function immediately
 */
export function isLocked (key, modifiers) {
  return key === 'Enter' && (!modifiers.lock || modifiers.unlock)
}

/**
 * Checks whether the value was just emptied and fireonempty is enabled
 * @param {string} value The current (already trimmed, if applicable) value
 * @param {Object} modifiers The combined rules for this binding
 * @returns {boolean} True if the debounced function should fire right away
 */
export function shouldFireOnEmpty (value, modifiers) {
  return isEmpty(value) && modifiers.fireonempty
}
