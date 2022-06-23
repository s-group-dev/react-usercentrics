const IS_BROWSER = typeof window !== 'undefined'

import type { ConsentType, ServiceFullInfo, ServiceInfo, UCWindow } from './types'

/**
 * Programmatic way to show First Layer.
 * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=showfirstlayer
 */
export const showFirstLayer = (): void => {
    if (IS_BROWSER) {
        /**
         * This file type-casts the Window to possibly include `window.UC_UI`, which is the
         * main entry point for Usercentrics integration. It is intentionally not declared
         * globally so that it wouldn't get used directly somewhere else in the code, but
         * always through these utils.
         */
        ;(window as UCWindow).UC_UI?.showFirstLayer?.()
    }
}

/**
 * Programmatic way to show Second Layer. If a service/vendor Id value is passed,
 * Second Layer will open the right tab, scroll to the given service/vendor entry and expand it.
 * If no Id is passed, Second Layer will be shown without srcolling to any specific service/vendor.
 *
 * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=showsecondlayer
 */
export const showSecondLayer = (serviceId?: string): void => {
    if (IS_BROWSER) {
        ;(window as UCWindow).UC_UI?.showSecondLayer?.(serviceId)
    }
}

/**
 * A method to get array of all services with their basic information
 * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=getservicesbaseinfo
 */
export const getServicesBaseInfo = (): ServiceInfo[] =>
    (IS_BROWSER && (window as UCWindow).UC_UI?.getServicesBaseInfo?.()) || []

/**
 * A method to get array of all services with their full information.
 * An extra api request will be made, therefore the return represents
 * the eventual completion (or failure) of an asynchronous operation
 * and its returning value.
 *
 * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=getservicesfullinfo
 */
export const getServicesFullInfo = async (): Promise<ServiceFullInfo[]> =>
    (IS_BROWSER && (window as UCWindow).UC_UI?.getServicesFullInfo?.()) || []

/** Returns true if Usercentrics service has been given consent */
export const hasServiceConsent = (service: ServiceInfo | null): boolean => !!service?.consent.status

/**
 * A method for accepting a single service.
 * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=acceptservice
 */
export const acceptService = async (serviceId: string, consentType?: ConsentType) => {
    if (IS_BROWSER) {
        await (window as UCWindow).UC_UI?.acceptService?.(serviceId, consentType)
    }
}
