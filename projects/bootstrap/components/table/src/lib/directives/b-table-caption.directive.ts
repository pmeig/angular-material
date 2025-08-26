import { Directive, Host, input, Optional } from '@angular/core';
import { emptyBooleanAttribute, EmptyBooleanAttribute, TagDirective } from '@pmeig/ng-material-core';
import { BTableDirective } from './b-table.directive';

@Directive({
  selector: 'caption'
})
export class BTableCaptionDirective extends TagDirective {

  top = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute});

  constructor(@Optional() @Host() private readonly table?: BTableDirective) {
    super();
    this.effect(this.afterViewInit);
  }

  protected override afterViewInit() {
    if (this.table) {
      this.removeClass(this.table.element, 'caption-top');
      if (this.top()) this.putClass(this.table.element, 'caption-top');
    }
  }

}
