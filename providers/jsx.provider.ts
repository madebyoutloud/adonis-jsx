import type { ApplicationService } from '@adonisjs/core/types'
import { HttpContext } from '@adonisjs/core/http'
import type { LazyImport } from '@adonisjs/core/types/common'
import type { FC } from 'react'
import { JsxEngine } from '../src/jsx_engine.js'
import { MailTemplateEngine } from '../src/mail_template_engine.js'
import type { Renderer } from '../src/renderer.js'
import type { HttpState } from '../src/types.js'

export default class JsxProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(JsxEngine, async () => {
      return new JsxEngine()
    })

    this.app.container.alias('jsx', JsxEngine)
  }

  async boot() {
    const jsx = await this.app.container.make('jsx')

    jsx.global({
      app: this.app,
      config: this.app.config,
    })

    HttpContext.getter('jsx', function (this: HttpContext) {
      return jsx.renderer().share({ request: this.request })
    })

    if (this.app.container.hasBinding('mail.manager')) {
      const { Message } = await import('@adonisjs/mail')
      Message.templateEngine = new MailTemplateEngine(jsx)
    }
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    jsx: Renderer<HttpState>
  }
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    jsx: JsxEngine
  }
}

declare module '@adonisjs/mail' {
  export interface Message {
    htmlView<T = never>(template: LazyImport<FC<T>>, data: T): this
    htmlView(template: string, data?: any): this
  }
}

declare module '@adonisjs/mail/types' {
  export interface MailerTemplateEngine {
    render(template: string | LazyImport<FC>, data?: any): Promise<string>
  }
}
