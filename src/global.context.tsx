import { createContext } from 'react'
import type { GlobalState } from './types.js'

export const GlobalContext = createContext<GlobalState | undefined>(undefined)
