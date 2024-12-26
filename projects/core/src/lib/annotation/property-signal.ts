import {isSignal, signal, Signal, WritableSignal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {isBlank, isNotBlank} from "@ngp/core";


export class PropertySignal implements PropertyDescriptor {
  configurable = true
  enumerable = false
  property?: Signal<any>

  constructor(property?: any) {
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
    this.putProperty = this.putProperty.bind(this)
    this.convertToSignal = this.convertToSignal.bind(this)
    this.insert = this.insert.bind(this)
    this.set(property)
  }

  private static initSignal(property: any): Signal<any> | WritableSignal<any> {
    if (property?.subscribe) {
      return toSignal(property)
    }
    return signal(property)
  }

  get(): any {
    return this.property ? this.property() : undefined
  }

  set(value: any): void {
    if (isNotBlank(value)) {
      if (isBlank(this.property)) {
        this.property = this.convertToSignal(value)
      }
      if ('set' in this.property!!) {
        // this.set = this.insert.bind(this)
        this.insert(value)
      } else {
        // this.set = () => {}
      }
    }
  }

  private insert(value: any) {
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

  private convertToSignal(property: any) {
    return isSignal(property)
      ? property
      : PropertySignal.initSignal(property)
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

export class PropertyProxyHandler<T extends object = any> implements ProxyHandler<T> {
  private property: PropertySignal
  constructor(property: PropertySignal | T) {
    if (property instanceof PropertySignal) {
      this.property = property
    } else {
      this.property = new PropertySignal(property)
    }
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
  }

  get(target: T, p: string | symbol, receiver: any): any {
    return this.property.get()
  }

  set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
    this.property.set(newValue);
    return true;
  }
}
