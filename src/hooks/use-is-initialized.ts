import { useContext } from 'react'

import { UsercentricsContext } from '../context'

/** Returns `true` if Usercentrics has been initialized and consents can be given. */
export const useIsInitialized = (): boolean => {
    const { isInitialized } = useContext(UsercentricsContext)
    return isInitialized
}
