import type { ServiceId } from './types.v3.js'

/** Partial type for a service's base info. Unused values are left out. */
export type ServiceInfo = {
    id: ServiceId
    name: string
    consent: {
        status: boolean
    }
}

/** Partial type for a service's full info. Unused values are left out. */
export type ServiceFullInfo = ServiceInfo & {
    description: string
}

/** Partial type for uc settings read from local storage, if available. Unused values are left out. */
export type SettingsFromLocalStorage = {
    services: ServiceInfoFromLocalStorage[]
}

/** Partial type for service info read from local storage, if available. Unused values are left out. */
export type ServiceInfoFromLocalStorage = {
    id: ServiceId
    status: boolean
}

/** When giving consent using the API (instead of customer clicking the Dialog),
 * consent can be either explicit (e.g. when clicking some custom button) or implicit. */
export enum ConsentType {
    Explicit = 'explicit',
    Implicit = 'implicit',
}

/**
 * Typing for the main `window.UC_UI` API used for integration
 * Do not declare this globally, but prefer to use the included utility functions instead.
 */
type UC_UI = {
    /**
     * A method to get array of all services with their basic information
     * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=getservicesbaseinfo
     */
    getServicesBaseInfo?: () => ServiceInfo[]

    /**
     * A method to get array of all services with their full information.
     * An extra api request will be made, therefore the return represents
     * the eventual completion (or failure) of an asynchronous operation
     * and its returning value.
     *
     * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=getservicesfullinfo
     */
    getServicesFullInfo?: () => Promise<ServiceFullInfo[]>

    /**
     * A method to check if app is initialized or not
     * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=isinitialized
     */
    isInitialized?: () => boolean

    /**
     * Programmatic way to show First Layer.
     * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=showfirstlayer
     */
    showFirstLayer?: () => void

    /**
     * Programmatic way to show Second Layer. If a service/vendor Id value is passed,
     * Second Layer will open the right tab, scroll to the given service/vendor entry and expand it.
     * If no Id is passed, Second Layer will be shown without srcolling to any specific service/vendor.
     *
     * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=showsecondlayer
     */
    showSecondLayer?: (serviceId?: ServiceId) => void

    /**
     * A method for accepting a single service.
     * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=acceptservice
     */
    acceptService?: (serviceId: ServiceId, consentType?: ConsentType) => Promise<void>

    /**
     * A method to check if all consents were accepted
     * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=areallconsentsaccepted
     */
    areAllConsentsAccepted?: () => boolean

    /**
     * Programmatic way to set language for the CMP.
     * @param countryCode Two character country code, e.g. "en" = set language to English
     * @see https://docs.usercentrics.com/#/cmp-v2-ui-api?id=updatelanguage
     */
    updateLanguage?: (countryCode: string) => void
}

/**
 * Augmented window type, possibly including the `UC_UI` API.
 * Do not declare this globally, but prefer to use the included utility functions instead.
 */
export type UCWindow = Window & typeof globalThis & { UC_UI?: UC_UI }

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
 * This event is triggered by the most important actions through the Consent Management Platform
 * @see https://docs.usercentrics.com/#/v2-events?id=uc_ui_cmp_event
 */
export type UCUICMPEvent = CustomEvent<{
    source?: 'FIRST_LAYER' | 'SECOND_LAYER'
    type?: UCUICMPEventType
}>
