import debounce from './debounce'

// Figures out the event we are using with the bound element
function figureOutEvent (attrs, listenTo) {
  const { value = false } = attrs.getNamedItem('debounce-events') || {}
  const toLowerMap = list => list.map(x => x.toLowerCase())

  // If they set an events attribute that overwrites everything
  if (value) {
    return toLowerMap(value.split(','))
  }

  return Array.isArray(listenTo) ? toLowerMap(listenTo) : [listenTo]
}

export { debounce }

export default {
  install (Vue, { lock, listenTo = 'keyup', defaultTime = '300ms', fireOnEmpty = false } = {}) {
    Vue.directive('debounce', {
      bind (el, { value, arg, modifiers }) {
        const listener = figureOutEvent(el.attributes, listenTo)
        const fn = debounce(target => {
          value(target.value)
        }, arg || defaultTime)

        function handler ({ key, target }) {
          const isUnlocked = (!modifiers.lock && !lock) || modifiers.unlock

          if ((key === 'Enter' && isUnlocked) || (!target.value && fireOnEmpty)) {
            fn.cancel()
            value(target.value)
          }

          if (key !== 'Enter') {
            fn(target)
          }
        }

        listener.forEach(e => {
          el.addEventListener(e, handler)
        })
      }
    })
  }
}
