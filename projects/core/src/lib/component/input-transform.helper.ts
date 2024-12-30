import { EmptyBooleanAttribute, NumberAttribute, TimeoutAttribute } from './input.helper';
import { Nullable, Timeout, TimeoutUnit } from '@pmeig/ng-core';
import { booleanAttribute } from '@angular/core';

export const numberAttribute = (value: NumberAttribute) => {
  const number = Number(value);
  if (isNaN(number)) {
    return undefined;
  }
  return number;
};

export const timeoutAttribute = (timeout: TimeoutAttribute): Nullable<Timeout> => {
  if (typeof timeout === 'string') {
    timeout = numberAttribute(timeout);
  }
  if (typeof timeout === 'number') {
    timeout = {
      unit: TimeoutUnit.MILLISECOND,
      value: timeout
    };
  }
  return timeout;
};

export const emptyBooleanAttribute = (value: EmptyBooleanAttribute) => {
  return value === '' || booleanAttribute(value);
};
