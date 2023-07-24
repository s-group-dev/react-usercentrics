import { render } from '@testing-library/react'
import React from 'react'

import { UsercentricsScript } from '../../src/components/UsercentricsScript.js'

describe('Usercentrics', () => {
    describe('components', () => {
        describe('UsercentricsScript', () => {
            it('should render basic props', () => {
                const { container } = render(<UsercentricsScript settingsId="1234" />)

                expect(container.firstChild).toMatchInlineSnapshot(`
                    <script
                      async=""
                      data-settings-id="1234"
                      id="usercentrics-cmp"
                      src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
                    />
                `)
            })

            it('should render preview attribute', () => {
                const { container } = render(<UsercentricsScript settingsId="1234" version="preview" />)

                expect(container.firstChild).toHaveAttribute('data-version', 'preview')
            })

            it('should allow disabling default async prop', () => {
                const { container } = render(<UsercentricsScript settingsId="1234" async={undefined} defer />)

                expect(container.firstChild).not.toHaveAttribute('async')
                expect(container.firstChild).toHaveAttribute('defer', '')
            })

            it('should allow specifying UI version', () => {
                const { container } = render(<UsercentricsScript settingsId="1234" uiVersion="3.24.0" />)

                expect(container.firstChild).toHaveAttribute(
                    'src',
                    'https://app.usercentrics.eu/browser-ui/3.24.0/loader.js',
                )
            })

            it('should allow passing integrity prop', () => {
                const { container } = render(
                    <UsercentricsScript
                        settingsId="1234"
                        uiVersion="3.24.0"
                        integrity="sha384-WRloNuM/QNkzJ4GkUAZgJ5CWgTFhVjsLKVQbACSHGOifUvw2WJk1QaY9mphkn96U"
                    />,
                )

                expect(container.firstChild).toHaveAttribute(
                    'integrity',
                    'sha384-WRloNuM/QNkzJ4GkUAZgJ5CWgTFhVjsLKVQbACSHGOifUvw2WJk1QaY9mphkn96U',
                )
            })

            it('should not allow the src prop', () => {
                const { container } = render(
                    <UsercentricsScript
                        settingsId="1234"
                        /** @ts-expect-error: Type 'string' is not assignable to type 'undefined'. */
                        src="test.js"
                    />,
                )

                expect(container.firstChild).toHaveAttribute(
                    'src',
                    'https://app.usercentrics.eu/browser-ui/latest/loader.js',
                )
            })
        })
    })
})
