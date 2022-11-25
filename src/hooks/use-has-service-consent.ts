import { useContext } from 'react'

import { UsercentricsContext } from '../context.js'
import type { ServiceId } from '../types.js'
import { hasServiceConsent } from '../utils.js'
import { useServiceDebug } from './use-service-debug.js'
import { useServiceInfo } from './use-service-info.js'

/**
 * Returns `true` if the specific Usercentrics service has been given consent.
 * If it returns `false`, the service should not be loaded or used.
 */
export const useHasServiceConsent = (serviceId: ServiceId): boolean => {
    useServiceDebug(serviceId)
    const serviceInfo = useServiceInfo(serviceId)
    const { isInitialized, localStorageState } = useContext(UsercentricsContext)

    /** Until Usercentrics CMP has loaded, try to get consent status from localStorage */
    if (!isInitialized) {
        return !!localStorageState.find((service) => service.id === serviceId)?.status
    }

    return hasServiceConsent(serviceInfo)
}
