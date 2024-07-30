import {PropertySignal} from "./property-signal";

export const State = () => (target: object, propertyKey: PropertyKey) => {
    const value = (target as any)[propertyKey]
    Reflect.defineProperty(target, propertyKey, new PropertySignal(value))
}
