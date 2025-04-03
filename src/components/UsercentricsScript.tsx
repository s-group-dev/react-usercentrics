import type { FC } from 'react'
import React from 'react'

import { USERCENTRICS_WEB_CMP_LOADER_SCRIPT_URL } from '../constants.js'

interface UsercentricsScriptProps
    extends React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement> {
    /**
     * The language code the Usercentrics UI should load by default. If not set, it will be automatically selected.
     *
     * @example "fi"
     * @see https://usercentrics.atlassian.net/wiki/spaces/SKB/pages/1183678648
     */
    language?: string

    settingsId: string

    /**
     * Whether to run Usercentrics in "production" or "preview" mode.
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
 * @example <caption>Fixed language code</caption>
 * () => <UsercentricsScript settingsId="1234" language="fi" />
 *
 */
export const UsercentricsScript: FC<UsercentricsScriptProps> = ({
    id = 'usercentrics-cmp',
    language,
    settingsId,
    version,
    ...rest
}) => {
    return (
        <script
            {...rest}
            async={'async' in rest ? rest.async : true}
            data-language={language}
            data-settings-id={settingsId}
            data-version={version}
            id={id}
            src={USERCENTRICS_WEB_CMP_LOADER_SCRIPT_URL}
        />
    )
}
