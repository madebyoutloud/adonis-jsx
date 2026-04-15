import type { LazyImport } from '@adonisjs/core/types/common'
import type { FC, JSX } from 'react'
import type { GlobalState } from './types.js'
import { Renderer } from './renderer.js'

export class JsxEngine {
  private globals: GlobalState = {} as GlobalState

  global<K extends keyof GlobalState | (string & {})>(
    name: K,
    value: K extends keyof GlobalState ? GlobalState[K] : unknown,
  ): this
  global(data: Partial<GlobalState> & Record<string, any>): this
  global(name: any, value?: any): this {
    if (typeof name === 'string') {
      this.globals[name as keyof GlobalState] = value
    } else if (name && typeof name === 'object') {
      Object.assign(this.globals, name)
    }

    return this
  }

  renderer() {
    return new Renderer(this.globals)
  }

  async render<T = never>(
    template: string | LazyImport<FC<T>> | JSX.Element,
    data?: T,
  ): Promise<string> {
    return this.renderer().render(template, data)
  }
}
