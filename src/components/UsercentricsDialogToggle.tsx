import type { ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode } from 'react'
import React, { useCallback } from 'react'

import { useIsInitialized } from '../hooks/use-is-initialized.js'
import { showFirstLayer } from '../utils.js'

interface UsercentricsDialogToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
}

/**
 * A button component for opening the Usercentrics dialog where users can
 * adjust their consent settings, and read info about services.
 *
 * The button will be disabled until Usercentrics has been initialized,
 * so for example ad-blockers might prevent it from ever activating.
 */
export const UsercentricsDialogToggle: FC<UsercentricsDialogToggleProps> = ({ onClick, children, ...rest }) => {
    const isUsercentricsInitialized = useIsInitialized()

    const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
        (event) => {
            onClick?.(event)
            if (event.defaultPrevented) return

            event.preventDefault()
            if (isUsercentricsInitialized) {
                showFirstLayer()
            }
        },
        [isUsercentricsInitialized, onClick],
    )

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <button {...rest} aria-haspopup disabled={!isUsercentricsInitialized} onClick={handleClick}>
            {children}
        </button>
    )
}

UsercentricsDialogToggle.displayName = 'UsercentricsDialogToggle'
