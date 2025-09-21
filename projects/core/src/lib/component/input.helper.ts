import { Nullable, Timeout } from '@pmeig/ng-core';

export type Empty<T> = T | ''

export type EmptyBooleanAttribute = Empty<BooleanAttribute>
export type BooleanAttribute = Nullable<boolean | 'true' | 'false'>
export type NumberAttribute = Nullable<number | string>
export type TimeoutAttribute = Nullable<Timeout | number | string>
export type Position = Empty<Nullable<'up' | 'start' | 'end' | 'bottom'>>
