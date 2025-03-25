import { Directive, Input } from '@angular/core';
import { ColorAttribute, colorAttributeToString, isColor } from '@pmeig/ng-material-core';
import { BLabelCheckDirective } from './b-label-check.directive';

@Directive({
  selector: 'input[label][type=checkbox][label-type=btn], input[label][type=radio][label-type=btn]',
})
export class BLabelCheckButtonDirective extends BLabelCheckDirective {

  @Input('label-btn-outline')
  set outline(value: ColorAttribute) {
    this.inputColorHandler(() => {
      this.state['prefix'] = value ? 'btn-outline' : 'btn'
      this.color = value
    })
  }

  @Input('label-btn-color')
  set color(value: ColorAttribute) {
    this.inputColorHandler(() => this.state['color'] = value)
  }

  constructor() {
    super()
  }


  protected override onInit() {
    super.onInit();
    this.state['prefix'] = this.state['prefix'] || 'btn';
    this.removeClass(this.state.label, 'form-check-label')
    this.removeClass('form-check-input')
    this.putClass('btn-check')
    this.putClass(this.state.label, 'btn')
    this.refreshColor()
  }

  private refreshColor(add: boolean = true) {
    const action = (add ? this.putClass : this.removeClass).bind(this);
    if (this.state['color']) {
      const color = colorAttributeToString(this.state['color'], this.state['prefix'])
      if (isColor(this.state['color'])) {
        action(this.state.label, color)
      } else {
        action(this.state.label, this.state['prefix'])
        const styleAction = (add ? this.putStyle : this.removeStyle).bind(this);
        if (this.state['prefix'] === 'btn') {
          styleAction(this.state.label, 'background-color', color)
        }
        styleAction(this.state.label, 'border-color', color)
      }
    }
  }

  private inputColorHandler(handler: () => void) {
    this.refresh(() => this.refreshColor(false))
    handler()
    this.refresh(this.refreshColor)
  }
}
