/** State management singleton for internal use. This should not be used directly in applications. */

import { type UCUICMPEvent, UCUICMPEventType } from '../types.js'
import { hasUserInteracted, IS_BROWSER, isOpen } from '../utils.js'

export type ServiceState = {
    hasInteracted: boolean
    isInitialized: boolean
    isOpen: boolean
}

const isUCUICMPEvent = (event: Event): event is UCUICMPEvent => event.type === 'UC_UI_CMP_EVENT'

/**
 * Value needs to be immutable, ie. this cannot be a const as react will need a new object instance to update its state
 * or this would need to be refactored as part of class or an object
 */
let state: ServiceState = {
    hasInteracted: false,
    isInitialized: false,
    isOpen: false,
}

const listeners: ((x: ServiceState) => void)[] = []
const update = () => listeners.forEach((s) => s(state))
const subscribe = (x: (x: ServiceState) => void): (() => void) => {
    listeners.push(x)
    return () => {
        if (listeners.includes(x)) {
            listeners.splice(listeners.indexOf(x), 1)
        }
    }
}

const setState = (next: Partial<ServiceState>) => {
    state = { ...state, ...next }
    update()
}

const onEvent = (event: Event) => {
    if (isUCUICMPEvent(event)) {
        switch (event.detail.type) {
            case UCUICMPEventType.CMP_SHOWN:
                setState({ isOpen: true })
                break

            case UCUICMPEventType.ACCEPT_ALL:
            case UCUICMPEventType.DENY_ALL:
            case UCUICMPEventType.SAVE:
                setState({ isOpen: false, hasInteracted: true })
                break
        }
    }
}

const initializeState = () => {
    let shouldUpdate = false

    if (!state.isInitialized && IS_BROWSER && 'UC_UI' in window) {
        shouldUpdate = true
        state = { ...state, isInitialized: true, isOpen: isOpen() }
    }

    const hasInteracted = hasUserInteracted()
    /** one of these is true, so user has interacted */
    if (state.hasInteracted !== hasInteracted) {
        shouldUpdate = true
        state = { ...state, hasInteracted: true }
    }

    if (shouldUpdate) {
        update()
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('UC_UI_CMP_EVENT', onEvent)
    window.addEventListener('UC_UI_INITIALIZED', () => setState({ isInitialized: true }), { once: true })
}

export const UsercentericsService = {
    initializeState,
    getState: () => state,
    subscribe,
}
