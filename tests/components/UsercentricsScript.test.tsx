/** @jest-environment node */

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { UsercentricsScript } from '../../src/components/UsercentricsScript.js'

describe('Usercentrics', () => {
    describe('components', () => {
        describe('UsercentricsScript', () => {
            it('should render basic props', () => {
                const result = renderToStaticMarkup(<UsercentricsScript settingsId="1234" />)

                expect(result).toMatchInlineSnapshot(
                    `"<script async="" data-settings-id="1234" id="usercentrics-cmp" src="https://app.usercentrics.eu/browser-ui/latest/loader.js"></script>"`,
                )
            })

            it('should render preview attribute', () => {
                const result = renderToStaticMarkup(<UsercentricsScript settingsId="1234" version="preview" />)

                expect(result).toMatch('data-version="preview"')
            })

            it('should allow disabling default async prop', () => {
                const result = renderToStaticMarkup(<UsercentricsScript settingsId="1234" async={undefined} defer />)

                expect(result).not.toMatch('async')
                expect(result).toMatch('defer')
            })

            it('should allow specifying UI version', () => {
                const result = renderToStaticMarkup(<UsercentricsScript settingsId="1234" uiVersion="3.24.0" />)

                expect(result).toMatch('src="https://app.usercentrics.eu/browser-ui/3.24.0/loader.js"')
            })

            it('should allow passing integrity prop', () => {
                const result = renderToStaticMarkup(
                    <UsercentricsScript
                        settingsId="1234"
                        uiVersion="3.24.0"
                        integrity="sha384-WRloNuM/QNkzJ4GkUAZgJ5CWgTFhVjsLKVQbACSHGOifUvw2WJk1QaY9mphkn96U"
                    />,
                )

                expect(result).toMatch(
                    'integrity="sha384-WRloNuM/QNkzJ4GkUAZgJ5CWgTFhVjsLKVQbACSHGOifUvw2WJk1QaY9mphkn96U"',
                )
            })

            it('should not allow the src prop', () => {
                const result = renderToStaticMarkup(
                    <UsercentricsScript
                        settingsId="1234"
                        /** @ts-expect-error: Type 'string' is not assignable to type 'undefined'. */
                        src="test.js"
                    />,
                )

                expect(result).toMatch('src="https://app.usercentrics.eu/browser-ui/latest/loader.js"')
            })

            it('should allow loading CMP v3 SDK script', () => {
                const result = renderToStaticMarkup(<UsercentricsScript settingsId="1234" cmpVersion="3" />)

                expect(result).toMatch('src="https://web.cmp.usercentrics.eu/ui/loader.js"')
            })

            it('should not allow uiVersion prop with CMP v3 SDK', () => {
                const result = renderToStaticMarkup(
                    /** @ts-expect-error: Type 'string' is not assignable to type 'undefined'.ts */
                    <UsercentricsScript settingsId="1234" cmpVersion="3" uiVersion="3.24.0" />,
                )

                expect(result).toMatch('src="https://web.cmp.usercentrics.eu/ui/loader.js"')
            })
        })
    })
})
