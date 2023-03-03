import { createContext } from 'react'

import { ServiceInfoFromLocalStorage } from './types.js'

interface UsercentricsContextType {
    isClientSide: boolean
    isFailed: boolean
    isInitialized: boolean
    isOpen: boolean
    localStorageState: ServiceInfoFromLocalStorage[]
    ping: symbol
    strictMode: boolean
}

const INITIAL_STATE: UsercentricsContextType = {
    isClientSide: false,
    isFailed: false,
    isInitialized: false,
    isOpen: false,
    localStorageState: [],
    ping: Symbol(),
    strictMode: false,
}

export const UsercentricsContext = createContext<UsercentricsContextType>(INITIAL_STATE)
