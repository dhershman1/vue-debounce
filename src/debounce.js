function convertTime (time) {
  const [amt, unit = 'ms'] = String(time).split(/(ms|s)/i)
  const types = {
    ms: 1,
    s: 1000
  }

  return Number(amt) * types[unit.toLowerCase()]
}

function debounce (fn, wait) {
  let timeout = null
  const timer = typeof wait === 'number' ? wait : convertTime(wait)

  const debounced = function (...args) {
    const later = () => {
      timeout = null

      fn.apply(this, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, timer)
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}

export default debounce
