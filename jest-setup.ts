import '@testing-library/jest-dom'

type MockObjectConstructor = ObjectConstructor & { __definePropertyMocked__?: true }

/**
 * Allow module mocks with `@swc/core` enforcing stricter ESM spec.
 * @see https://github.com/magic-akari/swc_mut_cjs_exports/issues/103#issuecomment-1926819722
 */
if ((Object as MockObjectConstructor).__definePropertyMocked__ !== true) {
    ;(Object as MockObjectConstructor).__definePropertyMocked__ = true
    const originalDefineProperty = Object.defineProperty
    const mutableDefineProperty: ObjectConstructor['defineProperty'] = (obj, prop, attributes) => {
        // this is to prevent the error `Cannot redefine property: prototype`; prototype can not be configurable...
        if (prop === 'prototype') return originalDefineProperty(obj, prop, attributes)
        return originalDefineProperty(obj, prop, {
            ...attributes,
            configurable: true,
        })
    }
    Object.defineProperty = mutableDefineProperty
}
