import { useContext, useDebugValue, useEffect } from 'react'

import { UsercentricsContext } from '../context.js'
import type { ServiceId } from '../types.js'
import { getServicesBaseInfo } from '../utils.js'

export const useServiceDebug = (serviceId: ServiceId) => {
    const { isInitialized, ping, strictMode } = useContext(UsercentricsContext)

    useDebugValue(getServicesBaseInfo(), (services) => services.find(({ id }) => serviceId === id))

    useEffect(() => {
        if (!strictMode || !isInitialized) return

        if (!getServicesBaseInfo().find(({ id }) => serviceId === id)) {
            throw new Error(`Usercentrics Service not found for id "${serviceId}"`)
        }
    }, [isInitialized, ping, serviceId, strictMode])
}
