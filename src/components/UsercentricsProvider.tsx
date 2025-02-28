import { type FC, type ReactNode } from 'react'
import React from 'react'

import { UsercentricsContext } from '../context.js'
import { useUsercentricsBrowserIntegration } from '../hooks/use-usercentrics-browser-integration.js'

interface UsercentricsProviderProps {
    children: ReactNode

    /**
     * The specific version of Usercentrics CMP SDK version.
     *
     * @default "2"
     * @example "3"
     * @see https://usercentrics.com/docs/web/v3/
     */
    cmpVersion?: '2' | '3'

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
    cmpVersion = '2',
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
                isCMPv3: cmpVersion === '3',
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
