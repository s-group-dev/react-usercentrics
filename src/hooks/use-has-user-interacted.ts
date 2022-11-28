import { useContext, useMemo } from 'react'

import { UsercentricsContext } from '../context.js'
import { hasUserInteracted } from '../utils.js'

/** Returns `true` if user has interacted with the dialog. */
export const useHasUserInteracted = (): boolean => {
    const { ping } = useContext(UsercentricsContext)
    return useMemo(hasUserInteracted, [ping])
}
