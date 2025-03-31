import type { ConsentStatusFromLocalStorage, ServiceId, UCDataFromLocalStorage, UCWindow } from './types.js'

/**
 * A method to check if user has interacted with the consent prompt and given consent information.
 *
 * @example
 * const userInteracted = hasUserInteracted()
 * if (userInteracted) {
 *  actionRequiredConsentInfoGiven()
 * }
 *
 * @see `setUserHasInteracted`
 */
export const hasUserInteracted = (): boolean => {
    if (typeof window === 'undefined') {
        return false
    }

    try {
        const userInteraction = localStorage?.getItem('uc_user_interaction')
        return userInteraction === 'true'
    } catch {
        return false
    }
}

/**
 * A method to set that user has interacted with the consent prompt and given consent information.
 *
 * @example setUserHasInteracted()
 *
 * @see `hasUserInteracted`
 */
export const setUserHasInteracted = (): void => {
    localStorage?.setItem('uc_user_interaction', 'true')
}

/**
 * Programmatic way to show First Layer.
 * @see https://usercentrics.com/docs/web/features/api/control-ui/#showfirstlayer
 *
 * @example showFirstLayer()
 */
export const showFirstLayer = async (): Promise<void> => {
    /**
     * This file type-casts the Window to possibly include `window.UC_UI`, which is the
     * main entry point for Usercentrics integration. It is intentionally not declared
     * globally so that it wouldn't get used directly somewhere else in the code, but
     * always through these utils.
     */
    await (window as UCWindow).__ucCmp?.showFirstLayer?.()
}

/**
 * Programmatic way to show Second Layer.
 * @see https://usercentrics.com/docs/web/features/api/control-ui/#showsecondlayer
 *
 * @example showSecondLayer()
 */
export const showSecondLayer = async (): Promise<void> => {
    await (window as UCWindow).__ucCmp?.showSecondLayer?.()
}

/**
 * Programmatic way to show the details of a service
 * @see https://usercentrics.com/docs/web/features/api/control-ui/#showservicedetails
 *
 * @example showServiceDetails('my-service-id')
 */
export const showServiceDetails = async (serviceId: ServiceId): Promise<void> => {
    await (window as UCWindow).__ucCmp?.showServiceDetails(serviceId)
}

/**
 * A method to get array of all service consent statuses from local storage
 *
 * @example
 * const consents = getServicesConsentsFromLocalStorage()
 * const hasConsent = consents['my-service-id']?.consent === true
 */
export const getServicesConsentsFromLocalStorage = (): Record<ServiceId, ConsentStatusFromLocalStorage> => {
    try {
        const ucData = localStorage?.getItem('ucData')
        if (ucData) {
            const ucDataParsed = JSON.parse(ucData) as UCDataFromLocalStorage
            /** Leave out any other untyped fields */
            return ucDataParsed.consent.services
        }
    } catch {
        /** Ignore failures */
    }

    return {}
}

/**
 * Updates consents for individual or multiple services.
 * @see https://usercentrics.com/docs/web/features/api/control-functionality/#updateservicesconsents
 *
 * @example updateServicesConsents([{ id: 'my-service-id', consent: true }])
 */
export const updateServicesConsents = async (
    servicesConsents: { id: ServiceId; consent: boolean }[],
): Promise<void> => {
    await (window as UCWindow).__ucCmp?.updateServicesConsents(servicesConsents)
}

/**
 * Programmatic way to set language for the CMP.
 * @param countryCode Two character country code, e.g. "en" = set language to English
 * @see https://usercentrics.com/docs/web/features/api/control-functionality/#changelanguage
 *
 * @example changeLanguage("fi")
 */
export const changeLanguage = async (countryCode: string): Promise<void> => {
    await (window as UCWindow).__ucCmp?.changeLanguage?.(countryCode)
}

/** @returns `true` if the Usercentrics dialog is currently open. */
export const isOpen = (): boolean => {
    if (typeof window !== 'undefined') {
        const usercentricsRoot = document.getElementById('usercentrics-cmp-ui')
        const dialog = usercentricsRoot?.shadowRoot?.querySelector('[role="dialog"]')
        return !!dialog
    }

    return false
}
