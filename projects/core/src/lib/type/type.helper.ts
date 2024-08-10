import {PrimitiveTypes} from "@angular/cli/src/analytics/analytics-parameters";

export const isPrimitive = (value: any): value is PrimitiveTypes => {
  const type = typeof value
  return type === 'string' || type === 'number' || type === 'boolean'
};
