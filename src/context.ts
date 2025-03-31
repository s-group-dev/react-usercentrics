import { createContext } from 'react'

import type { ServiceId } from './types.js'

export type UsercentricsBrowserIntegrationState = {
    consents: Record<ServiceId, boolean>
    hasInteracted: boolean
    isClientSide: boolean
    isFailed: boolean
    isInitialized: boolean
    isOpen: boolean
}

export const SSR_INITIAL_STATE: UsercentricsBrowserIntegrationState = {
    consents: {},
    hasInteracted: false,
    isClientSide: false,
    isFailed: false,
    isInitialized: false,
    isOpen: false,
}

type UsercentricsContextType = UsercentricsBrowserIntegrationState & {
    strictMode: boolean
}

const INITIAL_STATE: UsercentricsContextType = {
    ...SSR_INITIAL_STATE,
    strictMode: false,
}

export const UsercentricsContext = createContext<UsercentricsContextType>(INITIAL_STATE)
