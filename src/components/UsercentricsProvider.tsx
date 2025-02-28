import { type FC, type ReactNode } from 'react'
import React from 'react'

import { UsercentricsContext } from '../context.js'
import { useUsercentricsBrowserIntegration } from '../hooks/use-usercentrics-browser-integration.js'

interface UsercentricsProviderProps {
    children: ReactNode
    /**
     * Whether to throw if invalid Service Id has been used.
     * @default false
     */
    strictMode?: boolean
    /**
     * The timeout value in milliseconds after which loading of the Usercentrics
     * script will be assumed to have failed.
     * @default 5000
     */
    timeout?: number
    /**
     * The configured window event name from Usercentrics admin interface.
     * @see https://docs.usercentrics.com/#/v2-events?id=usage-as-window-event
     */
    windowEventName: string
}

export const UsercentricsProvider: FC<UsercentricsProviderProps> = ({
    children,
    strictMode = false,
    timeout,
    windowEventName,
}) => {
    const state = useUsercentricsBrowserIntegration(windowEventName, timeout)

    return (
        <UsercentricsContext.Provider
            value={{
                hasInteracted: state.hasInteracted,
                isClientSide: state.isClientSide,
                isFailed: state.isFailed,
                isInitialized: state.isInitialized,
                isOpen: state.isOpen,
                localStorageState: state.localStorageState,
                ping: state.ping,
                strictMode,
            }}
        >
            {children}
        </UsercentricsContext.Provider>
    )
}
