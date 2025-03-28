import { createContext } from 'react'

import type { ConsentStatusFromLocalStorage, ServiceId } from './types.js'

export type UsercentricsBrowserIntegrationState = {
    hasInteracted: boolean
    isClientSide: boolean
    isFailed: boolean
    isInitialized: boolean
    isOpen: boolean
    localStorageState: Record<ServiceId, ConsentStatusFromLocalStorage>
}

export const SSR_INITIAL_STATE: UsercentricsBrowserIntegrationState = {
    hasInteracted: false,
    isClientSide: false,
    isFailed: false,
    isInitialized: false,
    isOpen: false,
    localStorageState: {},
}

type UsercentricsContextType = UsercentricsBrowserIntegrationState & {
    strictMode: boolean
}

const INITIAL_STATE: UsercentricsContextType = {
    ...SSR_INITIAL_STATE,
    strictMode: false,
}

export const UsercentricsContext = createContext<UsercentricsContextType>(INITIAL_STATE)
