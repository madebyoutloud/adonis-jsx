import type { LazyImport } from '@adonisjs/core/types/common'
import type { MailerTemplateEngine } from '@adonisjs/mail/types'
import type { FC, JSX } from 'react'
import type { JsxEngine } from './jsx_engine.js'

export class MailTemplateEngine implements MailerTemplateEngine {
  constructor(private jsxEngine: JsxEngine) {}

  async render(
    template: string | LazyImport<FC> | JSX.Element,
    sharedState: any = {},
    data?: any,
  ): Promise<string> {
    if (typeof template === 'string') {
      return ''
    }

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
