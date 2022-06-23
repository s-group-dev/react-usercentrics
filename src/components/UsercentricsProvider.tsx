import type { FC, ReactNode } from 'react'
import React, { useCallback, useEffect, useState } from 'react'

import { UsercentricsContext } from '../context'
import type { UCUICMPEvent, UCWindow } from '../types'
import { UCUICMPEventType } from '../types'

const isUCUICMPEvent = (event: Event): event is UCUICMPEvent => event.type === 'UC_UI_CMP_EVENT'

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

/**
 * The provider component for listening to events from the Usercentrics Browser API.
 * Render this once and wrap your application in it.
 *
 * @example <caption>Basic usage</caption>
 * () => <UsercentricsProvider windowEventName="ucEvent"><App /></UsercentricsProvider>
 *
 * @example <caption>Custom timeout in milliseconds</caption>
 * () => <UsercentricsProvider timeout={100} windowEventName="ucEvent"><App /></UsercentricsProvider>
 */
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

    /**
     * True if the Usercentrics consent management platform
     * modal is open on the page.
     */
    const [isOpen, setIsOpen] = useState(false)

    /**
     * True if the Usercentrics consent management platform is
     * initialized and ready to use.
     */
    const [isInitialized, setIsInitialized] = useState(false)

    const initializedCallback = useCallback(() => {
        setIsInitialized(true)
        pong(Symbol())
    }, [])

    const ucEventCallback = useCallback(() => {
        pong(Symbol())
    }, [])

    const ucUIEventCallback = useCallback((event: Event) => {
        if (!isUCUICMPEvent(event)) return

        /**
         * Detect whether the Usercentrics modal is open or closed:
         *
         * - if event type was 'CMP_SHOWN', it is open
         * - if event type was one of 'ACCEPT_ALL', 'DENY_ALL', or
         *   'SAVE', it means user clicked one of those buttons,
         *   and so it should now be closed
         */
        switch (event.detail.type) {
            case UCUICMPEventType.CMP_SHOWN:
                setIsOpen(true)
                break
            case UCUICMPEventType.ACCEPT_ALL:
            case UCUICMPEventType.DENY_ALL:
            case UCUICMPEventType.SAVE:
                setIsOpen(false)
        }
    }, [])

    useEffect(() => {
        if (isFailed) return

        if ((window as UCWindow).UC_UI?.isInitialized?.()) {
            setIsInitialized(true)
        }

        if (!isInitialized) {
            /** @see https://docs.usercentrics.com/#/v2-events?id=app-initialization-browser-ui */
            window.addEventListener('UC_UI_INITIALIZED', initializedCallback)
        }

        /**
         * The event name is arbitrary and has to configured in the Admin UI
         * @see https://docs.usercentrics.com/#/v2-events?id=usage-as-window-event
         */
        window.addEventListener(windowEventName, ucEventCallback)

        /** @see https://docs.usercentrics.com/#/v2-events?id=uc_ui_cmp_event */
        window.addEventListener('UC_UI_CMP_EVENT', ucUIEventCallback)

        /**
         * If user has blocked Usercentrics initialization script, update the var.
         * Used to eg. allow search using minimal consent options
         */
        let isMounted = true
        if (!isInitialized) {
            setTimeout(() => {
                if (isMounted && !isInitialized) {
                    setIsFailed(true)
                }
            }, timeout)
        }

        return () => {
            window.removeEventListener('UC_UI_INITIALIZED', initializedCallback)
            window.removeEventListener(windowEventName, ucEventCallback)
            window.removeEventListener('UC_UI_CMP_EVENT', ucUIEventCallback)
            isMounted = false
        }
    }, [initializedCallback, isFailed, isInitialized, timeout, ucEventCallback, ucUIEventCallback, windowEventName])

    return (
        <UsercentricsContext.Provider
            value={{
                isFailed,
                isInitialized,
                isOpen,
                ping,
                strictMode,
            }}
        >
            {children}
        </UsercentricsContext.Provider>
    )
}
