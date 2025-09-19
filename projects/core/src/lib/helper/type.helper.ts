import { PrimitiveTypes } from '@angular/cli/src/analytics/analytics-parameters';

export const isPrimitive = (value: any): value is PrimitiveTypes => {
  const type = typeof value;
  return type === 'string' || type === 'number' || type === 'boolean';
};

export type toSnakeKey<T extends string> = T extends `${infer First}${infer Rest}` ? First extends Lowercase<First>
  ? `${First}${toSnakeKey<Rest>}` : `-${Lowercase<First>}${toSnakeKey<Rest>}` : T;
