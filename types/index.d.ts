import type { ObjectDirective } from 'vue'

export interface PluginConfig {
  lock?: boolean
  listenTo?: string | string[]
  defaultTime?: string | number
  fireOnEmpty?: boolean,
  cancelOnEmpty?: boolean,
  trim?: boolean
}

// The value bound to the directive, e.g. v-debounce:300ms="myFn"
export type DebouncedCallback = (value: string, event: Event) => void

// The modifiers vue-debounce understands, e.g. v-debounce:300ms.lock="myFn"
export type Modifier = 'lock' | 'unlock' | 'fireonempty' | 'cancelonempty' | 'trim'

export type DirectiveObject = ObjectDirective<HTMLElement, DebouncedCallback, Modifier, string>

interface DebounceInstance<A extends unknown[]> {
  (...args: A): void | Promise<void>,
  cancel(): void,
}

interface Debounce {
  <A extends unknown[]>(fn: (...args: A) => void | Promise<void>, wait: number | string): DebounceInstance<A>
}

declare const debounce: Debounce
declare const vueDebounce: (opts?: PluginConfig) => DirectiveObject

export { debounce, vueDebounce, DebounceInstance }
export default vueDebounce
