import { act, fireEvent, renderHook } from '@testing-library/react'

import { useUsercentricsBrowserIntegration } from '../../src/hooks/use-usercentrics-browser-integration.js'
import { type UCUICMPEvent, UCUICMPEventType, type UCWindow } from '../../src/types.js'
import { getServicesFromLocalStorage, hasUserInteracted, isOpen } from '../../src/utils.js'

jest.mock('../../src/utils.js', () => ({
    getServicesFromLocalStorage: jest.fn().mockReturnValue([]),
    hasUserInteracted: jest.fn().mockReturnValue(false),
    isOpen: jest.fn().mockReturnValue(false),
}))

jest.useFakeTimers()

const ucUICMPEvent = (type: UCUICMPEventType): UCUICMPEvent =>
    new CustomEvent('UC_UI_CMP_EVENT', { detail: { type } }) as UCUICMPEvent

const windowEventName = 'ucEvent'

describe('Usercentrics', () => {
    describe('hooks', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        describe('useUsercentricsBrowserIntegration', () => {
            it('should return "isClientSide: true"', () => {
                const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                expect(result.current).toEqual(
                    expect.objectContaining({
                        isClientSide: true,
                        isInitialized: false,
                        hasInteracted: false,
                    }),
                )
            })

            it(`return service status from localStorage`, () => {
                jest.mocked(getServicesFromLocalStorage).mockReturnValueOnce([{ id: 'test-id', status: true }])

                const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                expect(result.current.localStorageState).toEqual([{ id: 'test-id', status: true }])
            })

            it('should return "isInitialized: true" when "UC_UI" in window', () => {
                ;(window as UCWindow).UC_UI = {}

                const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                expect(result.current).toEqual(
                    expect.objectContaining({
                        isClientSide: true,
                        isInitialized: true,
                        isOpen: false,
                        hasInteracted: false,
                    }),
                )

                delete (window as UCWindow).UC_UI
            })

            it('should return "isOpen: true" when "UC_UI" in window and dialog already visible', () => {
                ;(window as UCWindow).UC_UI = {}

                jest.mocked(isOpen).mockReturnValueOnce(true)

                const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                expect(result.current).toEqual(
                    expect.objectContaining({
                        isClientSide: true,
                        isInitialized: true,
                        isOpen: true,
                        hasInteracted: false,
                    }),
                )

                delete (window as UCWindow).UC_UI
            })

            it('should set "isInitialized: true" after "UC_UI_INITIALIZED" window event', () => {
                const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                expect(result.current).toEqual(
                    expect.objectContaining({
                        isClientSide: true,
                        isInitialized: false,
                        hasInteracted: false,
                        isFailed: false,
                    }),
                )

                fireEvent(window, new Event('UC_UI_INITIALIZED'))

                expect(result.current).toEqual(
                    expect.objectContaining({
                        isClientSide: true,
                        isInitialized: true,
                        hasInteracted: false,
                        isFailed: false,
                    }),
                )

                act(() => {
                    jest.runAllTimers()
                })

                expect(result.current.isFailed).toEqual(false)
            })

            it('should set "isFailed: true" after timeout if not yet initialized', () => {
                const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                act(() => {
                    jest.runAllTimers()
                })

                expect(result.current.isFailed).toEqual(true)
            })

            it('should return "hasInteracted: true" when user has interacted with UC previously', () => {
                jest.mocked(hasUserInteracted).mockReturnValueOnce(true)

                const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                expect(result.current).toEqual(
                    expect.objectContaining({
                        isClientSide: true,
                        isInitialized: false,
                        hasInteracted: true,
                    }),
                )

                delete (window as UCWindow).UC_UI
            })

            describe('Reacting to UC window events', () => {
                it('should return "isOpen: true" on CMP_SHOWN event', () => {
                    const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false }))

                    fireEvent(window, ucUICMPEvent(UCUICMPEventType.CMP_SHOWN))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: true }))
                })

                it('should return "isOpen: false, hasInteracted: true" on ACCEPT_ALL event', () => {
                    const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: false }))

                    fireEvent(window, ucUICMPEvent(UCUICMPEventType.ACCEPT_ALL))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: true }))
                })

                it('should return "isOpen: false, hasInteracted: true" on DENY_ALL event', () => {
                    const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: false }))

                    fireEvent(window, ucUICMPEvent(UCUICMPEventType.DENY_ALL))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: true }))
                })

                it('should return "isOpen: false, hasInteracted: true" on SAVE event', () => {
                    const { result } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: false }))

                    fireEvent(window, ucUICMPEvent(UCUICMPEventType.SAVE))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: true }))
                })
            })

            it(`should update ping on configured "window event name" (default "${windowEventName}")`, () => {
                const { result, rerender } = renderHook(() => useUsercentricsBrowserIntegration(windowEventName))

                const ping1 = result.current.ping

                rerender()

                const ping2 = result.current.ping

                expect(ping2).toEqual(ping1)

                fireEvent(window, new CustomEvent(windowEventName))

                const ping3 = result.current.ping

                expect(ping3).not.toEqual(ping2)
            })
        })
    })
})
