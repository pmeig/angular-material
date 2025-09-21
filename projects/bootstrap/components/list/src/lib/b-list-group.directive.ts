import { Directive, input } from '@angular/core';
import { BTagParentDirective } from '@pmeig/ngb-core';
import {
  ColorAttribute,
  colorAttributeToString,
  emptyBooleanAttribute,
  EmptyBooleanAttribute
} from '@pmeig/ng-material-core';

const LIST_GROUP = 'list-group';
const LIST_GROUP_ITEM = `${LIST_GROUP}-item`;

@Directive({
  selector: 'list-group'
})
export class BListGroupDirective extends BTagParentDirective {
  direction = input<'vertical' | 'horizontal'>('vertical');
  flush = input<boolean, EmptyBooleanAttribute>(false, { transform: emptyBooleanAttribute });
  numbered = input<boolean, EmptyBooleanAttribute>(false, { transform: emptyBooleanAttribute });
  background = input<string, ColorAttribute>('', { transform: color => colorAttributeToString(color, LIST_GROUP_ITEM) });
  stripped = input<boolean, EmptyBooleanAttribute>(false, { transform: emptyBooleanAttribute });

  private removeColor = () => {
  };

  constructor() {
    super();
    this.effect(this.onChangeDirection);
    this.effect(this.onChangeFlush);
    this.effect(this.onChangeNumbered);
    this.effect(this.onChangeBackground);
    this.effect(this.onStripped);
  }


  protected override afterViewInit() {
    super.afterViewInit();
    this.putClass(LIST_GROUP);
    this.putClassChildren(LIST_GROUP_ITEM);
    setTimeout(() => this.removeClass(LIST_GROUP_ITEM, `${LIST_GROUP_ITEM}-action`), 250);
  }

  private onChangeDirection() {
    this.putOrRemoveClass(`${LIST_GROUP}-horizontal`, this.direction() === 'horizontal');
  }

  private onChangeFlush() {
    this.putOrRemoveClass(`${LIST_GROUP}-flush`, this.flush());
  }

  private onChangeNumbered() {
    this.putOrRemoveClass(`${LIST_GROUP}-numbered`, this.numbered());
  }

  private putOrRemoveClass(classname: string, value: boolean) {
    if (value) {
      this.putClass(classname);
    } else {
      this.removeClass(classname);
    }
  }

  private onChangeBackground(loop: number = 0) {
    this.removeColor();
    const color = this.background();
    if (color.startsWith(LIST_GROUP_ITEM)) {
      this.putClassChildren(color);
      this.removeColor = () => this.removeClassChildren(color);
    } else {
      this.putStyleChildren({
        'background-color': color
      });
      this.removeColor = () => this.removeStyleChildren('background-color');
    }
    this.onStripped(loop + 1);
  }

  private onStripped(loop: number = 0) {
    if (this.background()) {
      if (this.stripped()) {
        setTimeout(() => {
          this.children((child, index) => {
            if (index % 2 === 0) {
              this.removeClass(child, this.background());
              this.removeStyleChildren(child, 'background-color');
            }
          });
        }, 50);
      } else if (loop < 2) {
        this.onChangeBackground(loop + 1);
      }
    }
  }
}
