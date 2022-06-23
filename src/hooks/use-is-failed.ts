import { useContext } from 'react'

import { UsercentricsContext } from '../context'

/**
 * Returns `true` if Usercentrics failed to load inside the
 * timeout configured in `UsercentricsProvider`. This means
 * consent status is unknown and will default to `false`,
 * so no services can be used.
 */
export const useIsFailed = (): boolean => {
    const { isFailed } = useContext(UsercentricsContext)
    return isFailed
}
