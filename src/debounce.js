const convertTime = time => {
  const [amt, t = 'ms'] = String(time).split(/(ms|s|min)/i)
  const types = {
    ms: 1,
    s: 1000
  }

  return Number(amt) * types[t]
}

const debounce = (fn, wait = '300ms') => {
  let timeout = null
  const timer = convertTime(wait)

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

// export default (fn, wait = '300ms') => {
//   let timeout = false
//   const timer = convertTime(wait)

//   return (...args) => {
//     const later = () => {
//       timeout = false

//       fn(...args)
//     }

//     clearTimeout(timeout)
//     timeout = setTimeout(later, timer)

//     if (!timeout) {
//       fn(...args)
//     }
//   }
// }
