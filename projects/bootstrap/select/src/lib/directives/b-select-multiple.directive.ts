import { Directive } from '@angular/core';
import { BSelectParentDirective } from './b-select-parent.directive';

@Directive({
  selector: 'select[multiple], select[multiple="true"]'
})
export class BSelectMultipleDirective extends BSelectParentDirective<any, any[]>{

  constructor() {
    super(selection => selection || []);
  }
}
