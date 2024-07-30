import { isSignal, signal, Signal, WritableSignal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'

export class PropertySignal implements PropertyDescriptor {
  configurable = true
  enumerable = false
  property: WritableSignal<any> | Signal<any>

  constructor(property: any) {
    this.property = isSignal(property)
      ? (property as WritableSignal<any>)
      : PropertySignal.initSignal(property)
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
    this.putProperty = this.putProperty.bind(this)
  }

  private static initSignal(property: any): Signal<any> | WritableSignal<any> {
    if (property?.subscribe) {
      return toSignal(property)
    }
    return signal(property)
  }

  get(): any {
    return this.property()
  }

  set(value: any): void {
    this.enumerable = false
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        this.enumerable = true
        this.putProperty(
          new Proxy(
            (value as any[]).map(value1 => new PropertySignal(value1).get()),
            new ArraySignal(this.property as WritableSignal<any[]>)
          )
        )
      } else if (value.subscribe) {
        this.property = toSignal(value)
      } else {
        Object.entries(value).forEach(([key, item]) => {
          Reflect.deleteProperty(value, key)
          Reflect.defineProperty(value, key, new PropertySignal(item))
          value[key] = item
        })
        this.putProperty(value)
      }
    } else {
      this.putProperty(value)
    }
  }

  private putProperty(property: any) {
    (this.property as WritableSignal<any>).set(property)
  }
}

class ArraySignal<T> implements ProxyHandler<T[]> {
  constructor(private signal: WritableSignal<T[]>) {}

  set(target: any, p: string | symbol, newValue: any, receiver: any): boolean {
    target[p] = newValue
    this.signal.set(target)
    return true
  }

  getPrototypeOf(target: T[]): object | null {
    return Object.getPrototypeOf(target)
  }
}
