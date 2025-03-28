import { useContext, useDebugValue, useEffect } from 'react'

import { UsercentricsContext } from '../context.js'
import type { ServiceId } from '../types.v3.js'

export const useServiceDebug = (serviceId: ServiceId) => {
    const { isInitialized, ping, strictMode, localStorageState } = useContext(UsercentricsContext)

    useDebugValue(localStorageState[serviceId])

    useEffect(() => {
        if (!strictMode || !isInitialized) return

        if (!localStorageState[serviceId]) {
            throw new Error(`Usercentrics Service not found for id "${serviceId}"`)
        }
    }, [isInitialized, localStorageState, ping, serviceId, strictMode])
}
