import { useContext } from 'react'

import { UsercentricsContext } from '../context.js'
import type { ServiceId } from '../types.js'
import { hasServiceConsent } from '../utils.js'
import { useServiceDebug } from './use-service-debug.js'
import { useServiceInfo } from './use-service-info.js'

/**
 * Whether the specific Usercentrics service has been given consent.
 * Returns `true` or `false` based on consent status, or `null` when unknown (not yet loaded).
 *
 * @warn it's best to assume no consent until this hook returns `true`
 */
export const useHasServiceConsent = (serviceId: ServiceId): boolean | null => {
    useServiceDebug(serviceId)
    const serviceInfo = useServiceInfo(serviceId)
    const { isInitialized, localStorageState } = useContext(UsercentricsContext)

    /**
     * Until Usercentrics CMP has loaded, try to get consent status from localStorage.
     * If it's not loaded, and there's nothing in localStorage, this will return `null`
     */
    if (!isInitialized) {
        const saved = localStorageState.find((service) => service.id === serviceId)
        return saved ? saved.status : null
    }

    return hasServiceConsent(serviceInfo)
}
