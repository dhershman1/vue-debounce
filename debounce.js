const convertTime = time => {
  const [amt, t] = String(time).split(/(ms|s|min)/i)
  const types = {
    ms: 1,
    s: 1000,
    min: 60000
  }

  return Number(amt) * types[t]
}

export default (fn, wait = '300ms') => {
  let timeout = null
  const timer = convertTime(wait)

  return (...args) => {
    const later = () => {
      timeout = null

      fn.apply(this, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, timer)

    if (!timeout) {
      fn.apply(this, args)
    }
  }
}
