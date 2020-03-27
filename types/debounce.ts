export interface DebounceInstance {
  (): void,
  cancel(): void,
}

export interface Debounce {
  (fn: (...args: any[]) => void, wait: number | string): DebounceInstance
}

declare const debounce: Debounce

export default debounce
