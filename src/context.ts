import { createContext } from 'react'

import type { ServiceInfoFromLocalStorage } from './types.js'

interface UsercentricsContextType {
    hasInteracted: boolean
    isClientSide: boolean
    isFailed: boolean
    isInitialized: boolean
    isOpen: boolean
    localStorageState: ServiceInfoFromLocalStorage[]
    ping: symbol
    strictMode: boolean
}

const INITIAL_STATE: UsercentricsContextType = {
    hasInteracted: false,
    isClientSide: false,
    isFailed: false,
    isInitialized: false,
    isOpen: false,
    localStorageState: [],
    ping: Symbol(),
    strictMode: false,
}

export const UsercentricsContext = createContext<UsercentricsContextType>(INITIAL_STATE)
