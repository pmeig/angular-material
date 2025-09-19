import { Directive, input } from '@angular/core';
import { emptyBooleanAttribute, EmptyBooleanAttribute, TagDirective } from '@pmeig/ng-material-core';

@Directive({
  selector: 'td, tr, .td, .tr'
})
export class BTableContentOptionsDirective extends TagDirective {
  active = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute});

  constructor() {
    super();
    this.effect(this.refreshActive);
  }

  private refreshActive() {
    this.removeClass('table-active');
    if (this.active()) this.putClass('table-active');
  }
}
