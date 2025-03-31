import type { UCWindow } from '../src/types.js'
import * as utils from '../src/utils.js'

describe('Usercentrics', () => {
    beforeAll(() => {
        ;(window as UCWindow).__ucCmp = {
            changeLanguage: jest.fn(),
            getConsentDetails: jest.fn(),
            showFirstLayer: jest.fn(),
            showSecondLayer: jest.fn(),
            showServiceDetails: jest.fn(),
            updateServicesConsents: jest.fn(),
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    afterAll(() => {
        delete (window as UCWindow).__ucCmp
    })

    describe('utils', () => {
        test('updateServicesConsents', async () => {
            await utils.updateServicesConsents([{ consent: true, id: 'test-id' }])
            expect((window as UCWindow).__ucCmp?.updateServicesConsents).toHaveBeenCalledWith([
                { consent: true, id: 'test-id' },
            ])
        })

        test('showFirstLayer', async () => {
            await utils.showFirstLayer()
            expect((window as UCWindow).__ucCmp?.showFirstLayer).toHaveBeenCalledTimes(1)
        })

        test('showSecondLayer', async () => {
            await utils.showSecondLayer()
            expect((window as UCWindow).__ucCmp?.showSecondLayer).toHaveBeenCalledTimes(1)
        })

        test('showServiceDetails', async () => {
            await utils.showServiceDetails('test-id')
            expect((window as UCWindow).__ucCmp?.showServiceDetails).toHaveBeenCalledTimes(1)
            expect((window as UCWindow).__ucCmp?.showServiceDetails).toHaveBeenCalledWith('test-id')
        })

        describe('getConsentsFromLocalStorage', () => {
            const mockGetItem = jest.spyOn(localStorage.__proto__, 'getItem')

            it('should return empty object when no data', () => {
                const services = utils.getConsentsFromLocalStorage()
                expect(mockGetItem).toHaveBeenCalledTimes(1)
                expect(services).toEqual({})
            })

            it('should return empty object when invalid data', () => {
                mockGetItem.mockReturnValueOnce('foobar')
                expect(utils.getConsentsFromLocalStorage()).toEqual({})
            })

            it('should return services from localStorage', () => {
                const ucData = {
                    consent: {
                        services: {
                            'test-id': { consent: { given: true, type: 'EXPLICIT' }, name: 'Test Service' },
                        },
                    },
                }

                mockGetItem.mockReturnValueOnce(JSON.stringify(ucData))
                expect(utils.getConsentsFromLocalStorage()).toEqual(ucData.consent.services)
            })
        })
    })
})
