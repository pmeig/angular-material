import {Component, OnDestroy} from '@angular/core'
import {Observable, Subscription, throwError} from 'rxjs'
import {subscribe, Timeout, timeToMilliseconds} from "@ngp/core";

interface ItemListener<T> {
  id: string
  item: T
}

@Component({template: ''})
export abstract class Listener implements OnDestroy {
  private subscriptions: ItemListener<Subscription>[] = []
  private intervals: ItemListener<number>[] = []
  private timeouts: ItemListener<number>[] = []

  ngOnDestroy(): void {
    this.destroyList(
      () => this.subscriptions,
      item => item.item.unsubscribe()
    )
    this.destroyList(
      () => this.intervals,
      item => clearInterval(item.item)
    )
    this.destroyList(
      () => this.timeouts,
      item => clearTimeout(item.item)
    )
    this.onDestroy()
  }

  public addSubscription(
    subscription?: Subscription,
    name: string = Math.random().toString(36)
  ): string | undefined {
    let id = undefined
    if (subscription) {
      id = name
      this.subscriptions.push({ id, item: subscription })
    }
    return id
  }

  public addObservable<T, V>(
    observable: Observable<T> | undefined,
    subscription: (event: T) => void,
    error?: (error: V) => Observable<T>,
    complete?: () => void,
    name: string = Math.random().toString(36)
  ): string | undefined {
    if (observable) {
      if (!error) {
        error = (error) => throwError(() => error)
      }
      return this.addSubscription(
        subscribe(observable, subscription, error, complete),
        name
      )
    }
    return undefined
  }

  public clearSubscription(key: string | Subscription): boolean {
    return this.clear(this.subscriptions, key, index => {
      this.subscriptions[index].item.unsubscribe()
      this.subscriptions = this.subscriptions.splice(index, 1)
    })
  }

  public addTimeout(timeout: number): ItemListener<number> {
    const item = { id: Math.random().toString(36), item: timeout }
    this.timeouts.push(item)
    return item
  }

  public clearTimeout(timeout: number | string | undefined): boolean {
    return this.clear(this.timeouts, timeout, index => {
      clearTimeout(this.timeouts[index].item)
      this.timeouts = this.timeouts.splice(index, 1)
    })
  }

  public addInterval(interval: any): any {
    this.timeouts.push(interval)
    return interval
  }

  public clearInterval(interval: number | string | undefined): boolean {
    return this.clear(this.intervals, interval, index => {
      clearTimeout(this.intervals[index].item)
      this.intervals = this.intervals.splice(index, 1)
    })
  }

  public appendTimeout(
    timeout: Timeout | number,
    execute: () => void
  ): ItemListener<number> {
    return this.addTimeout(setTimeout(execute, timeToMilliseconds(timeout)))
  }

  public appendInterval(
    timeout: Timeout,
    execute: () => void
  ): ItemListener<number> {
    return this.addInterval(setInterval(execute, timeToMilliseconds(timeout)))
  }

  protected onDestroy(): void {}

  private destroyList<T>(list: () => T[], handler: (item: T) => void) {
    const items = list()
    let item = items.pop()
    while (item) {
      handler(item)
      item = items.pop()
    }
  }

  private clear<T extends Subscription | number>(
    items: ItemListener<T>[],
    key: Subscription | number | string | undefined,
    clearable: (index: number) => void
  ) {
    if (key) {
      const getField: (
        item: ItemListener<T>
      ) => string | number | Subscription =
        typeof key === 'string' ? item => item.id : item => item.item
      const index = items.findIndex(value => getField(value) === key)
      if (index > -1) {
        clearable(index)
        return true
      }
    }
    return false
  }
}
