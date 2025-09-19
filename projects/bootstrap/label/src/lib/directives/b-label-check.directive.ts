import { Directive, input } from '@angular/core';
import { BLabelParentDirective } from './b-label-parent.directive';
import { emptyBooleanAttribute, EmptyBooleanAttribute } from '@pmeig/ng-material-core';

@Directive({
  selector: 'input[label][type=checkbox]:not([label-type=btn]), input[label][type=radio]:not([label-type=btn])',
})
export class BLabelCheckDirective extends BLabelParentDirective {

  switch = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute})


  constructor() {
    super();
    this.effect(this.refreshTypeCheckbox)
    this.effect(() => {
      this.putClass(this.label(), 'form-check-label')
      this.removeClass(this.label(), 'btn')
    })
  }

  protected override afterViewInit() {
    this.refreshParent('check')
  }

  private refreshTypeCheckbox() {
    if (this.switch()) {
      this.insertParent('form-switch')
    } else {
      this.removeParent()
    }
  }
}
