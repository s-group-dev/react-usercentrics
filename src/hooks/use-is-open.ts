import { useContext } from 'react'

import { UsercentricsContext } from '../context'

/** Returns `true` if the Usercentrics dialog is currently open on the page. */
export const useIsOpen = (): boolean => {
    const { isOpen } = useContext(UsercentricsContext)
    return isOpen
}
