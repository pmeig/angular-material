import { computed, Directive, input } from '@angular/core';
import {
  ColorAttribute,
  colorAttributeToString,
  emptyBooleanAttribute,
  EmptyBooleanAttribute,
  isColor
} from '@pmeig/ng-material-core';
import { BLabelCheckDirective } from './b-label-check.directive';

@Directive({
  selector: 'input[label][type=checkbox][label-type=btn], input[label][type=radio][label-type=btn]',
})
export class BLabelCheckButtonDirective extends BLabelCheckDirective {
  outline = input<'btn-outline' | 'btn', EmptyBooleanAttribute>('btn', {alias: 'label-btn-outline',
    transform: outline => emptyBooleanAttribute(outline) ? 'btn-outline' : 'btn'});
  colorAttribute = input<ColorAttribute>(undefined, {alias: 'label-btn-color'});

  private color = computed(() => colorAttributeToString(this.colorAttribute(), this.outline()));

  constructor() {
    super()
    this.effect(this.refreshColor);
    this.effect(() => {
      this.putClass(this.label(), 'btn');
      this.removeClass(this.label(), 'form-check-label')
    })
  }


  protected override onInit() {
    super.onInit();
    this.removeClass('form-check-input')
    this.putClass('btn-check')

  }

  private refreshColor(add: boolean = true) {
    const action = (add ? this.putClass : this.removeClass).bind(this);
    const label = this.label();
    if (this.colorAttribute()) {
      const color = this.color()
      if (isColor(color)) {
        action(label, color)
      } else {
        action(label, this.outline())
        const styleAction = (add ? this.putStyle : this.removeStyle).bind(this);
        if (this.outline() === 'btn') {
          styleAction(label, 'background-color', color)
        }
        styleAction(label, 'border-color', color)
      }
    }
  }
}
