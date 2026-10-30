import { onUnmounted } from 'vue'
import debounce from './debounce.js'

/**
 * Composable wrapper around debounce that cancels any pending call when the
 * current component unmounts. Call this once in `setup()` and reuse the
 * function it returns
 * @param {Function} fn The function to debounce
 * @param {string|number} wait The wait time, e.g. 300, '300ms', or '1s'
 * @returns {Function} The debounced function, with a `.cancel()` to drop any pending call
 */
export default function useDebounce (fn, wait) {
  const debounced = debounce(fn, wait)

  onUnmounted(() => {
    debounced.cancel()
  })

  return debounced
}
