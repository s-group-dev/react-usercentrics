/**
 * Service-specific code needs to target a specific `serviceId`, for example
 * to check its consent status. You can re-declare this module to override
 * the default `string` type of `ServiceId` with an `enum` to support stricter
 * type-level checks in your application code.
 *
 * @example
 *
 * ```
 * enum MyServiceId {
 *   Service1 = 'service-id-1',
 *   Service2 = 'service-id-2',
 * }
 *
 * declare module '@s-group/react-usercentrics/augmented' {
 *   export type ServiceId = MyServiceId
 * }
 * ```
 *
 * @example
 * ```
 * declare module '@s-group/react-usercentrics/augmented' {
 *   export type ServiceId = import('../config/usercentrics').ServiceId
 * }
 * ```
 *
 * @default string
 *
 * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */
export type ServiceId = string
