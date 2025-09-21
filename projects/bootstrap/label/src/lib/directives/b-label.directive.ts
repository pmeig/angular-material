import { computed, Directive, ElementRef, input } from '@angular/core';
import { getDocument } from '@pmeig/ng-material-core';
import { bLabelCss } from '../b-label.css';
import { BTagDirective } from '@pmeig/ngb-core';

type LabelFor = Element & { placeholder?: string; type?: string };


@Directive({
  selector: 'label[for]',
  standalone: true
})
export class BLabelDirective extends BTagDirective<HTMLLabelElement> {
  for = input<LabelFor>();
  private readonly htmlFor: LabelFor;
  private target = computed(() => this.for() ?? this.htmlFor)

  constructor(element: ElementRef) {
    super(element);
    const id = this.element.htmlFor;
    this.htmlFor = getDocument(this.element).getElementById(id) as Element;
    this.effect(this.putClassByInputType)
  }

  protected override onInit() {
    super.onInit();
    this.insertStyle(bLabelCss);
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(this.target().tagName)) {
      let element = this.htmlFor;
      while (element && !(element instanceof HTMLElement)) {
        element = element.firstElementChild as LabelFor;
      }
      if (element) {
        this.renderer.listen(this.element, 'click', () => element.click());
      }
    }
  }

  private putClassByInputType() {
    let classAdded = 'form-label'
    const input = this.target();
    switch (input.type) {
      case 'checkbox':
      case 'radio':
        this.removeClass(this.element, 'form-label');
        this.putClass(this.element, 'form-check-label');
        classAdded='form-check-label';
        break;
      default:
        this.removeClass(this.element, 'form-check-label');
        this.putClass(this.element, 'form-label');
    }
    return classAdded
  }
}
