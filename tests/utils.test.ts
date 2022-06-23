import type { UCWindow } from '../src/types'
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
    })
})
