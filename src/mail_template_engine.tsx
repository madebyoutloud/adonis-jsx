import type { LazyImport } from '@adonisjs/core/types/common'
import type { MailerTemplateEngine } from '@adonisjs/mail/types'
import type { FC, JSX } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { JsxEngine } from './jsx_engine.js'

export class MailTemplateEngine implements MailerTemplateEngine {
  constructor(private jsx: JsxEngine) {}

  async render(
    template: string | LazyImport<FC> | JSX.Element,
    sharedState: any = {},
    data?: any,
  ): Promise<string> {
    if (typeof template === 'string') {
      return ''
    }

    const renderer = this.jsx.renderer()
    const state = { ...renderer.state(), ...sharedState }
    const Component = await renderer.template(template)

    let element = <Component {...data} />

    if (this.jsx.mail.globals) {
      const { GlobalContext } = await import('./global.context.js')
      element = <GlobalContext.Provider value={state}>{element}</GlobalContext.Provider>
    }

    if (this.jsx.mail.render) {
      return await this.jsx.mail.render(element, state)
    }

    return renderToStaticMarkup(element)
  }
}
