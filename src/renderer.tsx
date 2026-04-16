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

  async $render<T>(
    template: LazyImport<FC<T>> | JSX.Element,
    data?: T,
  ): Promise<JSX.Element> {
    const Template = await this.template(template)
    const { GlobalContext } = await import('./global.context.jsx')

    const state = { ...this.globals, ...this.locals }

    return (
      <GlobalContext.Provider value={state}>
        <Template {...((data ?? {}) as any)} />
      </GlobalContext.Provider>
    )
  }

  async render<T = object>(
    template: LazyImport<FC<T>> | JSX.Element,
    ...args: object extends T ? never[] : [data: NoInfer<T>]
  ): Promise<string> {
    return renderToStaticMarkup(await this.$render(template, args[0]))
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
