import { hasServiceConsent } from '../utils'
import { useServiceDebug } from './use-service-debug'
import { useServiceInfo } from './use-service-info'

/**
 * Returns `true` if the specific Usercentrics service has been given consent.
 * If it returns `false`, the service should not be loaded or used.
 */
export const useHasServiceConsent = (serviceId: string): boolean => {
    useServiceDebug(serviceId)
    const serviceInfo = useServiceInfo(serviceId)
    return hasServiceConsent(serviceInfo)
}
