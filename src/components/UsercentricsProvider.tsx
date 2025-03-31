import { type FC, type ReactNode } from 'react'
import React from 'react'

import { UsercentricsContext } from '../context.js'
import { useUsercentricsEventListener } from '../hooks/use-usercentrics-event-listener.js'

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
}

export const UsercentricsProvider: FC<UsercentricsProviderProps> = ({ children, strictMode = false, timeout }) => {
    const state = useUsercentricsEventListener({ timeout })

    return (
        <UsercentricsContext.Provider
            value={{
                consents: state.consents,
                hasInteracted: state.hasInteracted,
                isClientSide: state.isClientSide,
                isFailed: state.isFailed,
                isInitialized: state.isInitialized,
                isOpen: state.isOpen,
                strictMode,
            }}
        >
            {children}
        </UsercentricsContext.Provider>
    )
}
