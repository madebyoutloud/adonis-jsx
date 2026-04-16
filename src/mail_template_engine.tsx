import type { LazyImport } from '@adonisjs/core/types/common'
import type { MailerTemplateEngine } from '@adonisjs/mail/types'
import type { Context, FC, JSX } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { JsxEngine } from './jsx_engine.js'
import type { GlobalState } from './types.js'

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

    let context: Context<GlobalState> | undefined

    if (this.jsx.mail.context === true) {
      const { GlobalContext } = await import('./global.context.js')
      context = GlobalContext
    } else if (this.jsx.mail.context) {
      context = this.jsx.mail.context
    }

    if (context) {
      element = <context.Provider value={state}>{element}</context.Provider>
    }

    if (this.jsx.mail.render) {
      return await this.jsx.mail.render(element, state)
    }

    return renderToStaticMarkup(element)
  }
}
