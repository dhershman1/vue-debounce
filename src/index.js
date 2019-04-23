import debounce from './debounce'

function toLower (str) {
  return str.toLowerCase()
}

export default {
  name: 'debounce',
  install (Vue, { lock, listenTo = 'onkeyup' } = {}) {
    Vue.directive('debounce', {
      bind (el, { value, arg, modifiers }) {
        const isArr = Array.isArray(listenTo)
        const listener = isArr ? listenTo.map(toLower) : listenTo.toLowerCase()
        const fn = debounce(target => {
          value(target.value)
        }, arg)

        if (!isArr && typeof el[listener] === 'undefined') {
          throw new Error(`Event Listener ${listener} does not exist`)
        }

        function handler ({ key, target }) {
          const isUnlocked = (!modifiers.lock && !lock) || modifiers.unlock

          if (key === 'Enter' && isUnlocked) {
            fn.cancel()
            value(target.value)
          }

          if (key !== 'Enter') {
            fn(target)
          }
        }

        if (isArr) {
          listener.forEach(e => {
            if (typeof el[e] === 'undefined') {
              throw new Error(`Event Listener ${e} does not exist`)
            }
            el[e] = handler
          })
        } else {
          el[listener] = handler
        }
      }
    })
  }
}
