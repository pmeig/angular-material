import { booleanAttribute, Directive, input } from '@angular/core';
import { BTagParentDirective } from '@pmeig/ngb-core';
import { BooleanAttribute, ColorAttribute, colorAttributeToString } from '@pmeig/ng-material-core';

const LIST_GROUP = 'list-group';
const LIST_GROUP_ITEM = `${LIST_GROUP}-item`;

@Directive({
  selector: 'list-group'
})
export class BListGroupDirective extends BTagParentDirective {
  direction = input<'vertical' | 'horizontal'>('vertical');
  flush = input<boolean, BooleanAttribute>(false, { transform: booleanAttribute });
  numbered = input<boolean, BooleanAttribute>(false, { transform: booleanAttribute });
  background = input<string, ColorAttribute>('', { transform: color => colorAttributeToString(color, LIST_GROUP_ITEM) });
  stripped = input<boolean, BooleanAttribute>(false, { transform: booleanAttribute });

  private removeColor = () => {
  };

  constructor() {
    super();
    this.effect(() => this.onChangeDirection(this.direction()));
    this.effect(() => this.onChangeFlush(this.flush()));
    this.effect(() => this.onChangeNumbered(this.numbered()));
    this.effect(() => this.onChangeBackground(this.background()));
    this.effect(() => this.onStripped(this.stripped()));
  }


  protected override afterViewInit() {
    super.afterViewInit();
    this.putClass(LIST_GROUP);
    this.putClassChildren(LIST_GROUP_ITEM);
    this.onChangeDirection(this.direction());
    this.onChangeFlush(this.flush());
    this.onChangeNumbered(this.numbered());
    setTimeout(() => this.removeClass(LIST_GROUP_ITEM, `${LIST_GROUP_ITEM}-action`), 250);
  }

  private onChangeDirection(direction: 'vertical' | 'horizontal') {
    this.putOrRemoveClass(`${LIST_GROUP}-horizontal`, direction === 'horizontal');
  }

  private onChangeFlush(flush: boolean) {
    this.putOrRemoveClass(`${LIST_GROUP}-flush`, flush);
  }

  private onChangeNumbered(numbered: boolean) {
    this.putOrRemoveClass(`${LIST_GROUP}-numbered`, numbered);
  }

  private putOrRemoveClass(classname: string, value: boolean) {
    if (value) {
      this.putClass(classname);
    } else {
      this.removeClass(classname);
    }
  }

  private onChangeBackground(color: string, loop: number = 0) {
    this.removeColor();
    if (color.startsWith(LIST_GROUP_ITEM)) {
      this.putClassChildren(color);
      this.removeColor = () => this.removeClassChildren(color);
    } else {
      this.putStyleChildren({
        'background-color': color
      });
      this.removeColor = () => this.removeStyleChildren('background-color');
    }
    this.onStripped(this.stripped(), loop + 1);
  }

  private onStripped(stripped: boolean, loop: number = 0) {
    if (this.background()) {
      if (stripped) {
        setTimeout(() => {
          this.children((child, index) => {
            if (index % 2 === 0) {
              this.removeClass(child, this.background());
              this.removeStyleChildren(child, 'background-color');
            }
          });
        }, 50);
      } else if (loop < 2) {
        this.onChangeBackground(this.background(), loop + 1);
      }
    }
  }
}
