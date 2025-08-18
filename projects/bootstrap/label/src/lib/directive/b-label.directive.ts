import { Directive, ElementRef, Input } from '@angular/core';
import { getDocument } from '@pmeig/ng-material-core';
import { bLabelCss } from '../b-label.css';
import { BTagDirective } from '@pmeig/ngb-core';

type LabelFor = Element & { placeholder?: string; type?: string };


@Directive({
  selector: 'label[for]',
  standalone: true,
})
export class BLabelDirective extends BTagDirective {
  private htmlFor: LabelFor;
  private readonly label: Element;

  @Input()
  set for(value: LabelFor) {
    this.htmlFor = value;
    if (this.isReady()) {
      this.putClassByInputType();
    }
  }

  constructor(element: ElementRef) {
    super(element);
    this.label = this.element;
    const id = (this.element as HTMLLabelElement).htmlFor;
    this.htmlFor = getDocument(this.element).getElementById(id) as Element;
  }

  protected override onInit() {
    super.onInit();
    this.insertStyle(bLabelCss);
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(this.htmlFor.tagName)) {
      let element = this.htmlFor;
      while (element && !(element instanceof HTMLElement)) {
        element = element.firstElementChild as LabelFor;
      }
      if (element) {
        this.renderer.listen(this.label, 'click', () => element.click());
      }
    }
  }

  private putClassByInputType() {
    let classAdded = 'form-label';
    const input = this.htmlFor;
    switch (input.type) {
      case 'checkbox':
      case 'radio':
        this.removeClass(this.label, 'form-label');
        this.putClass(this.label, 'form-check-label');
        classAdded = 'form-check-label';
        break;
      default:
        this.removeClass(this.label, 'form-check-label');
        this.putClass(this.label, 'form-label');
    }
    return classAdded;
  }
}
