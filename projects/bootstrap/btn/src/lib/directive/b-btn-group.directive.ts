import { booleanAttribute, Directive, effect, Input } from '@angular/core';
import { BooleanAttribute, SizeAttribute } from '@pmeig/ng-material-core';
import { BBtnToolbarDirective } from './b-btn-toolbar.directive';

interface BtnState {
  size?: SizeAttribute;
  vertical: boolean;
}

@Directive({
  standalone: true,
  selector: 'btn-group, [btn-group]'
})
export class BBtnGroupDirective extends BBtnToolbarDirective {
  private state: BtnState = {
    vertical: false
  };

  constructor() {
    super();
    effect(() => this.refreshGap());
  }

  @Input()
  set size(value: SizeAttribute) {
    if (this.state.size) {
      this.removeClass(`btn-group-${this.state.size}`);
    }
    this.state.size = value;
    this.refreshSize();
  }

  @Input('btn-group')
  set directiveVertical(value: 'vertical' | '' | 'horizontal') {
    this.vertical = value === 'vertical';
  }

  @Input()
  set vertical(value: BooleanAttribute | '') {
    this.state.vertical = value === '' || booleanAttribute(value);
    this.refreshVertical();
  }


  override set classChild(classes: string | undefined) {
    super.classChild = classes;
  }

  protected override onInit() {
    this.getChildren().forEach(child => {
      this.putAttribute(child, 'override', 'true');
      if (child.tagName === 'INPUT') {
        switch (child.getAttribute('type')) {
          case 'radio':
          case 'checkbox':
            this.putClass(child, 'btn-check');
            break;
          default:
            this.putClass(child, 'btn');
        }
      } else if (child.tagName === 'LABEL') {
        this.putClass(child, 'btn');
      }
    });
  }

  protected override afterViewInit() {
    super.afterViewInit();
    this.refreshSize();
    this.refreshVertical();
  }

  protected override refreshGap() {
    if (!this.isOverride) {
      if (this.state.vertical) {
        if (this.gap()) {
          const elements = this.getChildren().slice(1);
          elements.forEach(value => {
            this.putStyle(value, { 'margin-top': this.gap()!! });
            this.removeStyle(value, 'margin-left');
          });
        }
      } else super.refreshGap();
    } else {
      this.getChildren().forEach(child => {
        this.removeStyle(child, 'margin-top', 'margin-left');
      });
    }
  }

  private refreshSize() {
    if (this.state.size) {
      this.putClass(`btn-group-${this.state.size}`);
    }
  }

  private refreshVertical() {
    if (this.state.vertical) {
      this.putClass(`btn-group-vertical`);
      this.removeClass('btn-group');
    } else {
      this.removeClass(`btn-group-vertical`);
      this.putClass(`btn-group`);
    }
    this.refreshGap();
  }
}
