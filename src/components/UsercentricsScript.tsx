import type { FC } from 'react'
import React from 'react'

interface UsercentricsScriptProps
    extends React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement> {
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
export const UsercentricsScript: FC<UsercentricsScriptProps> = ({
    id = 'usercentrics-cmp',
    settingsId,
    uiVersion = 'latest',
    version,
    ...rest
}) => (
    <script
        {...rest}
        async={'async' in rest ? rest.async : true}
        data-settings-id={settingsId}
        data-version={version}
        id={id}
        src={`https://app.usercentrics.eu/browser-ui/${uiVersion}/loader.js`}
    />
)

UsercentricsScript.defaultProps = {
    id: 'usercentrics-cmp',
    uiVersion: 'latest',
}
