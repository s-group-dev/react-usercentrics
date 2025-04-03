import { useEffect, useState } from 'react'

import { SSR_INITIAL_STATE, type UsercentricsBrowserIntegrationState } from '../context.js'
import {
    type ServiceId,
    type UCConsentEvent,
    type UCUICMPEvent,
    UCUICMPEventType,
    UCUIView,
    type UCUIVIewChanged,
} from '../types.js'
import { getConsentsFromLocalStorage, hasUserInteracted, isOpen, setUserHasInteracted } from '../utils.js'

const UC_UI_CMP_EVENT = 'UC_UI_CMP_EVENT'
const UC_UI_VIEW_CHANGED = 'UC_UI_VIEW_CHANGED'
const UC_CONSENT = 'UC_CONSENT'

const isUCUICMPEvent = (event: Event): event is UCUICMPEvent => event.type === UC_UI_CMP_EVENT
const isUCUIViewEvent = (event: Event): event is UCUIVIewChanged => event.type === UC_UI_VIEW_CHANGED
const isUCConsentEvent = (event: Event): event is UCConsentEvent => event.type === UC_CONSENT

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
        const consentsFromLocalStorage = getConsentsFromLocalStorage()
        const consents = Object.entries(consentsFromLocalStorage).reduce(
            (acc, [serviceId, status]) => ({
                ...acc,
                [serviceId]: status.consent,
            }),
            {} as Record<ServiceId, boolean>,
        )

        setState((current) => ({ ...current, consents, isClientSide: true }))

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
                setState((current) => {
                    if (event.detail.view === UCUIView.NONE) {
                        return { ...current, isOpen: false }
                    } else if (!current.isOpen) {
                        return { ...current, isOpen: true }
                    }

                    return current
                })
            }
        }

        const handleCMPEvent = (event: Event) => {
            if (isUCUICMPEvent(event)) {
                switch (event.detail.type) {
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

        const handleConsentEvent = (event: Event) => {
            if (isUCConsentEvent(event)) {
                const consents = Object.entries(event.detail.services).reduce(
                    (acc, [serviceId, data]) => ({
                        ...acc,
                        [serviceId]: data.consent?.given === true,
                    }),
                    {} as Record<ServiceId, boolean>,
                )

                setState((current) => ({ ...current, consents }))
            }
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
        }, timeout)

        return () => {
            clearTimeout(handleTimeout)
        }
    }, [timeout])

    return state
}
