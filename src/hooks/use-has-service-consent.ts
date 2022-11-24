import type { ServiceId } from '../types.js'
import { getServicesFromLocalStorage, hasServiceConsent } from '../utils.js'
import { useServiceDebug } from './use-service-debug.js'
import { useServiceInfo } from './use-service-info.js'

/**
 * Returns `true` if the specific Usercentrics service has been given consent.
 * If it returns `false`, the service should not be loaded or used.
 */
export const useHasServiceConsent = (serviceId: ServiceId): boolean => {
    useServiceDebug(serviceId)
    const serviceInfo = useServiceInfo(serviceId)
    const serviceFromLocalStorage = getServicesFromLocalStorage().find(({ id }) => serviceId === id)
    if (serviceFromLocalStorage) {
        try {
            return serviceFromLocalStorage.status
        } catch {
            // fails and do nothing
        }
    }
    return hasServiceConsent(serviceInfo)
}
