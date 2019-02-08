import debounce from './debounce'

export default {
  name: 'debounce',
  install (Vue, { lock, listenTo = 'onkeyup' } = {}) {
    Vue.directive('debounce', {
      bind (el, { value, arg, modifiers }) {
        if (typeof el[listenTo] === 'undefined') {
          throw new Error(`Event Listener ${listenTo} does not exist`)
        }
        const fn = debounce(target => {
          value(target.value)
        }, arg)
        const isUnlocked = (!modifiers.lock && !lock) || modifiers.unlock

        el[listenTo] = ({ keyCode, target }) => {
          if (keyCode === 13 && isUnlocked) {
            fn.cancel()
            value(target.value)
          }

          if (keyCode !== 13) {
            fn(target)
          }
        }
      }
    })
  }
}
