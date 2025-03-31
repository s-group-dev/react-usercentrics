## 3.0.0

- The Usercentrics Web CMP has been updated to v3 and includes a lot of changes.
    - Read more about the CMP v3 here: https://usercentrics.com/docs/web/v3/
    - Read the Usercentrics Migration guide here for more context, although it shouldn't be relevant when using this package: https://usercentrics.com/docs/web/migration/migration-from-v2/
- The `windowEvent` prop for `<UsercentricsProvider />` is no longer supported and should be removed. The CMP v3 handles this automatically with a new event internally.
- The `uiVersion` prop for `<UsercentricsScript />` is no longer supported and should be removed. The CMP v3 loader script currently supports only the "latest" version.
    - This also means that hard-coding a version number and its [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) hash is no longer supported. Instead, use a random `nonce` value when implementing a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP): https://usercentrics.com/docs/web/implementation/ui/optional-steps/#adding-a-nonce-to-the-script-tag
- The `showSecondLayer()` util no longer supports passing a service id argument to directly open to the service info. Instead, use the new `showServiceDetails(serviceId: ServiceId)` util.
- The `acceptService()` util has been replaced with `updateServicesConsents()` with a signature supporting multiple consents at a time.
    - You will also need to call `saveConsents()` after updating them.
- The `getServicesFromLocalStorage()` util has been replaced with `getConsentsFromLocalStorage()` with a different format.
- Some utils and hooks have been removed because CMP v3 no longer supports them:
    - Removed:
        - `getServicesBaseInfo()`
        - `useServiceInfo()`
        - `getServicesFullInfo()`
        - `useServiceFullInfo()`
    - Added new `getServiceInfo()` util for getting service names and descriptions
- All the utils are now `async` to match the CMP v3 implementations

## 2.0.0

- No functional changes. This version is only released to sync the package version with the supported Usercentrics Web CMP v2 version.

## 1.0.0

- Initial release
