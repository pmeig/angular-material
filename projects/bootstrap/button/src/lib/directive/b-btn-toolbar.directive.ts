import { Directive, effect, input } from '@angular/core';
import { TagParentDirective } from '@pmeig/ng-material-core';

@Directive({
  selector: '[btn-toolbar], btn-toolbar'
})
export class BBtnToolbarDirective extends TagParentDirective {
  gap = input<string>();

  constructor() {
    super();
    effect(() => this.refreshGap());
  }


  protected override onInit() {
    super.onInit();
    this.putClass('btn-toolbar');
  }

  protected override afterViewInit(): void {
    super.afterViewInit()
    this.refreshGap();
  }

  protected refreshGap() {
    if (this.gap()) {
      const elements = this.getChildren().slice(1);
      elements.forEach(value => {
        this.putStyle(value, { 'margin-left': this.gap()!! });
        this.removeStyle(value, 'margin-top');
      });
    } else {
      this.getChildren().forEach(child => {
        this.removeStyle(child, 'margin-top', 'margin-left');
      });
    }
  }

}
