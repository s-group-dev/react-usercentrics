import { useEffect, useState } from 'react'

import { SSR_INITIAL_STATE, type UsercentricsBrowserIntegrationState } from '../context.js'
import { type UCUICMPEvent, UCUICMPEventType, UCUIView, type UCUIVIewChanged } from '../types.js'
import { getServicesConsentsFromLocalStorage, hasUserInteracted, isOpen, setUserHasInteracted } from '../utils.js'

const UC_UI_CMP_EVENT = 'UC_UI_CMP_EVENT'
const UC_UI_VIEW_CHANGED = 'UC_UI_VIEW_CHANGED'
const UC_CONSENT = 'UC_CONSENT'

const isUCUICMPEvent = (event: Event): event is UCUICMPEvent => event.type === UC_UI_CMP_EVENT
const isUCUIViewEvent = (event: Event): event is UCUIVIewChanged => event.type === UC_UI_VIEW_CHANGED

export const useUsercentricsEventListener = ({
    timeout = 5000,
}: {
    timeout?: number
}): UsercentricsBrowserIntegrationState => {
    const [state, setState] = useState<UsercentricsBrowserIntegrationState>(SSR_INITIAL_STATE)

    /**
     * This effect runs once on mount and starts up the local state. It also sets up the necessary event listeners
     * to react to the UC UI dialog opening/closing.
     */
    useEffect(() => {
        setState((current) => ({
            ...current,
            isClientSide: true,
            localStorageState: getServicesConsentsFromLocalStorage(),
        }))

        if ('__ucCmp' in window) {
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

        const handleViewChangedEvent = (event: Event) => {
            if (isUCUIViewEvent(event)) {
                switch (event.detail.view) {
                    case UCUIView.FIRST_LAYER:
                    case UCUIView.SECOND_LAYER: {
                        setState((current) => ({ ...current, isOpen: true }))
                        break
                    }
                    case UCUIView.NONE: {
                        setState((current) => ({ ...current, isOpen: false }))
                        break
                    }
                }
            }
        }

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
                        setUserHasInteracted()
                        setState((current) => ({ ...current, isOpen: false, hasInteracted: true }))
                        break
                    }
                }
            }
        }

        const handleConsentEvent = () => {
            setState((current) => ({
                ...current,
                localStorageState: getServicesConsentsFromLocalStorage(),
            }))
        }

        window.addEventListener(UC_UI_VIEW_CHANGED, handleViewChangedEvent)
        window.addEventListener(UC_UI_CMP_EVENT, handleCMPEvent)
        window.addEventListener(UC_CONSENT, handleConsentEvent)

        return () => {
            window.removeEventListener(UC_UI_VIEW_CHANGED, handleViewChangedEvent)
            window.removeEventListener(UC_UI_CMP_EVENT, handleCMPEvent)
            window.removeEventListener(UC_CONSENT, handleConsentEvent)
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

    return state
}
