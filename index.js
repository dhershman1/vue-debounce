import debounce from './debounce'

export default {
  name: 'debounce',
  config: {},
  install(Vue, installOpts) {
    Vue.directive('debounce', {
      bind(el) {
        el.oninput = debounce(({ target }) => {
          value.cb(target.value)
        }, value.wait)
      }
    })
  }
}