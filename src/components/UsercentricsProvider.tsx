import { FC, ReactNode, useMemo } from 'react'
import React, { useCallback, useEffect, useState } from 'react'

import { UsercentricsContext } from '../context.js'
import { ServiceState, UsercentericsService } from '../services/usercentrics-service.js'
import { getServicesFromLocalStorage } from '../utils.js'

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
    timeout = 5000,
    windowEventName,
}) => {
    /**
     * A trivial unique value that should be updated whenever
     * Usercentrics data is updated. This is for making sure
     * hooks using the data are also update.
     */
    const [ping, pong] = useState(Symbol())

    /** True if Usercentrics failed to load. */
    const [isFailed, setIsFailed] = useState(false)
    const [state, setState] = useState<ServiceState>(UsercentericsService.getState())

    /**
     * Immutable value must be used from the service, or state update will fail to trigger update react
     */
    useEffect(() => {
        const unsub = UsercentericsService.subscribe(setState)
        return unsub
    }, [])

    const [isClientSide, setIsClientSide] = useState(false)
    useEffect(() => setIsClientSide(true), [])

    /**
     * If user has blocked Usercentrics initialization script, update the var.
     * Used to eg. allow search using minimal consent options
     */
    useEffect(() => {
        const t = setTimeout(() => {
            if (!state.initialized) {
                setIsFailed(true)
            }
        }, timeout)
        return () => clearTimeout(t)
    }, [state, timeout])

    const ucEventCallback = useCallback(() => pong(Symbol()), [pong])
    useEffect(() => {
        /**
         * The event name is arbitrary and has to configured in the Admin UI
         * @see https://docs.usercentrics.com/#/v2-events?id=usage-as-window-event
         */
        window.addEventListener(windowEventName, ucEventCallback)
        return () => window.removeEventListener(windowEventName, ucEventCallback)
    }, [ucEventCallback, windowEventName])

    /**
     * Try to read current setting from localStorage. These are only used until the CMP has been loaded,
     * and after window.UC_UI is preferred. There should be no need to refresh the values.
     */
    const localStorageState = useMemo(getServicesFromLocalStorage, [])

    return (
        <UsercentricsContext.Provider
            value={{
                isClientSide,
                isFailed,
                isInitialized: state.initialized,
                isOpen: state.isOpen,
                localStorageState,
                ping,
                strictMode,
            }}
        >
            {children}
        </UsercentricsContext.Provider>
    )
}
