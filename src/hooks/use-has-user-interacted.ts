import { useContext, useMemo } from 'react'

import { UsercentricsContext } from '../context.js'
import { hasUserInteracted } from '../utils.js'

/**
 * Returns `true` if the user has interacted with the Usercentrics dialog and given consent information.
 * @example
 * () => {
 * const hasUserInteracted = useHasUserInteracted()

 * useEffect(() => {
 *  if (hasUserInteracted) {
 *    console.debug('User has interacted with the Usercentrics dialog and given consent information')
 *   } else {
 *     console.debug('User has not interacted with the Usercentrics dialog and not given consent information')
 *   }
 *  }, [hasUserInteracted])
 * }
 */
export const useHasUserInteracted = (): boolean => {
    const { ping } = useContext(UsercentricsContext)
    return useMemo(hasUserInteracted, [ping])
}
