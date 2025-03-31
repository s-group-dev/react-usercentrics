import { useContext } from 'react'

import { UsercentricsContext } from '../context.js'
import type { ServiceId } from '../types.js'

/**
 * Whether the specific Usercentrics service has been given consent.
 * Returns `true` or `false` based on consent status, or `null` when unknown (not yet loaded).
 *
 * @warn it's best to assume no consent until this hook returns `true`
 */
export const useHasServiceConsent = (serviceId: ServiceId): boolean | null => {
    const { consents, isInitialized, isClientSide, strictMode } = useContext(UsercentricsContext)

    /** Consent status is unknown during SSR because CMP is only available client-side */
    if (!isClientSide) {
        return null
    }

    /**
     * Until Usercentrics CMP has loaded, try to get consent status from localStorage.
     * If it's not loaded, and there's nothing in localStorage, this will return `null`
     */
    if (!isInitialized) {
        return consents[serviceId] ?? null
    }

    if (strictMode) {
        throw new Error(`Usercentrics Service not found for id "${serviceId}"`)
    }

    return !!consents[serviceId]
}
