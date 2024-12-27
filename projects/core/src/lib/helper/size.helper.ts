import {Nullable} from '@pmeig/ng-core';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxs'

export type SizeAttribute = Nullable<Size>

export const sizeToString = (size: SizeAttribute, prefix?: string) => {
  if (!size) {
    return '';
  }
  return `${prefix ? `${prefix}-` : ''}${size}`
}
