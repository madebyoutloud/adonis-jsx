import { createContext } from 'react'
import type { GlobalState, HttpState } from './types.js'

export const GlobalContext = createContext<GlobalState>({} as GlobalState)
export const HttpContext = GlobalContext as unknown as React.Context<HttpState>
