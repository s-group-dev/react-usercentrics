import type { FC } from 'react'
import React from 'react'

interface CMPV2Props {
    /**
     * The specific version of Usercentrics CMP SDK version.
     *
     * @default "2"
     * @example "3"
     * @see https://usercentrics.com/docs/web/v3/
     */
    cmpVersion?: '2'

    /**
     * The specific version of Usercentrics UI to load instead of "latest", as a string value.
     *
     * @deprecated CMP v3 script doesn't support versioning
     * @default "latest"
     * @example "3.24.0"
     * @see https://releases.usercentrics.com/en?category=browser+ui&role=cmpv1%3Bcmpv2%3B
     */
    uiVersion?: string
}

interface CMPV3Props {
    /**
     * The specific version of Usercentrics CMP SDK version.
     *
     * @default "2"
     * @example "3"
     * @see https://usercentrics.com/docs/web/v3/
     */
    cmpVersion?: '3'

    /** @deprecated CMP v3 script doesn't support versioning */
    uiVersion?: never
}

interface CMPProps extends React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement> {
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

type UsercentricsScriptProps = CMPProps & (CMPV2Props | CMPV3Props)

/**
 * The script tag that loads the Usercentrics Browser UI & API.
 *
 * @example <caption>Default production mode</caption>
 * () => <UsercentricsScript settingsId="1234" />
 *
 * @example <caption>Preview mode for development</caption>
 * () => <UsercentricsScript settingsId="1234" version="preview" />
 *
 * @example <caption>Use SDK v3 instead of previous v2</caption>
 * () => <UsercentricsScript cmpVersion="3" settingsId="1234" />
 *
 * @example <caption>Fixed UI version instead of latest</caption>
 * () => <UsercentricsScript settingsId="1234" uiVersion="3.24.0" />
 *
 * @example <caption>Fixed language code</caption>
 * () => <UsercentricsScript settingsId="1234" language="fi" />
 *
 */
export const UsercentricsScript: FC<UsercentricsScriptProps> = ({
    cmpVersion = '2',
    id = 'usercentrics-cmp',
    language,
    settingsId,
    uiVersion,
    version,
    ...rest
}) => {
    const src =
        cmpVersion === '3'
            ? `https://web.cmp.usercentrics.eu/ui/loader.js`
            : `https://app.usercentrics.eu/browser-ui/${uiVersion ?? 'latest'}/loader.js`

    return (
        <script
            {...rest}
            async={'async' in rest ? rest.async : true}
            data-language={language}
            data-settings-id={settingsId}
            data-version={version}
            id={id}
            src={src}
        />
    )
}
