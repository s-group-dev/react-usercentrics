import type { FC } from 'react'
import React from 'react'

interface UsercentricsScriptProps {
    settingsId: string
    uiVersion?: string
    version?: 'production' | 'preview'
}

/**
 * The script tag that loads the Usercentrics Browser API.
 *
 * @example <caption>Default production mode</caption>
 * () => <UsercentricsScript settingsId="1234" />
 *
 * @example <caption>Preview mode for development</caption>
 * () => <UsercentricsScript settingsId="1234" version="preview" />
 *
 * @example <caption>Fixed UI version instead of latest</caption>
 * () => <UsercentricsScript settingsId="1234" uiVersion="3.21.1" />
 */
export const UsercentricsScript: FC<UsercentricsScriptProps> = ({ settingsId, uiVersion = 'latest', version }) => (
    <script
        async
        data-settings-id={settingsId}
        data-version={version}
        id="usercentrics-cmp"
        src={`https://app.usercentrics.eu/browser-ui/${uiVersion}/loader.js`}
    />
)

UsercentricsScript.defaultProps = {
    uiVersion: 'latest',
}
