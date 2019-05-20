import debounce from './debounce'

// Figures out the event we are using with the bound element
function figureOutEvent (attrs, listenTo) {
  const { value = false } = attrs.getNamedItem('debounce-events') || {}
  const isArr = Array.isArray(listenTo)
  const toLowerMap = list => list.map(x => x.toLowerCase())

  // If they set an events attribute that overwrites everything
  if (value) {
    return toLowerMap(value.split(','))
  }

  return isArr ? toLowerMap(listenTo) : [listenTo]
}

export default {
  name: 'debounce',
  install (Vue, { lock, listenTo = 'onkeyup', defaultTime = '300ms' } = {}) {
    Vue.directive('debounce', {
      bind (el, { value, arg, modifiers }) {
        const listener = figureOutEvent(el.attributes, listenTo)
        const fn = debounce(target => {
          value(target.value)
        }, arg || defaultTime)

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

        listener.forEach(e => {
          if (typeof el[e] === 'undefined') {
            throw new Error(`Event Listener ${e} does not exist`)
          }
          el[e] = handler
        })
      }
    })
  }
}
