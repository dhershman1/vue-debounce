import debounce from './debounce'
import vueDebounce from './directive'
import vue3Debounce from './vue3_directive'

export {
  debounce,
  vue3Debounce
}

export default {
  install (Vue, opts = {}) {
    Vue.directive('debounce', vueDebounce(opts))
  }
}
