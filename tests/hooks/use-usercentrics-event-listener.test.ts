import { act, fireEvent, renderHook } from '@testing-library/react'

import { useUsercentricsEventListener } from '../../src/hooks/use-usercentrics-event-listener.js'
import { type UCUICMPEvent, UCUICMPEventType, type UCWindow } from '../../src/types.js'
import { getServicesConsentsFromLocalStorage, hasUserInteracted, isOpen } from '../../src/utils.js'

jest.mock('../../src/utils.js', () => ({
    getServicesConsentsFromLocalStorage: jest.fn().mockReturnValue([]),
    hasUserInteracted: jest.fn().mockReturnValue(false),
    isOpen: jest.fn().mockReturnValue(false),
    setUserHasInteracted: jest.fn(),
}))

jest.useFakeTimers()

const ucUICMPEvent = (type: UCUICMPEventType): UCUICMPEvent =>
    new CustomEvent('UC_UI_CMP_EVENT', { detail: { type } }) as UCUICMPEvent

describe('Usercentrics', () => {
    describe('hooks', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        describe('useUsercentricsEventListener', () => {
            it('should return "isClientSide: true"', () => {
                const { result } = renderHook(() => useUsercentricsEventListener({}))

                expect(result.current).toEqual(
                    expect.objectContaining({
                        isClientSide: true,
                        isInitialized: false,
                        hasInteracted: false,
                    }),
                )
            })

            it(`return service status from localStorage`, () => {
                jest.mocked(getServicesConsentsFromLocalStorage).mockReturnValueOnce({
                    'test-id': {
                        consent: true,
                        name: 'Test Service',
                    },
                })

                const { result } = renderHook(() => useUsercentricsEventListener({}))

                expect(result.current.localStorageState).toEqual({ 'test-id': { consent: true, name: 'Test Service' } })
            })

            it('should return "isInitialized: true" when "__ucCmp" in window', () => {
                ;(window as UCWindow).__ucCmp = {} as UCWindow['__ucCmp']

                const { result } = renderHook(() => useUsercentricsEventListener({}))

                expect(result.current).toEqual(
                    expect.objectContaining({
                        isClientSide: true,
                        isInitialized: true,
                        isOpen: false,
                        hasInteracted: false,
                    }),
                )

                delete (window as UCWindow).__ucCmp
            })

            it('should return "isOpen: true" when "UC_UI" in window and dialog already visible', () => {
                ;(window as UCWindow).__ucCmp = {} as UCWindow['__ucCmp']

                jest.mocked(isOpen).mockReturnValueOnce(true)

                const { result } = renderHook(() => useUsercentricsEventListener({}))

                expect(result.current).toEqual(
                    expect.objectContaining({
                        isClientSide: true,
                        isInitialized: true,
                        isOpen: true,
                        hasInteracted: false,
                    }),
                )

                delete (window as UCWindow).__ucCmp
            })

            it('should set "isInitialized: true" after "UC_UI_INITIALIZED" window event', () => {
                const { result } = renderHook(() => useUsercentricsEventListener({}))

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
                const { result } = renderHook(() => useUsercentricsEventListener({}))

                act(() => {
                    jest.runAllTimers()
                })

                expect(result.current.isFailed).toEqual(true)
            })

            it('should return "hasInteracted: true" when user has interacted with UC previously', () => {
                jest.mocked(hasUserInteracted).mockReturnValueOnce(true)

                const { result } = renderHook(() => useUsercentricsEventListener({}))

                expect(result.current).toEqual(
                    expect.objectContaining({
                        isClientSide: true,
                        isInitialized: false,
                        hasInteracted: true,
                    }),
                )
            })

            describe('Reacting to UC window events', () => {
                it('should return "isOpen: true" on CMP_SHOWN event', () => {
                    const { result } = renderHook(() => useUsercentricsEventListener({}))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false }))

                    fireEvent(window, ucUICMPEvent(UCUICMPEventType.CMP_SHOWN))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: true }))
                })

                it('should return "isOpen: false, hasInteracted: true" on ACCEPT_ALL event', () => {
                    const { result } = renderHook(() => useUsercentricsEventListener({}))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: false }))

                    fireEvent(window, ucUICMPEvent(UCUICMPEventType.ACCEPT_ALL))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: true }))
                })

                it('should return "isOpen: false, hasInteracted: true" on DENY_ALL event', () => {
                    const { result } = renderHook(() => useUsercentricsEventListener({}))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: false }))

                    fireEvent(window, ucUICMPEvent(UCUICMPEventType.DENY_ALL))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: true }))
                })

                it('should return "isOpen: false, hasInteracted: true" on SAVE event', () => {
                    const { result } = renderHook(() => useUsercentricsEventListener({}))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: false }))

                    fireEvent(window, ucUICMPEvent(UCUICMPEventType.SAVE))

                    expect(result.current).toEqual(expect.objectContaining({ isOpen: false, hasInteracted: true }))
                })
            })
        })
    })
})
