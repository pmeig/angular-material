import {Nullable, Timeout} from '@pmeig/ng-core';

export type BooleanAttribute = Nullable<boolean | 'true' | 'false'>
export type NumberAttribute = Nullable<number | string>
export type TimeoutAttribute = Nullable<Timeout | number | string>
