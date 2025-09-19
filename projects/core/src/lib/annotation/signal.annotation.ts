import { PropertySignal } from './property-signal';

export const State = (target: object, propertyKey: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) => {
  if (descriptor) {
    if (typeof descriptor.value === 'function') {
      const mainFunction = descriptor.value as Function;
      descriptor.value = (...args: any[]) => mainFunction(...args.map(value => new PropertySignal(value)));
    } else {
      const property = new PropertySignal(descriptor.value);
      descriptor.value = undefined;
      descriptor.get = property.get.bind(property);
      descriptor.set = property.set.bind(property);
      descriptor.enumerable = property.enumerable;
      descriptor.configurable = property.configurable;
    }
  } else {
    Reflect.defineProperty(target, propertyKey, new PropertySignal((target as Record<PropertyKey, any>)[propertyKey]));
  }
};
