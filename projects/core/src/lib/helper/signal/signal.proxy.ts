import { isSignal, Signal } from '@angular/core';

export class ArrayHandler<T> implements ProxyHandler<T[]> {

  constructor(private readonly array: T[]) {
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
  }

  get(target: T[], p: string | symbol, receiver: any): any {
    return this.array[Number(p)]
  }

  set(target: T[], p: string | symbol, newValue: T, receiver: any): boolean {
    this.array[Number(p)] = newValue;
    return true;
  }


}

export class RecordHandler<T extends Record<string, any>> implements ProxyHandler<T> {
  constructor(private readonly record: T) {
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
  }

  get(target: Record<string, any>, p: string, receiver: any): any {
    return this.record[p]
  }

  set(target: Record<string, any>, p: string, newValue: any, receiver: any): boolean {
    const origin = this.record[p]
    if (typeof newValue === 'object') {
      if (Array.isArray(newValue)) {
        newValue.forEach((item, index) => {
          origin[index] = item
        })
        let max = origin.length
        while (max-- > newValue.length) {
          origin.pop()
        }
      } else {
        Object.entries(newValue).forEach(([key, value]) => {
          origin[key] = value
        })
      }
    } else {
      (this.record as Record<string, any>)[p] = newValue
    }
    return true;
  }
}

export class ArrayPropertyHandler<T> implements PropertyDescriptor {

  private readonly proxy: ArrayHandler<T>

  constructor(array: T[] | ProxyHandler<T[]>) {
    if (array.constructor.name === 'ArrayHandler')
      this.proxy = array as ArrayHandler<T>
    else
      this.proxy = new ArrayHandler<T>(array as T[])
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
  }

  get(): any {
    return this.proxy.get([], '', undefined)
  }

  set(v: any): void {
    this.proxy.set([], '', v, undefined)
  }
}

export class RecordPropertyHandler<T extends Record<string, any>> implements PropertyDescriptor {

  private readonly proxy: RecordHandler<T>

  constructor(record: T | ProxyHandler<T>) {
    if (record.constructor.name === 'RecordHandler')
      this.proxy = record as RecordHandler<T>
    else
      this.proxy = new RecordHandler<T>(record as T)
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
  }

  get(): any {
    return this.proxy.get({}, '', {})
  }

  set(v: any): void {
    this.proxy.set({}, '', v, undefined)
  }
}

export class HidePropertySignal implements PropertyDescriptor {
  private readonly proxy: HideSignal<any>

  constructor(signal: Signal<any> | ProxyHandler<Signal<any>>) {
    if (isSignal(signal))
      this.proxy = new HideSignal(signal as Signal<any>)
    else
     this.proxy = signal as HideSignal<any>
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
  }

  get(): any {
    return this.proxy.get(undefined, '', undefined)
  }

  set(v: any): void {
    this.proxy.set(undefined, '', v, undefined)
  }
}

export class HideSignal<T extends object> implements ProxyHandler<T> {
  private readonly insert = (value: T | Signal<T>) => {
    if (isSignal(value))
      this.insert(value())
    else
      this.insert(value)
  }

  constructor(private readonly signal: Signal<T>) {
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
    if (!('set' in this.signal)) {
      this.insert = () => {}
    }

  }

  get(target: T, p: string | symbol, receiver: any): any {
    console.log(this.signal());
    return this.signal()
  }

  set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
    this.insert(newValue)
    return true
  }
}
