import type { JsxConfig, UserJsxConfig } from './types.js'

export function defineConfig(config: UserJsxConfig): JsxConfig {
  return {
    mail: {
      context: true,
      ...config.mail,
    },
  }
}
