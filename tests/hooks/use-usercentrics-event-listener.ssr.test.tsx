/** @jest-environment node */

import React from 'react'
import ReactDOM from 'react-dom/server'

import { useUsercentricsEventListener } from '../../src/hooks/use-usercentrics-event-listener.js'

describe('Usercentrics', () => {
    describe('hooks', () => {
        describe('useUsercentricsEventListener', () => {
            it('should return SSR-compatible initial state', () => {
                const TestComponent = () => {
                    const state = useUsercentricsEventListener({})
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
                        localStorageState: {},
                    }).replaceAll('"', '&quot;'),
                )
            })
        })
    })
})
