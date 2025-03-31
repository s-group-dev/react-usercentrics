import { renderHook } from '@testing-library/react'
import type { ContextType, FC, ReactNode } from 'react'
import React from 'react'

import { UsercentricsContext } from '../../src/context.js'
import { useHasServiceConsent } from '../../src/hooks/use-has-service-consent.js'

describe('Usercentrics', () => {
    describe('hooks', () => {
        describe('useHasServiceConsent', () => {
            const CONTEXT: ContextType<typeof UsercentricsContext> = {
                hasInteracted: false,
                isClientSide: true,
                isFailed: false,
                isInitialized: true,
                isOpen: false,
                consents: {},
                strictMode: false,
            }

            const getWrapper = (
                context?: Partial<ContextType<typeof UsercentricsContext>>,
            ): FC<{ children: ReactNode }> => {
                const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
                    <UsercentricsContext.Provider value={{ ...CONTEXT, ...context }}>
                        {children}
                    </UsercentricsContext.Provider>
                )

                return Wrapper
            }

            it('should return null during SSR', () => {
                const { result } = renderHook(() => useHasServiceConsent('test-id'), {
                    wrapper: getWrapper({ isClientSide: false }),
                })

                expect(result.current).toEqual(null)
            })

            it('should return false when service not found', () => {
                const { result } = renderHook(() => useHasServiceConsent('test-id'), {
                    wrapper: getWrapper(),
                })

                expect(result.current).toEqual(false)
            })

            it('should return false when no consent', () => {
                const { result } = renderHook(() => useHasServiceConsent('test-id'), {
                    wrapper: getWrapper({
                        consents: {
                            'test-id': false,
                        },
                    }),
                })

                expect(result.current).toEqual(false)
            })

            it('should return true when consent is given', () => {
                const { result } = renderHook(() => useHasServiceConsent('test-id'), {
                    wrapper: getWrapper({
                        consents: {
                            'test-id': true,
                        },
                    }),
                })

                expect(result.current).toEqual(true)
            })
        })
    })
})
