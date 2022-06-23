import { renderHook } from '@testing-library/react'

import { useHasServiceConsent } from '../../src/hooks/use-has-service-consent'
import * as UseServiceInfoNS from '../../src/hooks/use-service-info'

const mockUseServiceInfo = jest.spyOn(UseServiceInfoNS, 'useServiceInfo')

describe('Usercentrics', () => {
    describe('hooks', () => {
        describe('useHasServiceConsent', () => {
            it('should return false when service not found', () => {
                mockUseServiceInfo.mockReturnValue(null)

                const { result } = renderHook(() => useHasServiceConsent('test-id'))

                expect(result.current).toEqual(false)
            })

            it('should return false when no consent', () => {
                mockUseServiceInfo.mockReturnValue({
                    id: 'test-id',
                    name: 'Salesforce',
                    consent: { status: false },
                })

                const { result } = renderHook(() => useHasServiceConsent('test-id'))

                expect(result.current).toEqual(false)
            })

            it('should return true when consent is given', () => {
                mockUseServiceInfo.mockReturnValue({
                    id: 'test-id',
                    name: 'Salesforce',
                    consent: { status: true },
                })

                const { result } = renderHook(() => useHasServiceConsent('test-id'))

                expect(result.current).toEqual(true)
            })
        })
    })
})
