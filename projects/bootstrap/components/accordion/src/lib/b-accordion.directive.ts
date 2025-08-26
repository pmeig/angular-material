import { Directive, input } from '@angular/core';
import { emptyBooleanAttribute, EmptyBooleanAttribute } from '@pmeig/ng-material-core';
import { BTagDirective } from '@pmeig/ngb-core';

@Directive({
  selector: 'accordion',
})
export class BAccordionDirective extends BTagDirective {
  private accordion: Element | null = null;

  flush = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute})

  constructor() {
    super();
    this.effect(this.refreshFlush)
  }




  protected override afterViewInit() {
    super.afterViewInit();
    this.createParentAccordion();
  }

  private refreshFlush() {
    if (this.flush()) {
      this.putClass(this.accordion, 'accordion-flush')
    } else {
      this.removeClass(this.accordion, 'accordion-flush')
    }
  }

  private createParentAccordion() {
    let previous = this.element.previousElementSibling;
    if (!previous || previous.tagName !== 'ACCORDION' && !previous.classList.contains('accordion')) {
      setTimeout(() => {
        this.accordion = this.renderer.createElement('div');
        this.putClass(this.accordion, 'accordion');
        this.renderer.insertBefore(this.renderer.parentNode(this.element), this.accordion, this.element);
        this.renderer.appendChild(this.accordion, this.element.firstElementChild);
        this.renderer.removeChild(this.renderer.parentNode(this.element), this.element);
        if (this.flush()) {
          this.putClass(this.accordion, 'accordion-flush');
        }
      });
    } else {
      let timestamp = 0;
      while (previous?.tagName === 'ACCORDION') {
        previous = previous.previousElementSibling;
        timestamp += .5;
      }
      setTimeout(() => {
        this.accordion = this.element.previousElementSibling;
        while (this.accordion && !this.accordion.classList.contains('accordion')) {
          this.accordion = this.accordion.previousElementSibling;
        }
        this.renderer.appendChild(this.accordion, this.element.firstElementChild);
        this.renderer.removeChild(this.renderer.parentNode(this.element), this.element);
        if (this.flush()) {
          this.putClass(this.accordion, 'accordion-flush');
        }
      }, timestamp);
    }
  }
}
