function convertTime (time) {
  const [amt, t = 'ms'] = String(time).split(/(ms|s)/i)
  const types = {
    ms: 1,
    s: 1000
  }

  return Number(amt) * types[t]
}

function debounce (fn, wait) {
  let timeout = null
  const timer = typeof wait === 'number' ? wait : convertTime(wait)

  const debounced = (...args) => {
    const later = () => {
      timeout = null

      fn(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, timer)

    if (!timeout) {
      fn(...args)
    }
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}

export default debounce
