/** @jest-environment node */

import React from 'react'
import ReactDOM from 'react-dom/server'

import { useUsercentricsBrowserIntegration } from '../../src/hooks/use-usercentrics-browser-integration.js'

const windowEventName = 'ucEvent'

describe('Usercentrics', () => {
    describe('hooks', () => {
        describe('useUsercentricsBrowserIntegration', () => {
            it('should return SSR-compatible initial state', () => {
                const TestComponent = () => {
                    const state = useUsercentricsBrowserIntegration(windowEventName)
                    return <>{JSON.stringify(state)}</>
                }

                const stringified = ReactDOM.renderToString(<TestComponent />)

                expect(stringified).toStrictEqual(
                    JSON.stringify({
                        hasInteracted: false,
                        isClientSide: false,
                        isFailed: false,
                        isInitialized: false,
                        isOpen: false,
                        localStorageState: [],
                        ping: Symbol(),
                    }).replaceAll('"', '&quot;'),
                )
            })
        })
    })
})
