import { Directive } from '@angular/core';
import { BSelectParentDirective } from './b-select-parent.directive';

@Directive({
  selector: 'select:not([multiple])',
})
export class BSelectDirective<T extends any> extends BSelectParentDirective<T | undefined> {

  constructor() {
    super(selection => selection.length > 0 ? selection[0] : undefined);
  }

}
