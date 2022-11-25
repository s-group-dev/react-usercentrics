import { renderHook } from '@testing-library/react'
import type { ContextType, FC, ReactNode } from 'react'
import React from 'react'

import { UsercentricsContext } from '../../src/context'
import { useHasServiceConsent } from '../../src/hooks/use-has-service-consent'
import { useServiceInfo } from '../../src/hooks/use-service-info'

jest.mock('../../src/hooks/use-service-info', () => ({
    useServiceInfo: jest.fn(),
}))

const mockUseServiceInfo = jest.mocked(useServiceInfo)

describe('Usercentrics', () => {
    describe('hooks', () => {
        describe('useHasServiceConsent', () => {
            const CONTEXT: ContextType<typeof UsercentricsContext> = {
                isFailed: false,
                isInitialized: true,
                isOpen: false,
                localStorageState: [],
                ping: Symbol(),
                strictMode: false,
            }

            const getWrapper =
                (context?: Partial<ContextType<typeof UsercentricsContext>>): FC<{ children: ReactNode }> =>
                // eslint-disable-next-line react/display-name
                ({ children }) =>
                    (
                        <UsercentricsContext.Provider value={{ ...CONTEXT, ...context }}>
                            {children}
                        </UsercentricsContext.Provider>
                    )

            it('should read from localStorage and return false when not initialized', () => {
                mockUseServiceInfo.mockReturnValue(null)

                const { result } = renderHook(() => useHasServiceConsent('test-id'), {
                    wrapper: getWrapper({ isInitialized: false, localStorageState: [] }),
                })

                expect(result.current).toEqual(false)
            })

            it('should read from localStorage and return true when not initialized', () => {
                mockUseServiceInfo.mockReturnValue(null)

                const { result } = renderHook(() => useHasServiceConsent('test-id'), {
                    wrapper: getWrapper({ isInitialized: false, localStorageState: [{ id: 'test-id', status: true }] }),
                })

                expect(result.current).toEqual(true)
            })

            it('should return false when service not found', () => {
                mockUseServiceInfo.mockReturnValue(null)

                const { result } = renderHook(() => useHasServiceConsent('test-id'), {
                    wrapper: getWrapper(),
                })

                expect(result.current).toEqual(false)
            })

            it('should return false when no consent', () => {
                mockUseServiceInfo.mockReturnValue({
                    id: 'test-id',
                    name: 'Salesforce',
                    consent: { status: false },
                })

                const { result } = renderHook(() => useHasServiceConsent('test-id'), {
                    wrapper: getWrapper(),
                })

                expect(result.current).toEqual(false)
            })

            it('should return true when consent is given', () => {
                mockUseServiceInfo.mockReturnValue({
                    id: 'test-id',
                    name: 'Salesforce',
                    consent: { status: true },
                })

                const { result } = renderHook(() => useHasServiceConsent('test-id'), {
                    wrapper: getWrapper(),
                })

                expect(result.current).toEqual(true)
            })
        })
    })
})
