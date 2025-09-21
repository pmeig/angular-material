import { isSignal, Signal, signal, WritableSignal } from '@angular/core';

type TypescriptObject = Record<string, any> | any[];

export type SignalRecord<T extends TypescriptObject> = T extends Record<string, any> ? {
  [K in keyof T]-?: T[K] extends TypescriptObject ? SignalRecord<T[K]> : WritableSignal<T[K]>;
} : T extends any[] ? (T[number] extends TypescriptObject ? SignalRecord<T[number]> : WritableSignal<T[number]>)[] : never;


const putMergeSignalRecord = (origin: Signal<any> | SignalRecord<any>, update: SignalRecord<any> | Signal<any> | any) => {
  if (isSignal(origin)) {
    if ('set' in origin) {
      let newValue = update;
      if (isSignal(newValue)) {
        newValue = newValue();
      }
      (origin as WritableSignal<any>).set(newValue);
    }
  } else {
    mergeSignalRecord(origin as SignalRecord<any>, update);
  }
};

export const mergeSignalRecord = <T extends TypescriptObject>(origin: SignalRecord<T>, update: SignalRecord<T> | T) => {
  if (Array.isArray(update) && Array.isArray(origin)) {
    update.forEach((item, index) => {
      putMergeSignalRecord(origin[index], item);
    });
  } else {
    Object.entries(update).forEach(([key, value]) => {
      putMergeSignalRecord((origin as Record<string, any>)[key], value);
    });
  }
};


export function signalRecord<T extends TypescriptObject>(obj: T[]): SignalRecord<T>[];
export function signalRecord<T extends Record<string, any>>(obj: T): SignalRecord<T>;
export function signalRecord<T extends any>(obj: T[]): WritableSignal<T>[];
export function signalRecord<T extends TypescriptObject>(obj: T): SignalRecord<T> | SignalRecord<T>[] | WritableSignal<T>[] {
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return [];
    }
    return obj.map(item => typeof item === 'object' ? signalRecord(item) : signal(item)) as SignalRecord<T>[];
  }
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && !('new' in value)) {
      value = signalRecord(value);
    } else {
      if (!isSignal(value)) {
        value = signal(value);
      }
    }
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>) as SignalRecord<T>;
}
