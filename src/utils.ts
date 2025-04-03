import type { CMPi18nContent, ServiceId, UCDataFromLocalStorage, UCWindow } from './types.js'

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
 * A method to get consent status saved to localStorage
 *
 * @example
 * const consents = getConsentsFromLocalStorage()
 * const hasConsent = consents['my-service-id']?.consent === true
 */
export const getConsentsFromLocalStorage = (): UCDataFromLocalStorage['consent']['services'] => {
    try {
        const data = localStorage?.getItem('ucData')
        const consentDetails = data ? (JSON.parse(data) as UCDataFromLocalStorage) : { consent: { services: {} } }
        return consentDetails.consent.services
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
 *
 * @warn Updating consents doesn't save them! Remember to also call `saveConsents`.
 */
export const updateServicesConsents = async (
    servicesConsents: { id: ServiceId; consent: boolean }[],
): Promise<void> => {
    await (window as UCWindow).__ucCmp?.updateServicesConsents(servicesConsents)
}

/**
 * Saves the consents after being updated.
 * @see https://usercentrics.com/docs/web/features/api/control-functionality/#saveconsents
 *
 * @example saveConsents()
 */
export async function saveConsents(): Promise<void> {
    await (window as UCWindow).__ucCmp?.saveConsents()
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

/**
 * Programmatic way to get the translated i18n content of the Web CMP modal.
 * Useful for rendering custom UI with like listing services' names and descriptions.
 * @param [countryCode] Two character country code, e.g. "en" = set language to English; defaults to configured language
 *
 * @example
 * const services = await getServiceInfo()
 * const { name, description } = services['my-service-id']
 */
export const getServiceInfo = async (countryCode?: string): Promise<CMPi18nContent['services']> => {
    const consentDetails = await (window as UCWindow).__ucCmp!.getConsentDetails()
    const language = countryCode ?? consentDetails.consent.language
    const { id, type, version } = consentDetails.consent.setting

    const response = await window.fetch(
        `https://v1.api.service.cmp.usercentrics.eu/latest/i18n/${language}/${type}/${id}/${version}`,
    )

    const i18n = (await response.json()) as CMPi18nContent
    return Object.values(i18n.services).reduce(
        (acc, service) => ({
            ...acc,
            [service.id]: {
                id: service.id,
                name: service.name,
                description: service.description,
            },
        }),
        {} as CMPi18nContent['services'],
    )
}
