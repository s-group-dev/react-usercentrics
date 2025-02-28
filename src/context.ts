import { createContext } from 'react'

import type { ServiceInfoFromLocalStorage } from './types.v2.js'

export type UsercentricsBrowserIntegrationState = {
    hasInteracted: boolean
    isClientSide: boolean
    isFailed: boolean
    isInitialized: boolean
    isOpen: boolean
    localStorageState: ServiceInfoFromLocalStorage[]
    ping: symbol
}

export const SSR_INITIAL_STATE: UsercentricsBrowserIntegrationState = {
    hasInteracted: false,
    isClientSide: false,
    isFailed: false,
    isInitialized: false,
    isOpen: false,
    localStorageState: [],
    ping: Symbol(),
}

type UsercentricsContextType = UsercentricsBrowserIntegrationState & {
    strictMode: boolean
}

const INITIAL_STATE: UsercentricsContextType = {
    ...SSR_INITIAL_STATE,
    strictMode: false,
}

export const UsercentricsContext = createContext<UsercentricsContextType>(INITIAL_STATE)
