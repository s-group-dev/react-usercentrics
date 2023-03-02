import { fireEvent } from '@testing-library/react'

import { UCUICMPEventType } from '../src'
import { ServiceState, UsercentericsService } from '../src/services/usercentrics-service'

describe('User centrics service', () => {
    it('should subscribe to window events and trigger callback', () => {
        const f = jest.fn()

        UsercentericsService.subscribe(f)

        fireEvent(window, createEvent(UCUICMPEventType.CMP_SHOWN))
        expect(f).toHaveBeenCalled()
    })

    it('state value must not be the same instance', () => {
        const a = UsercentericsService.getState()
        fireEvent(window, createEvent(UCUICMPEventType.CMP_SHOWN))
        const b = UsercentericsService.getState()
        expect(a === b).toBeFalsy()
    })

    it('consecutive subscribe state values must not be the same instance', () => {
        const mockState: { a: ServiceState | null; b: ServiceState | null } = {
            a: null,
            b: null,
        }

        const unsub = UsercentericsService.subscribe((state) => {
            mockState.a = state
        })
        fireEvent(window, createEvent(UCUICMPEventType.CMP_SHOWN))

        // same state is passed to all listeners, not two consecutive states should be equal
        // so we remove the first listener to not assign value again to 'a'
        unsub()

        UsercentericsService.subscribe((state) => {
            mockState.b = state
        })
        fireEvent(window, createEvent(UCUICMPEventType.CMP_SHOWN))

        expect(mockState.a).not.toBeNull()
        expect(mockState.b).not.toBeNull()
        expect(mockState.a === mockState.b).toBeFalsy()
    })

    it('should be able to unsubscribe from window events', () => {
        const f = jest.fn()
        const f_2 = jest.fn()

        const unsub = UsercentericsService.subscribe(f)
        UsercentericsService.subscribe(f_2)

        fireEvent(window, createEvent(UCUICMPEventType.CMP_SHOWN))
        expect(f).toHaveBeenCalledTimes(1)
        expect(f_2).toHaveBeenCalledTimes(1)

        unsub()
        fireEvent(window, createEvent(UCUICMPEventType.CMP_SHOWN))
        expect(f).toHaveBeenCalledTimes(1)
        expect(f_2).toHaveBeenCalledTimes(2)
    })

    it('should get updated state on init', () => {
        fireEvent(window, createEvent(UCUICMPEventType.CMP_SHOWN))
        expect(UsercentericsService.getState()).toEqual(createState({ isOpen: true }))
    })

    it('should set state to open', () => {
        const f = jest.fn()

        UsercentericsService.subscribe(f)

        fireEvent(window, createEvent(UCUICMPEventType.CMP_SHOWN))
        expect(f).toHaveBeenCalledWith(createState({ isOpen: true }))
    })

    it('should set state to closed', () => {
        const f = jest.fn()

        UsercentericsService.subscribe(f)

        fireEvent(window, createEvent(UCUICMPEventType.ACCEPT_ALL))
        expect(f).toHaveBeenCalledWith(createState({ isOpen: false }))
    })

    it('should set state to closed', () => {
        const f = jest.fn()

        UsercentericsService.subscribe(f)

        fireEvent(window, createEvent(UCUICMPEventType.DENY_ALL))
        expect(f).toHaveBeenCalledWith(createState({ isOpen: false }))
    })

    it('should set state to closed', () => {
        const f = jest.fn()

        UsercentericsService.subscribe(f)

        fireEvent(window, createEvent(UCUICMPEventType.SAVE))
        expect(f).toHaveBeenCalledWith(createState({ isOpen: false }))
    })
})

const createEvent = (type: UCUICMPEventType) => {
    const e = new Event('UC_UI_CMP_EVENT') as Event & { detail: { type: UCUICMPEventType } }
    e.detail = {
        type,
    }
    return e
}

const createState = (x: Partial<ServiceState>): ServiceState => ({
    initialized: false,
    isOpen: false,
    ...x,
})
