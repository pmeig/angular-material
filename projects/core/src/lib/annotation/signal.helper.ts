import {PropertySignal} from "./property-signal";
import {isPrimitive} from "../type/type.helper";
import {isSignal, Signal} from "@angular/core";

export const State = (target: object, propertyKey: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) => {
  if (descriptor) {
    if (typeof descriptor.value === "function") {
      const mainFunction = descriptor.value as Function;
      descriptor.value = (...args: any[]) => mainFunction(...args.map(value => new PropertySignal(value)))
    } else {
      const property = new PropertySignal(descriptor.value)
      descriptor.value = undefined
      descriptor.get = property.get.bind(property)
      descriptor.set = property.set.bind(property)
      descriptor.enumerable = property.enumerable
      descriptor.configurable = property.configurable
    }
  } else {
    Reflect.defineProperty(target, propertyKey, new PropertySignal());
  }
}

export function ref<U, T extends object = any>(target: T, key: string | keyof T, defaultValue: Signal<U>): U
export function ref<U, T extends object = any>(target: T, key: string | keyof T, defaultValue: U): U
export function ref<U, T extends object = any>(target: T, key: string | keyof T, defaultValue: U | Signal<U>) {
  if (isSignal(defaultValue)) {
    return new Proxy(defaultValue, {
      get: (target, key) => {
        if (key === Symbol.toPrimitive) {
          return () => target()
        }
        return target()
      }
    })
  }
  State(target, key)
  return defaultValue
}
export const state = <T>(value: T): T => new PropertySignal(value).get()
