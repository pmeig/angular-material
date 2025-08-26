import { Directive, input } from '@angular/core';
import { Color, colorToString, Empty, TagDirective } from '@pmeig/ng-material-core';

@Directive({
  selector: 'table, tr, th, td, thead, tbody, tfoot, .table, .tr, .th, .td, .thead, .tbody, .tfoot'
})
export class BTableColorDirective extends TagDirective {

  color = input<Empty<`table-${Color}`>, Color>('', {transform: color => colorToString(color, 'table') as `table-${Color}`});

  private lastColor = '';

  constructor() {
    super();
    this.effect(this.refreshColor);
  }

  private refreshColor() {
    this.removeClass(this.lastColor);
    const color = this.color();
    this.lastColor = color;
    if (color) {
      this.putClass(color);
    }
  }
}
