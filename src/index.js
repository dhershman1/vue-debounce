import debounce from './debounce'

export default {
  name: 'debounce',
  install (Vue, { lock } = {}) {
    Vue.directive('debounce', {
      bind (el, { value, arg, modifiers }) {
        const fn = debounce(target => {
          value(target.value)
        }, arg)
        const isUnlocked = (!modifiers.lock && !lock) || modifiers.unlock

        el.onkeyup = ({ keyCode, target }) => {
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
