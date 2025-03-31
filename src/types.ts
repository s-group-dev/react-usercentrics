/**
 * This uses self-referenced import so that it can be augmented/re-declared in the target project
 * @see augmented.d.ts
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export type ServiceId = import('@s-group/react-usercentrics/augmented').ServiceId

/** Partial type for service info read from local storage, if available. Unused values are left out. */
export type ServiceData = {
    name: string
    consent?: {
        given: boolean
        type: 'IMPLICIT' | 'EXPLICIT'
    }
}

/**
 * Partial type, unused values are left out.
 * @see https://usercentrics.com/docs/web/features/api/interfaces/#consentdata
 */
type ConsentData = {
    status: 'ALL_ACCEPTED' | 'ALL_DENIED' | 'SOME_ACCEPTED' | 'SOME_DENIED'
    required: boolean
}

/**
 * Partial type, unused values are left out.
 * @see https://usercentrics.com/docs/web/features/api/interfaces/#consentdetails
 */
export type ConsentDetails = {
    consent: ConsentData
    services: Record<ServiceId, ServiceData>
}

export type UCDataFromLocalStorage = {
    consent: {
        services: Record<ServiceId, { name: string; consent: boolean }>
    }
}

/**
 * Typing for the main `window.__ucCmp` API used for integration
 * Do not declare this globally, but prefer to use the included utility functions instead.
 */
type UC_CMP = {
    /**
     * Programmatic way to show First Layer.
     * @see https://usercentrics.com/docs/web/features/api/control-ui/#showfirstlayer
     *
     * @example showFirstLayer()
     */
    showFirstLayer: () => Promise<void>

    /**
     * Programmatic way to show Second Layer.
     * @see https://usercentrics.com/docs/web/features/api/control-ui/#showsecondlayer
     *
     * @example showSecondLayer()
     */
    showSecondLayer: () => Promise<void>

    /**
     * Programmatic way to show the details of a service
     * @see https://usercentrics.com/docs/web/features/api/control-ui/#showservicedetails
     *
     * @example showServiceDetails('my-service-id')
     */
    showServiceDetails: (serviceId: ServiceId) => Promise<void>

    /**
     * Updates consents for individual or multiple services.
     * @see https://usercentrics.com/docs/web/features/api/control-functionality/#updateservicesconsents
     *
     * @example updateServicesConsents([{ id: 'my-service-id', consent: true }])
     */
    updateServicesConsents: (servicesConsents: { id: ServiceId; consent: boolean }[]) => Promise<void>

    /**
     * Retrieves all the consent details
     *
     * @see https://usercentrics.com/docs/web/features/api/control-functionality/#getconsentdetails
     */
    getConsentDetails: () => Promise<ConsentDetails>

    /**
     * Programmatic way to set language for the CMP.
     * @param countryCode Two character country code, e.g. "en" = set language to English
     * @see https://usercentrics.com/docs/web/features/api/control-functionality/#changelanguage
     *
     * @example changeLanguage("fi")
     */
    changeLanguage: (countryCode: string) => Promise<void>
}

/**
 * Augmented window type, possibly including the `__ucCmp` API.
 * Do not declare this globally, but prefer to use the included utility functions instead.
 */
export type UCWindow = Window & typeof globalThis & { __ucCmp?: UC_CMP }

export type UCConsentEvent = CustomEvent<ConsentDetails>

export enum UCUICMPEventType {
    ACCEPT_ALL = 'ACCEPT_ALL',
    CMP_SHOWN = 'CMP_SHOWN',
    DENY_ALL = 'DENY_ALL',
    IMPRINT_LINK = 'IMPRINT_LINK',
    MORE_INFORMATION_LINK = 'MORE_INFORMATION_LINK',
    PRIVACY_POLICY_LINK = 'PRIVACY_POLICY_LINK',
    SAVE = 'SAVE',
}

/**
 * The `UC_UI_CMP_EVENT` event is triggered by the most important actions that can be performed in the CMP, enabling you to listen to user interactions.
 * @see https://usercentrics.com/docs/web/features/events/uc-ui-cmp-event/
 */
export type UCUICMPEvent = CustomEvent<{
    source?: 'none' | 'button' | 'first' | 'second' | 'embeddings' | '__ucCmp'
    type?: UCUICMPEventType
}>

export enum UCUIView {
    FIRST_LAYER = 'FIRST_LAYER',
    NONE = 'NONE',
    PRIVACY_BUTTON = 'PRIVACY_BUTTON',
    SECOND_LAYER = 'SECOND_LAYER',
}

/**
 * The event also holds additional information with more details about the user behaviour. It is possible to know the current and previous layer displayed to the user.
 * @see https://usercentrics.com/docs/web/features/events/uc-ui-view-changed/
 */
export type UCUIVIewChanged = CustomEvent<{
    view: UCUIView
    previousView: UCUIView
}>
