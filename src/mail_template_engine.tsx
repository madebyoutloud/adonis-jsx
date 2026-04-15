import type { LazyImport } from '@adonisjs/core/types/common'
import type { MailerTemplateEngine } from '@adonisjs/mail/types'
import type { FC, JSX } from 'react'
import type { JsxEngine } from './jsx_engine.js'

export class MailTemplateEngine implements MailerTemplateEngine {
  constructor(private jsxEngine: JsxEngine) {}

  async render<T = never>(
    template: string | LazyImport<FC<T>> | JSX.Element,
    sharedState: object = {},
    data?: T,
  ): Promise<string> {
    const renderer = this.jsxEngine.renderer()

    const { render } = await import('jsx-email')

    return await render(
      await renderer.share(sharedState).$render(template, data),
      {
        inlineCss: true,
      },
    )
  }
}
