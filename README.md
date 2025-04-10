[![npm version](https://badge.fury.io/js/@s-group%2Freact-usercentrics.svg)](https://www.npmjs.com/package/@s-group/react-usercentrics) [![Release](https://github.com/s-group-dev/react-usercentrics/actions/workflows/release.yml/badge.svg)](https://github.com/s-group-dev/react-usercentrics/actions/workflows/release.yml)

# `@s-group/react-usercentrics`

React utils for interacting with the [Usercentrics Web CMP](https://usercentrics.com/docs/web/intro/).

```
npm install --save @s-group/react-usercentrics
```

## Motivation

While the official `@usercentrics/cmp-browser-sdk` npm module is very useful, it is unnecessarily large and would still require some utility functions built around it to be really useful when working in a React application. This package aims to be tiny and simple, and have zero dependencies.

## Usercentrics Web CMP Version Support

The current major version `@s-group/react-usercentrics@2` (and previous v1) only supports the [Usercentrics Web CMP v2 (legacy)](https://usercentrics.com/docs/web/v2/).

The next major version `@s-group/react-usercentrics@3` will only support [Usercentrics Web CMP v3](https://usercentrics.com/docs/web/v3/).

## Setup

You will need to set up a Usercentrics service and note down its `settingsId`. After this you need to render the `UsercentricsScript` component to load the Browser API, and then finally wrap your application in the `UsercentricsProvider`.

```tsx
import { UsercentricsScript, UsercentricsProvider } from '@s-group/react-usercentrics'
import ReactDOM from 'react-dom'
import React from 'react'

import { USERCENTRICS_SETTINGS_ID, USERCENTRICS_EVENT_NAME } from './config'
import MyApplication from './app'

ReactDOM.render(
    <>
        <UsercentricsScript settingsId={USERCENTRICS_SETTINGS_ID} />
        <UsercentricsProvider>
            <MyApplication /** You can interact with Usercentrics inside the provider */ />
        </UsercentricsProvider>
    </>,
    document.body,
)
```

### Augmented type-checks for `ServiceId`

Service-specific code needs to target a specific `serviceId`, for example
to check its consent status. You can re-declare a special module to override
the default `string` type of `ServiceId` with an `enum` to support stricter
type-level checks in your application code.

```ts
enum MyServiceId {
  Service1 = 'service-id-1'
  Service2 = 'service-id-2'
}

declare module '@s-group/react-usercentrics/augmented' {
  export type ServiceId = MyServiceId
}
```

or even import the type from another file:

```ts
declare module '@s-group/react-usercentrics/augmented' {
    export type ServiceId = import('../config/usercentrics').ServiceId
}
```

## API

### Constants

#### `USERCENTRICS_WEB_CMP_LOADER_SCRIPT_URL`

The url of the Usercentercis Web CMP v3 loader script. Useful when generating Link headers, for example.

```ts
response.headers.append(
    'Link',
    `<${USERCENTRICS_WEB_CMP_LOADER_SCRIPT_URL}>; rel=prefetch; as=script; fetchpriority="high"`,
)
```

### Components

#### `UsercentricsScript`

The script tag that loads the Usercentrics Browser CMP.

```tsx
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
     * Whether to run Usercentrics in "production" or "preview" mode
     * @default "production"
     */
    version?: 'production' | 'preview'

    src?: never
}

/** Default production mode */
;() => <UsercentricsScript settingsId="1234" />

/** Preview mode for development */
;() => <UsercentricsScript settingsId="1234" version="preview" />

/* Fixed language code */
;() => <UsercentricsScript settingsId="1234" language="fi" />
```

#### `UsercentricsProvider`

The provider component for listening to events from the Usercentrics Browser API.
Render this once and wrap your application in it.

```tsx
interface UsercentricsProviderProps {
    children: ReactNode
    /**
     * Whether to throw if invalid Service Id has been used.
     * @default false
     */
    strictMode?: boolean
    /**
     * The timeout value in milliseconds after which loading of the Usercentrics
     * script will be assumed to have failed.
     * @default 5000
     */
    timeout?: number
}

/** Basic usage */
() => (
  <UsercentricsProvider>
    <App />
  </UsercentricsProvider>
)

/** Custom timeout in milliseconds */
() => (
  <UsercentricsProvider timeout={100}>
    <App />
  </UsercentricsProvider>
)
```

#### `UsercentricsDialogToggle`

A button component for opening the Usercentrics dialog where users can
adjust their consent settings, and read info about services.

The button will be disabled until Usercentrics has been initialized,
so for example ad-blockers might prevent it from ever activating.

```tsx
interface UsercentricsDialogToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
}

/** Basic usage */
;() => <UsercentricsDialogToggle>Manage my consents</UsercentricsDialogToggle>
```

### Hooks

#### `useHasServiceConsent`

Whether the specific Usercentrics service has been given consent.
Returns `true` or `false` based on consent status, or `null` when unknown (not yet loaded).

**Warning:** it's best to assume no consent until this hook returns `true`

```tsx
;() => {
    const hasConsent = useHasServiceConsent('my-service-id')

    useEffect(() => {
        if (hasConsent) {
            loadMyService()
        }
    }, [hasConsent])
}
```

#### `useAreAllConsentsAccepted`

Whether all Usercentrics services have been given consent.
Returns `true` or `false` based on consent status, or `null` when unknown (not yet loaded).

**Warning:** it's best to assume no consent until this hook returns `true`

```tsx
;() => {
    const hasAllConsents = useAreAllConsentsAccepted()

    useEffect(() => {
        if (hasAllConsents) {
            loadMyService()
        }
    }, [hasAllConsents])
}
```

#### `useIsFailed`

Returns `true` if Usercentrics failed to load inside the
timeout configured in `UsercentricsProvider`. This means
consent status is unknown and will default to `false`,
so no services can be used.

```tsx
;() => {
    const isFailed = useIsFailed()

    useEffect(() => {
        if (isFailed) {
            console.error('Failed to load consents! This site might not work properly.')
        }
    }, [isFailed])
}
```

#### `useIsInitialized`

Returns `true` if Usercentrics has been initialized and consents can be given.

```tsx
;() => {
    const isInitialized = useIsInitialized()

    useEffect(() => {
        if (isInitialized) {
            console.info('Usercentrics has initialized!')
        }
    }, [isInitialized])
}
```

#### `useIsOpen`

Returns `true` if the Usercentrics dialog is currently open on the page.

```tsx
;() => {
    const isOpen = useIsOpen()

    useEffect(() => {
        if (isOpen) {
            console.debug('Usercentrics dialog is open and probably covers the whole screen')
        } else {
            console.debug('Usercentrics dialog is now closed')
        }
    }, [isOpen])
}
```

#### `useHasUserInteracted`

Returns `true` if the user has interacted with the Usercentrics dialog and given consent information.

```tsx
;() => {
    const hasUserInteracted = useHasUserInteracted()

    useEffect(() => {
        if (hasUserInteracted) {
            console.debug('User has interacted with the Usercentrics dialog and given consent information')
        } else {
            console.debug('User has not interacted with the Usercentrics dialog and not given consent information')
        }
    }, [hasUserInteracted])
}
```

### Utils

#### `hasUserInteracted`

A method to check if user has interacted with the consent prompt and given consent information.

See also `setUserHasInteracted`.

```tsx
const userInteracted = hasUserInteracted()

if (userInteracted) {
    actionRequiredConsentInfoGiven()
}
```

#### `setUserHasInteracted`

A method to set that user has interacted with the consent prompt and given consent information.

See also `hasUserInteracted`.

```tsx
setUserHasInteracted()
```

#### `showFirstLayer`

Programmatic way to show First Layer.

See also https://usercentrics.com/docs/web/features/api/control-ui/#showfirstlayer

```tsx
await showFirstLayer()
```

#### `showSecondLayer`

Programmatic way to show Second Layer.

See also https://usercentrics.com/docs/web/features/api/control-ui/#showsecondlayer

```tsx
await showSecondLayer()
```

#### `showServiceDetails`

Programmatic way to show the details of a service.

See also https://usercentrics.com/docs/web/features/api/control-ui/#showservicedetails

```tsx
await showServiceDetails('my-service-id')
```

#### `getConsentsFromLocalStorage`

A method to get consent status saved to localStorage.

```tsx
const consents = getConsentsFromLocalStorage()
const hasConsent = consents['my-service-id']?.consent === true
```

#### `updateServicesConsents`

Updates consents for individual or multiple services.

See also https://usercentrics.com/docs/web/features/api/control-functionality/#updateservicesconsents

**Warning:** Updating consents doesn't save them! Remember to also call `saveConsents`.

```tsx
await updateServicesConsents([{ id: 'my-service-id', consent: true }])
```

#### `saveConsents`

Saves the consents after being updated.

See also https://usercentrics.com/docs/web/features/api/control-functionality/#saveconsents

```tsx
await saveConsents()
```

#### `updateLanguage`

Programmatic way to set language for the CMP.
The param `countryCode` is a two character country code, e.g. "en" = set language to English

See also https://usercentrics.com/docs/web/features/api/control-functionality/#changelanguage

```tsx
updateLanguage('fi')
```

#### `getServiceInfo`

Programmatic way to get the translated i18n content of the Web CMP modal.
Useful for rendering custom UI with like listing services' names and descriptions.

```tsx
const services = await getServiceInfo()
const { name, description } = services['my-service-id']
```
