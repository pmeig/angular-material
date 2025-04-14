import { isSignal, Signal, signal, WritableSignal } from '@angular/core';
import {
  ArrayHandler,
  ArrayPropertyHandler,
  HidePropertySignal,
  HideSignal,
  RecordHandler,
  RecordPropertyHandler
} from './signal.proxy';

type TypescriptObject = Record<string, any> | any[];

export type SignalRecord<T extends TypescriptObject> = T extends Record<string, any> ? {
  [K in keyof T]-?: T[K] extends TypescriptObject ? SignalRecord<T[K]> : WritableSignal<T[K]>;
} : T extends any[] ? (T[number] extends TypescriptObject ? SignalRecord<T[number]> : WritableSignal<T[number]>)[] : never;



export function signalRecord<T extends TypescriptObject>(obj: T[]): SignalRecord<T>[];
export function signalRecord<T extends Record<string, any>>(obj: T): SignalRecord<T>;
export function signalRecord<T extends any>(obj: T[]): WritableSignal<T>[];
export function signalRecord<T extends TypescriptObject>(obj: T): SignalRecord<T> | SignalRecord<T>[] | WritableSignal<T>[] {
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return [];
    }
    return obj.map(item => (Array.isArray(item) || typeof item === 'object') ? signalRecord(item) : signal(item)) as SignalRecord<T>[];
  }
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && !('new' in value)) {
      value = signalRecord(value)
    } else {
      if (!isSignal(value)) {
        value = signal(value)
      }
    }
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>) as SignalRecord<T>;
}


export function ref<T extends TypescriptObject, U extends object>(value: SignalRecord<T>[], parent?: U, field?: keyof U): T[];
export function ref<T extends TypescriptObject, U extends object>(value: SignalRecord<T>, parent?: U, field?: keyof U): T;
export function ref<T extends any, U extends object>(value: Signal<T>, parent?: U, field?: keyof U): T;
export function ref<T extends any, U extends object>(value: Signal<T>[], parent?: U, field?: keyof U): T[];
export function ref<T extends any, U extends object>(value: T[], parent?: U, field?: keyof U): T[];
export function ref<T extends any, U extends object>(value: T, parent?: U, field?: keyof U): T;
export function ref<T extends any, U extends object>(value: T | T[] | Signal<T>, parent?: U, field?: keyof U): T | T[] {
  let result = value;
  let toPropertyDescriptor = (handler: any) => (new HidePropertySignal(handler) as any)
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      result = value.map(item => ref(item)) as T[];
      toPropertyDescriptor = handler => new ArrayPropertyHandler(handler)
      value = new Proxy(result, new ArrayHandler(result)) as T[];
    } else {
      result = Object.entries(value as Record<string, any>).reduce((acc, [key, value]) => {
        acc[key] = ref(value)
        return acc
      }, {} as Record<string, any>) as T;
      toPropertyDescriptor = handler => new RecordPropertyHandler(handler)
      value = new Proxy(result as Record<string, any>, new RecordHandler(result as Record<string, any>)) as T;
    }
  } else {
    if (!isSignal(value)) {
      result = signal(value)
    }
    value = new Proxy(result as Signal<T>, new HideSignal(result as Signal<any>))
  }

  if (parent && field) {
    setTimeout(() => {
      Reflect.deleteProperty(parent, field)
      Reflect.defineProperty(parent, field, toPropertyDescriptor(result as any))
    })
  }
  return value as T | T[];
}

