import { useContext, useEffect, useState } from 'react'

import { UsercentricsContext } from '../context.js'
import { hasUserInteracted } from '../utils.js'

/** Returns `true` if user has interacted with the dialog. */
export const useHasUserInteracted = (): boolean => {
    const { ping } = useContext(UsercentricsContext)
    const [userInteracted, setUserInteracted] = useState(hasUserInteracted())

    useEffect(() => {
        setUserInteracted(hasUserInteracted())
    }, [ping])

    return userInteracted
}
