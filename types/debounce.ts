export interface Debounce {
  (fn: (...args: any[]) => void, wait: number | string): void
}

declare const debounce: Debounce

export default debounce
