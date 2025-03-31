import type { UCWindow } from '../src/types.js'
import * as utils from '../src/utils.js'

const TEST_SERVICE_INFO = {
    'test-id': {
        name: 'Test Service',
        id: 'test-id',
        description: 'This is a mocked test service',
    },
}

describe('Usercentrics', () => {
    beforeAll(() => {
        ;(window as UCWindow).__ucCmp = {
            changeLanguage: jest.fn(),
            getConsentDetails: jest.fn(),
            saveConsents: jest.fn(),
            showFirstLayer: jest.fn(),
            showSecondLayer: jest.fn(),
            showServiceDetails: jest.fn(),
            updateServicesConsents: jest.fn(),
        }

        global.fetch = jest.fn().mockReturnValue({
            json: jest.fn().mockReturnValue({
                services: TEST_SERVICE_INFO,
            }),
        })
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

        test('saveConsents', async () => {
            await utils.saveConsents()
            expect((window as UCWindow).__ucCmp?.saveConsents).toHaveBeenCalledWith()
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

        describe('getServiceInfo', () => {
            it('should call upstream API with configured values', async () => {
                jest.mocked((window as UCWindow).__ucCmp?.getConsentDetails)?.mockResolvedValueOnce({
                    consent: {
                        language: 'fi',
                        required: false,
                        status: 'ALL_DENIED',
                        setting: {
                            id: 'mock-id',
                            type: 'GDPR',
                            version: '1.2.3',
                        },
                    },
                    services: {},
                })

                const serviceInfo = await utils.getServiceInfo()

                expect(fetch).toHaveBeenCalledWith(
                    'https://v1.api.service.cmp.usercentrics.eu/latest/i18n/fi/GDPR/mock-id/1.2.3',
                )

                expect(serviceInfo).toEqual(TEST_SERVICE_INFO)
            })
        })
    })
})
