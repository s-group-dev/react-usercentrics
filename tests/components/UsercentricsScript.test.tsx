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
                    `"<script async="" data-settings-id="1234" id="usercentrics-cmp" src="https://web.cmp.usercentrics.eu/ui/loader.js"></script>"`,
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

            it('should not allow the src prop', () => {
                const result = renderToStaticMarkup(
                    <UsercentricsScript
                        settingsId="1234"
                        /** @ts-expect-error: Type 'string' is not assignable to type 'undefined'. */
                        src="test.js"
                    />,
                )

                expect(result).toMatch('src="https://web.cmp.usercentrics.eu/ui/loader.js"')
            })
        })
    })
})
