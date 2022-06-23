import { createContext } from 'react'

interface UsercentricsContextType {
    isFailed: boolean
    isInitialized: boolean
    isOpen: boolean
    ping: symbol
    strictMode: boolean
}

const INITIAL_STATE: UsercentricsContextType = {
    isFailed: false,
    isInitialized: false,
    isOpen: false,
    ping: Symbol(),
    strictMode: false,
}

export const UsercentricsContext = createContext<UsercentricsContextType>(INITIAL_STATE)
