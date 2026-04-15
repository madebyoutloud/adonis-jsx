import app from '@adonisjs/core/services/app'

import type { JsxEngine } from '../src/jsx_engine.js'

// eslint-disable-next-line import/no-mutable-exports
let jsx: JsxEngine

await app?.booted(async () => {
  jsx = await app.container.make('jsx')
})

export { jsx as default }
