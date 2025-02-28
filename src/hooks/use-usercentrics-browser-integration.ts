import { useEffect, useState } from 'react'

import { SSR_INITIAL_STATE, type UsercentricsBrowserIntegrationState } from '../context.js'
import { type UCUICMPEvent, UCUICMPEventType } from '../types.js'
import { getServicesFromLocalStorage, hasUserInteracted, isOpen } from '../utils.js'

const UC_UI_CMP_EVENT = 'UC_UI_CMP_EVENT'

const isUCUICMPEvent = (event: Event): event is UCUICMPEvent => event.type === UC_UI_CMP_EVENT

export const useUsercentricsBrowserIntegration = (
    windowEventName: string,
    timeout = 5000,
): UsercentricsBrowserIntegrationState => {
    const [state, setState] = useState<UsercentricsBrowserIntegrationState>(SSR_INITIAL_STATE)

    /**
     * This effect runs once on mount and starts up the local state. It also sets up the necessary event listeners
     * to react to the UC UI dialog opening/closing.
     */
    useEffect(() => {
        setState((current) => ({ ...current, isClientSide: true, localStorageState: getServicesFromLocalStorage() }))

        if ('UC_UI' in window) {
            /** UC_UI already started before this mounted, dialog might be open */
            setState((current) => ({ ...current, isInitialized: true, isOpen: isOpen() }))
        } else {
            /** Otherwise, start waiting for initialization. There will be a separate event when dialog opens. */
            window.addEventListener(
                'UC_UI_INITIALIZED',
                () => setState((current) => ({ ...current, isInitialized: true })),
                { once: true },
            )
        }

        /** Might have interacted with UC earlier, for example previous session. */
        if (hasUserInteracted()) {
            setState((current) => ({ ...current, hasInteracted: true }))
        }

        /** Keep track of UC dialog open/closed state */
        const handleCMPEvent = (event: Event) => {
            if (isUCUICMPEvent(event)) {
                switch (event.detail.type) {
                    case UCUICMPEventType.CMP_SHOWN: {
                        setState((current) => ({ ...current, isOpen: true }))
                        break
                    }

                    case UCUICMPEventType.ACCEPT_ALL:
                    case UCUICMPEventType.DENY_ALL:
                    case UCUICMPEventType.SAVE: {
                        setState((current) => ({ ...current, isOpen: false, hasInteracted: true }))
                        break
                    }
                }
            }
        }

        window.addEventListener(UC_UI_CMP_EVENT, handleCMPEvent)

        return () => {
            window.removeEventListener(UC_UI_CMP_EVENT, handleCMPEvent)
        }
    }, [])

    /**
     * This effects sets up the listener to declare UC_UI as failed, if it hasn't been initialized
     * before running out of time. This will be reset if the timeout prop changes, but that's not
     * expected usage and probably doesn't matter here.
     */
    useEffect(() => {
        const handleTimeout = setTimeout(() => {
            setState((current) => {
                if (current.isInitialized) {
                    /** return current state to skip re-rendering */
                    return current
                }

                return { ...current, isFailed: true }
            })

            return () => {
                clearTimeout(handleTimeout)
            }
        }, timeout)
    }, [timeout])

    /**
     * This effects hooks into the configured UC_UI window event, and makes sure the internal
     * state is updated whenever UC_UI updates its values. This typically means there are new
     * consent settings, so hooks inside this provider should be updated.
     *
     * The event name is arbitrary and has to be configured in the Admin UI
     * @see https://docs.usercentrics.com/#/v2-events?id=usage-as-window-event
     */
    useEffect(() => {
        const handleWindowEvent = () => setState((current) => ({ ...current, ping: Symbol() }))

        window.addEventListener(windowEventName, handleWindowEvent)

        return () => {
            window.removeEventListener(windowEventName, handleWindowEvent)
        }
    }, [windowEventName])

    return state
}
