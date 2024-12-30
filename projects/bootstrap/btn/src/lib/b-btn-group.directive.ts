import { booleanAttribute, Directive, Injectable, Input } from '@angular/core';
import { BooleanAttribute, SizeAttribute } from '@pmeig/ng-material-core';
import { BTagParentDirective } from '@pmeig/ngb-core';

@Injectable({providedIn: 'root'})
@Directive({
  standalone: true,
  selector: 'button-group, [btn-group]'
})
export class BBtnGroupDirective extends BTagParentDirective {
  @Input() size: SizeAttribute;
  @Input() vertical: BooleanAttribute = false;
  @Input() gap: string | undefined;
  private lastSize: SizeAttribute;
  private elements: Element[] = [];

  constructor() {
    super();
  }

  protected override afterViewInit() {
    if (this.lastSize) {
      this.removeClass(`btn-group-${this.lastSize}`);
    }
    this.lastSize = this.size;
    if (this.size) {
      this.putClass(`btn-group-${this.size}`);
    }
    const isVertical = booleanAttribute(this.vertical);
    if (isVertical) {
      this.putClass(`btn-group-vertical`);
      this.removeClass('btn-group');
    } else {
      this.removeClass(`btn-group-vertical`);
      this.putClass(`btn-group`);
    }
    this.elements = this.elements.length > 0 ? this.elements : this.getChildren();
    this.elements.forEach(element => this.putClass(element, 'btn'));
    if (this.gap && this.elements.length > 0) {
      const addMargin = this.elements.slice(1);
      if (isVertical) {
        addMargin.forEach(value => {
          this.putStyle(value, { 'margin-top': this.gap!! });
          this.removeStyle(value, 'margin-left');
        });
      } else {
        addMargin.forEach(value => {
          this.putStyle(value, { 'margin-left': this.gap!! });
          this.removeStyle(value, 'margin-right');
        });
      }
    }
  }
}
