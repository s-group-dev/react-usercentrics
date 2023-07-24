import type { FC } from 'react'
import React from 'react'

interface UsercentricsScriptProps
    extends React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement> {
    settingsId: string
    /**
     * The specific version of Usercentrics UI to load instead of "latest", as a string value
     *
     * @default "latest"
     * @example "3.24.0"
     * @see https://releases.usercentrics.com/en?category=browser+ui&role=cmpv1%3Bcmpv2%3B
     */
    uiVersion?: string
    /**
     * Whether to run Usercentrics in "production" or "preview" mode
     * @default "production"
     */
    version?: 'production' | 'preview'
    src?: never
}

/**
 * The script tag that loads the Usercentrics Browser UI & API.
 *
 * @example <caption>Default production mode</caption>
 * () => <UsercentricsScript settingsId="1234" />
 *
 * @example <caption>Preview mode for development</caption>
 * () => <UsercentricsScript settingsId="1234" version="preview" />
 *
 * @example <caption>Fixed UI version instead of latest</caption>
 * () => <UsercentricsScript settingsId="1234" uiVersion="3.24.0" />
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
