import type { ServiceInfoFromLocalStorage, SettingsFromLocalStorage, UCWindow } from '../src/types'
import { ConsentType } from '../src/types'
import * as utils from '../src/utils'

describe('Usercentrics', () => {
    beforeAll(() => {
        ;(window as UCWindow).UC_UI = {
            acceptService: jest.fn(),
            getServicesBaseInfo: jest.fn(),
            getServicesFullInfo: jest.fn(),
            isInitialized: jest.fn(),
            showFirstLayer: jest.fn(),
            showSecondLayer: jest.fn(),
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    afterAll(() => {
        delete (window as UCWindow).UC_UI
    })

    describe('utils', () => {
        test('acceptService', async () => {
            await utils.acceptService('test-id')
            expect((window as UCWindow).UC_UI?.acceptService).toHaveBeenCalledWith('test-id', undefined)

            await utils.acceptService('test-id', ConsentType.Explicit)
            expect((window as UCWindow).UC_UI?.acceptService).toHaveBeenCalledWith('test-id', ConsentType.Explicit)
        })

        test('getServicesBaseInfo', () => {
            utils.getServicesBaseInfo()
            expect((window as UCWindow).UC_UI?.getServicesBaseInfo).toHaveBeenCalledTimes(1)
        })

        test('getServicesFullInfo', async () => {
            await utils.getServicesFullInfo()
            expect((window as UCWindow).UC_UI?.getServicesFullInfo).toHaveBeenCalledTimes(1)
        })

        test('showFirstLayer', () => {
            utils.showFirstLayer()
            expect((window as UCWindow).UC_UI?.showFirstLayer).toHaveBeenCalledTimes(1)
        })

        test('showSecondLayer', () => {
            utils.showSecondLayer()
            expect((window as UCWindow).UC_UI?.showSecondLayer).toHaveBeenCalledTimes(1)

            utils.showSecondLayer('test-id')
            expect((window as UCWindow).UC_UI?.showSecondLayer).toHaveBeenCalledTimes(2)
            expect((window as UCWindow).UC_UI?.showSecondLayer).toHaveBeenCalledWith('test-id')
        })

        describe('getServicesFromLocalStorage', () => {
            const mockGetItem = jest.spyOn(localStorage.__proto__, 'getItem')

            it('should return empty array when no data', () => {
                const services = utils.getServicesFromLocalStorage()
                expect(mockGetItem).toHaveBeenCalledTimes(1)
                expect(services).toEqual([])
            })

            it('should return empty array when invalid data', () => {
                mockGetItem.mockReturnValueOnce('foobar')
                expect(utils.getServicesFromLocalStorage()).toEqual([])
            })

            it('should return service from localStorage', () => {
                const service: ServiceInfoFromLocalStorage = { id: 'test-id', status: true }
                const settings: SettingsFromLocalStorage = { services: [service] }

                mockGetItem.mockReturnValueOnce(JSON.stringify(settings))
                expect(utils.getServicesFromLocalStorage()).toEqual([service])
            })
        })
    })
})
