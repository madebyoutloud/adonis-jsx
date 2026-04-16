import type { ApplicationService } from '@adonisjs/core/types'
import type { HttpRequest } from '@adonisjs/core/http'
import type { Context, JSX } from 'react'

export interface GlobalState {
  app: ApplicationService
  config: ApplicationService['config']
  [key: string]: unknown
}

export interface HttpState extends GlobalState {
  request: HttpRequest
}

export type RenderFn = (template: JSX.Element, state: GlobalState) => Promise<string> | string

export interface JsxConfig {
  mail: {
    /**
     * Automatically inject global state or custom context provider
     * @default true
     */
    context: boolean | Context<GlobalState>
    render?: RenderFn
  }
}

export interface UserJsxConfig {
  mail?: Partial<JsxConfig['mail']>
}
