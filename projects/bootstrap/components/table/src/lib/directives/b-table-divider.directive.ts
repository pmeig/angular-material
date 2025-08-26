import { Directive } from '@angular/core';
import { TagDirective } from '@pmeig/ng-material-core';

@Directive({
  selector: '[divider]'
})
export class BTableDividerDirective extends TagDirective {

  constructor() {
    super();
  }

  protected override afterViewInit() {
    super.afterViewInit();
    this.putClass('table-group-divider');
  }

}
