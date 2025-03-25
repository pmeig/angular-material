import { Directive, Input } from '@angular/core';
import { BLabelParentDirective } from './b-label-parent.directive';
import { Empty, emptyBooleanAttribute, EmptyBooleanAttribute } from '@pmeig/ng-material-core';

@Directive({
  selector: 'input[label][type=checkbox]:not([label-type=btn]), input[label][type=radio]:not([label-type=btn])',
})
export class BLabelCheckDirective extends BLabelParentDirective {

  @Input('label-type')
  set type(value: Empty<'btn' | 'label'>) {
    this.state['type'] = value ?? 'label';
  }

  @Input()
  set switch(value: EmptyBooleanAttribute) {
   this.state['switch'] = emptyBooleanAttribute(value)
    this.refresh(this.refreshTypeCheckbox)
  }

  constructor() {
    super();
    this.state['switch'] = false
  }


  protected override onInit() {
    super.onInit();
    this.refreshParent('check')
    this.refreshTypeCheckbox()
    this.putClass(this.state.label, 'form-check-label')
  }

  private refreshTypeCheckbox() {
    if (this.state['switch']) {
      this.insertParent('form-switch')
    } else {
      this.removeParent('form-switch')
    }
  }
}
