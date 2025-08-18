import { booleanAttribute, Directive, Input } from '@angular/core';
import { BooleanAttribute } from '@pmeig/ng-material-core';
import { BLabelParentDirective } from './b-label-parent.directive';

@Directive({
  selector: 'input[label]:not([type=checkbox]):not([type=radio]):not([type=range]), ' +
    'textarea[label], ' +
    'select[label]',
})
export class BLabelFloatingDirective extends BLabelParentDirective {

  @Input()
  set floating(value: BooleanAttribute) {
    this.state['floating'] = booleanAttribute(value);
    if (this.isReady()) {
      if (this.state['floating']) {
        this.refreshParent('floating');
      } else {
        this.refreshPosition();
      }
    }
  }

  @Input('label-position')
  set position(position: 'start' | 'end') {
    this.state['position'] = position;
    if (this.isReady() && !this.state['floating']) this.refreshPosition();
  }


  constructor() {
    super();
  }


  protected override onInit() {
    this.refreshParent('floating', this.state['floating'] || true);
    this.state['position'] = this.state['position'] || 'start';
    this.state['floating'] = typeof this.state['floating'] === 'undefined' ? true : this.state['floating'];
    if (!this.state['floating']) {
      this.refreshPosition();
    }
    this.state.label.htmlFor = this.element.getAttribute('id') ?? '';
  }

  private refreshPosition() {
    const parent = this.refreshParent('floating', false);
    if (this.state['position'] === 'start') {
      if (parent.contains(this.state.label)) {
        this.renderer.removeChild(parent, this.state.label);
      }
      this.renderer.insertBefore(parent, this.state.label, this.element);
    } else {
      if (parent.contains(this.state.label)) {
        this.renderer.removeChild(parent, this.element);
        this.renderer.insertBefore(parent, this.element, this.state.label);
      } else {
        this.renderer.insertBefore(parent, this.state.label, this.renderer.nextSibling(this.element));
      }
    }
  }
}
