import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { BooleanAttribute } from '@pmeig/ng-material-core';
import { BLabelParentDirective } from './b-label-parent.directive';

@Directive({
  selector: 'input[label]:not([type=checkbox]):not([type=radio]):not([type=range]), ' +
    'textarea[label], ' +
    'select[label]'
})
export class BLabelFloatingDirective extends BLabelParentDirective {

  readonly floating = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute});
  readonly positionAttribute = input<'start' | 'end'>('start', {alias: 'label-position'});

  private position = computed(() => this.floating() ? 'end' : this.positionAttribute())


  constructor() {
    super();
    this.effect(this.refreshFloating);
    this.effect(this.refreshPosition);
  }


  protected override afterViewInit() {
    super.afterViewInit();
    setTimeout(() => {
      if (this.isInsideInputGroup) {
        this.refreshFloating();
        this.refreshPosition();
      }
    }, 100);
  }

  private get isInsideInputGroup() {
    const parent = this.parent?.parent ?? this.renderer.parentNode(this.element)
    return parent.tagName === 'INPUT-GROUP' || parent.hasAttribute('input-group');
  }

  private refreshFloating() {
    if (this.floating() && this.position() === 'end' && !this.isInsideInputGroup) {
      this.refreshParent('floating', this.floating());
    }
  }

  private refreshPosition() {
    if (this.floating() && (this.position() === 'start' || this.isInsideInputGroup)) {
      this.removeClass(this.parent?.parent ?? this.renderer.parentNode(this.element), 'form-floating');
    }
    this.renderer.insertBefore(this.parent?.parent ?? this.renderer.parentNode(this.element), this.label(),
      this.position() === 'start'
      || (this.isInsideInputGroup && (this.element.getAttribute('label-position') ?? 'start') === 'start')
        ? this.element : this.renderer.nextSibling(this.element), true);
  }
}
