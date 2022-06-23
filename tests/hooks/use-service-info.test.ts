import { renderHook, waitFor } from '@testing-library/react'

import { useServiceFullInfo, useServiceInfo } from '../../src/hooks/use-service-info'
import type { ServiceFullInfo, ServiceInfo } from '../../src/types'
import * as utils from '../../src/utils'

const mockGetServicesBaseInfo = jest.spyOn(utils, 'getServicesBaseInfo')
const mockGetServicesFullInfo = jest.spyOn(utils, 'getServicesFullInfo')

describe('Usercentrics', () => {
    describe('hooks', () => {
        test('useServiceInfo', () => {
            const mockServiceInfo: ServiceInfo = {
                id: 'test-id',
                name: 'Giosg',
                consent: { status: false },
            }

            mockGetServicesBaseInfo.mockReturnValue([mockServiceInfo])

            const { result } = renderHook(() => useServiceInfo('test-id'))

            expect(result.current).toEqual(mockServiceInfo)
        })

        test('useServiceFullInfo', async () => {
            const mockServiceFullInfo: ServiceFullInfo = {
                id: 'test-id',
                name: 'Giosg',
                consent: { status: false },
                description: 'Test',
            }

            mockGetServicesFullInfo.mockReturnValue(Promise.resolve([mockServiceFullInfo]))

            const { result } = renderHook(() => useServiceFullInfo('test-id'))

            await waitFor(() => {
                expect(result.current).toEqual(mockServiceFullInfo)
            })
        })
    })
})
