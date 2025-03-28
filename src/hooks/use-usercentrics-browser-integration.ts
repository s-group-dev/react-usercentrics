import { useEffect, useState } from 'react'

import { SSR_INITIAL_STATE, type UsercentricsBrowserIntegrationState } from '../context.js'
import { type UCUICMPEvent as v2_UCUICMPEvent, UCUICMPEventType as v2_UCUICMPEventType } from '../types.v2.js'
import { type ConsentStatusFromLocalStorage, type ServiceId, type UCUICMPEvent, UCUICMPEventType } from '../types.v3.js'
import {
    getServicesFromLocalStorage as v2_getServicesFromLocalStorage,
    hasUserInteracted as v2_hasUserInteracted,
    isOpen as v2_isOpen,
} from '../utils.v2.js'
import { getServicesConsentsFromLocalStorage, hasUserInteracted, isOpen, setUserHasInteracted } from '../utils.v3.js'

const UC_UI_CMP_EVENT = 'UC_UI_CMP_EVENT'

const isUCUICMPEvent = (event: Event): event is UCUICMPEvent | v2_UCUICMPEvent => event.type === UC_UI_CMP_EVENT

export const useUsercentricsBrowserIntegration = ({
    isCMPv3,
    windowEventName,
    timeout = 5000,
}: {
    isCMPv3: boolean
    /** @deprecated in v2 */
    windowEventName?: string
    timeout?: number
}): UsercentricsBrowserIntegrationState => {
    const [state, setState] = useState<UsercentricsBrowserIntegrationState>(SSR_INITIAL_STATE)

    /**
     * This effect runs once on mount and starts up the local state. It also sets up the necessary event listeners
     * to react to the UC UI dialog opening/closing.
     */
    useEffect(() => {
        const localStorageState = isCMPv3
            ? getServicesConsentsFromLocalStorage()
            : v2_getServicesFromLocalStorage().reduce(
                  (acc, service) => ({
                      ...acc,
                      [service.id]: {
                          consent: service.status,
                          name: '', // backwards-compatibility, not in use
                      },
                  }),
                  {} as Record<ServiceId, ConsentStatusFromLocalStorage>,
              )

        setState((current) => ({ ...current, isClientSide: true, localStorageState }))

        const isInitialized = isCMPv3 ? '__ucCmp' in window : 'UC_UI' in window

        if (isInitialized) {
            /** UC_UI already started before this mounted, dialog might be open */
            setState((current) => ({ ...current, isInitialized: true, isOpen: isCMPv3 ? isOpen() : v2_isOpen() }))
        } else {
            /** Otherwise, start waiting for initialization. There will be a separate event when dialog opens. */
            window.addEventListener(
                'UC_UI_INITIALIZED',
                () => setState((current) => ({ ...current, isInitialized: true })),
                { once: true },
            )
        }

        /** Might have interacted with UC earlier, for example previous session. */
        const hasAlreadyInteractedEarlier = isCMPv3 ? hasUserInteracted() : v2_hasUserInteracted()
        if (hasAlreadyInteractedEarlier) {
            setState((current) => ({ ...current, hasInteracted: true }))
        }

        /** Keep track of UC dialog open/closed state */
        const handleCMPEvent = (event: Event) => {
            if (isUCUICMPEvent(event)) {
                switch (event.detail.type) {
                    case UCUICMPEventType.CMP_SHOWN:
                    case v2_UCUICMPEventType.CMP_SHOWN: {
                        setState((current) => ({ ...current, isOpen: true }))
                        break
                    }

                    case UCUICMPEventType.ACCEPT_ALL:
                    case v2_UCUICMPEventType.ACCEPT_ALL:
                    case UCUICMPEventType.DENY_ALL:
                    case v2_UCUICMPEventType.DENY_ALL:
                    case UCUICMPEventType.SAVE:
                    case v2_UCUICMPEventType.SAVE: {
                        if (isCMPv3) {
                            setUserHasInteracted()
                        }

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
    }, [isCMPv3])

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

    useEffect(() => {
        if (isCMPv3) {
            const handleWindowEvent = () => {
                setState((current) => ({
                    ...current,
                    ping: Symbol(),
                    localStorageState: getServicesConsentsFromLocalStorage(),
                }))
            }

            window.addEventListener('UC_CONSENT', handleWindowEvent)

            return () => {
                window.removeEventListener('UC_CONSENT', handleWindowEvent)
            }
        } else if (windowEventName) {
            /**
             * This effects hooks into the configured UC_UI window event, and makes sure the internal
             * state is updated whenever UC_UI updates its values. This typically means there are new
             * consent settings, so hooks inside this provider should be updated.
             *
             * The event name is arbitrary and has to be configured in the Admin UI
             * @see https://docs.usercentrics.com/#/v2-events?id=usage-as-window-event
             */

            const handleWindowEvent = () => setState((current) => ({ ...current, ping: Symbol() }))

            window.addEventListener(windowEventName, handleWindowEvent)

            return () => {
                window.removeEventListener(windowEventName, handleWindowEvent)
            }
        }
    }, [isCMPv3, windowEventName])

    return state
}
