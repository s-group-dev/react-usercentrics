/** State management singleton for internal use. This should not be used directly in applications. */

import { UCUICMPEvent, UCUICMPEventType } from '../types.js'

export type ServiceState = {
    initialized: boolean
    isOpen: boolean
}

const isUCUICMPEvent = (event: Event): event is UCUICMPEvent => event.type === 'UC_UI_CMP_EVENT'

/**
 * value needs to be immutable, ie. this cannot be a const as react will need a new object instance to update its state
 * or this would need to be refactored as part of class or an object
 */
let state: ServiceState = {
    initialized: false,
    isOpen: false,
}

const listeners: ((x: ServiceState) => void)[] = []
const update = () => listeners.forEach((s) => s(state))
const subscribe = (x: (x: ServiceState) => void): (() => void) => {
    listeners.push(x)
    return () => {
        listeners.indexOf(x) > -1 ? listeners.splice(listeners.indexOf(x), 1) : undefined
    }
}

const setIsOpen = (isOpen: boolean) => {
    state = { ...state, isOpen }
    update()
}
const setIsInitialized = (initialized: boolean) => {
    state = { ...state, initialized }
    update()
}

const onEvent = (event: Event) => {
    if (isUCUICMPEvent(event)) {
        switch (event.detail.type) {
            case UCUICMPEventType.CMP_SHOWN:
                setIsOpen(true)
                break
            case UCUICMPEventType.ACCEPT_ALL:
            case UCUICMPEventType.DENY_ALL:
            case UCUICMPEventType.SAVE:
                setIsOpen(false)
                break
        }
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('UC_UI_CMP_EVENT', onEvent)
    window.addEventListener('UC_UI_INITIALIZED', () => setIsInitialized(true))
}

export const UsercentericsService = {
    getState: () => state,
    subscribe,
}
