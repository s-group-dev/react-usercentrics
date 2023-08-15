import { renderHook } from '@testing-library/react'
import type { ContextType, FC, ReactNode } from 'react'
import React from 'react'

import { UsercentricsContext } from '../../src/context.js'
import { useAreAllConsentsAccepted } from '../../src/hooks/use-are-all-consents-accepted.js'
import * as utils from '../../src/utils.js'

const mockAreAllConsentsAccepted = jest.spyOn(utils, 'areAllConsentsAccepted')

describe('Usercentrics', () => {
    describe('hooks', () => {
        describe('useAreAllConsentsAccepted', () => {
            const CONTEXT: ContextType<typeof UsercentricsContext> = {
                hasInteracted: false,
                isClientSide: true,
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
                ({ children }) => (
                    <UsercentricsContext.Provider value={{ ...CONTEXT, ...context }}>
                        {children}
                    </UsercentricsContext.Provider>
                )

            it('should return null during SSR', () => {
                const { result } = renderHook(() => useAreAllConsentsAccepted(), {
                    wrapper: getWrapper({ isClientSide: false }),
                })

                expect(result.current).toEqual(null)
            })

            it('should return null when not initialized', () => {
                const { result } = renderHook(() => useAreAllConsentsAccepted(), {
                    wrapper: getWrapper({ isInitialized: false }),
                })

                expect(result.current).toEqual(null)
            })

            it('should return false when not all consent is given', () => {
                mockAreAllConsentsAccepted.mockReturnValue(false)

                const { result } = renderHook(() => useAreAllConsentsAccepted(), {
                    wrapper: getWrapper(),
                })

                expect(result.current).toEqual(false)
            })

            it('should return true when all consent is given', () => {
                mockAreAllConsentsAccepted.mockReturnValue(true)

                const { result } = renderHook(() => useAreAllConsentsAccepted(), {
                    wrapper: getWrapper(),
                })

                expect(result.current).toEqual(true)
            })
        })
    })
})