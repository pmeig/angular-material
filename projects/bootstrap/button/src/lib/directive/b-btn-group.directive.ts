import { computed, Directive, input } from '@angular/core';
import { Empty, emptyBooleanAttribute, EmptyBooleanAttribute, SizeAttribute } from '@pmeig/ng-material-core';
import { BBtnToolbarDirective } from './b-btn-toolbar.directive';

@Directive({
  standalone: true,
  selector: 'btn-group, [btn-group]',
})
export class BBtnGroupDirective extends BBtnToolbarDirective {

  size = input<string, SizeAttribute>('', {transform: size => size ? `btn-group-${size}` : ''});
  btnGroup = input<boolean, Empty<'vertical' | 'horizontal'>>(false,
    {transform: value => value === 'vertical', alias: 'btn-group'});
  verticalAttribute = input<boolean, EmptyBooleanAttribute>(false,
    {transform: value => emptyBooleanAttribute(value), alias: 'vertical'});

  private vertical = computed(() => this.verticalAttribute() || this.btnGroup())

  constructor() {
    super();
    this.effect(this.refreshSize);
    this.effect(this.refreshVertical);
  }

  protected override onInit() {
    super.onInit();
    setTimeout(() => this.removeClass('btn-toolbar'));
    this.getChildren().forEach(child => {
      if (child.tagName === 'INPUT') {
        this.addAttribute(child, 'class-ignore', 'btn-check btn');
        switch (child.getAttribute('type')) {
          case 'radio':
          case 'checkbox':
            this.putClass(child, 'btn-check');
            break;
          default:
            this.putClass(child, 'btn');
        }
        if (child.getAttribute('label')) {
          this.putAttribute(child, 'label-type', 'btn');
        }
        this.removeClass(child, 'form-check-input', 'form-control', 'form-range');
      } else if (child.tagName === 'LABEL') {
        this.putClass(child, 'btn');
      }
    });
    this.putAttribute('pmeig-parent', 'btn-group');
  }

  protected override refreshGap() {
    if (this.vertical()) {
      if (this.gap()) {
        const elements = this.getChildren().slice(1);
        elements.forEach(value => {
          this.putStyle(value, { 'margin-top': this.gap()!! });
          this.removeStyle(value, 'margin-left');
        });
      }
    } else super.refreshGap();
  }

  private refreshVertical() {
    if (this.vertical()) {
      this.putClass(`btn-group-vertical`);
      this.removeClass('btn-group');
    } else {
      this.removeClass(`btn-group-vertical`);
      this.putClass(`btn-group`);
    }
    this.refreshGap();
  }

  private refreshSize() {
    this.removeClass(...['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxs'].map(value => `btn-${value}`));
    const size = this.size();
    if (size) {
      this.putClass(size);
    }
  }
}
