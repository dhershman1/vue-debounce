/*
 * TODO 12/1/2019 - It would be nice if we could add types to the modifiers and expected callback value of the directive but this does
 *  not seem to be possible right now.
 *
 * Both of the types are marked as any without any generic support so not much we can do. This might change in the future when Vue is
 * actually written in typescript as per the road map for Vue 3 https://github.com/vuejs/roadmap#3x
 * "value" type - https://github.com/vuejs/vue/blob/fd0eaf92948bb5a4882d538362091fb287d642e3/types/vnode.d.ts#L70
 * "modifiers" type - https://github.com/vuejs/vue/blob/fd0eaf92948bb5a4882d538362091fb287d642e3/types/options.d.ts#L184
 */

import debounce from './debounce'

export interface PluginConfig {
  lock?: boolean
  listenTo?: string | string[]
  defaultTime?: string | number
}

export interface PluginObject {
  // We could type the Vue object here instead of "any" but that would require making Vue a devDependency and it doesn't seem worth it.
  // Considering a user of this code will never call install directly, it will be called by Vue.
  install (Vue: any, pluginConfig?: PluginConfig): void
}

declare const pluginObject: PluginObject

export { debounce }
export default pluginObject
