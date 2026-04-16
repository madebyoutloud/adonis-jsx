import type { JsxConfig } from './types.js'

export function defineConfig<T extends JsxConfig>(config: T): T {
  return config
}
