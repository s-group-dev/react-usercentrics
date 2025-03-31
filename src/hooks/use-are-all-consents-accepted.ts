import { useContext } from 'react'

import { UsercentricsContext } from '../context.js'

/**
 * Whether all Usercentrics services have been given consent.
 * Returns `true` or `false` based on consent status, or `null` when unknown (not yet loaded).
 *
 * @warn it's best to assume no consent until this hook returns `true`
 */
export const useAreAllConsentsAccepted = (): boolean | null => {
    const { consents, isClientSide, isInitialized } = useContext(UsercentricsContext)

    /** Consent status is unknown during SSR because CMP is only available client-side */
    if (!isClientSide) {
        return null
    }

    /**
     * Until Usercentrics CMP has loaded, try to get consent status from localStorage.
     * If it's not loaded, and there's nothing in localStorage, this will return `null`
     */
    if (!isInitialized) {
        return Object.keys(consents).length > 0 ? Object.values(consents).every((consent) => consent === true) : null
    }

    return Object.values(consents).every((consent) => consent === true)
}
