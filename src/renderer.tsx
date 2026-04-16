import type { LazyImport } from '@adonisjs/core/types/common'
import type { FC, JSX } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { GlobalState } from './types.js'

export class Renderer<State extends object = Record<string, any>> {
  private locals: State = {} as State

  constructor(private globals: GlobalState) {

  }

  share(data: Partial<State>) {
    Object.assign(this.locals, data)
    return this
  }

  state(): GlobalState & State {
    return { ...this.globals, ...this.locals }
  }

  async render<T = object>(
    template: LazyImport<FC<T>> | JSX.Element,
    ...args: object extends T ? never[] : [data: NoInfer<T>]
  ): Promise<string> {
    const Template = await this.template(template)
    const { GlobalContext } = await import('./global.context.jsx')

    return renderToStaticMarkup(
      <GlobalContext.Provider value={this.state()}>
        <Template {...((args[0] ?? {}) as any)} />
      </GlobalContext.Provider>,
    )
  }

  async template<T = never>(template: string | LazyImport<FC<T>> | JSX.Element): Promise<FC<T>> {
    if (typeof template === 'string') {
      const imported = await import(template)
      return imported.default
    } else if (typeof template === 'function') {
      const imported = await template()
      return imported.default
    }

    return () => template as any
  }
}
