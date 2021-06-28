import debounce from './debounce'
import { getDirective } from './directive'

export { debounce, getDirective }

export default {
  install (Vue, opts = {}) {
    Vue.directive('debounce', getDirective(Vue.version, opts))
  }
}
