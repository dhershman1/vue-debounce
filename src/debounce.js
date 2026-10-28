/**
 * Converts a wait value into milliseconds. Accepts a bare number of ms,
 * or a string like '300ms' or '1s' (case-insensitive)
 * @param {string|number} time The wait value to convert
 * @returns {number} The wait time in milliseconds
 */
function convertTime (time) {
  const [amt, unit = 'ms'] = String(time).split(/(ms|s)/i)
  const types = {
    ms: 1,
    s: 1000
  }

  return Number(amt) * types[unit.toLowerCase()]
}

/**
 * Wraps fn so rapid calls collapse into a single trailing call, `wait`
 * after the last one
 * @param {Function} fn The function to debounce
 * @param {string|number} wait The wait time, e.g. 300, '300ms', or '1s'
 * @returns {Function} The debounced function, with a `.cancel()` to drop any pending call
 */
function debounce (fn, wait) {
  let timeout = null
  const timer = typeof wait === 'number' ? wait : convertTime(wait)

  const debounced = (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      fn(...args)
    }, timer)
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}

export default debounce
