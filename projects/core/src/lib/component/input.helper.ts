import {Nullable, Timeout} from "@ngp/core";

export type BooleanAttribute = Nullable<boolean | 'true' | 'false'>
export type Size = Nullable<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxs'>
export type Color = Nullable<'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark'>
export type NumberAttribute = Nullable<number | string>
export type TimeoutAttribute = Nullable<Timeout | number | string>
