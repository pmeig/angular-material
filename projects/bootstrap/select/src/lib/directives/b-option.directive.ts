import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: 'option'
})
export class BOptionDirective {
  readonly value = input<any>()
  readonly _ngValue = input<any>(undefined, {alias: 'ngValue'})
  readonly ngValue = computed<any>(() => this._ngValue() || this.value())

  constructor() {
  }

}
