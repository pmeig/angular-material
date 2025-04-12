import { Directive } from '@angular/core';
import { BTagDirective } from '@pmeig/ngb-core';

@Directive({
  selector: 'accordion'
})
export class BAccordionDirective extends BTagDirective {

  constructor() {
    super();
  }


  protected override onInit() {
    super.onInit();
    this.insertParent({
      classes: ['accordion-item']
    }, 'accordion');
  }


  protected override afterViewInit() {
    super.afterViewInit();
    const parent = this.renderer.parentNode(this.element)
    const next = this.renderer.nextSibling(parent);
    if (next?.classList.contains('accordion')) {
      (next as Element)!.childNodes.forEach(child => {
        this.renderer.appendChild(parent, child)
      })
      this.renderer.removeChild(this.renderer.parentNode(parent), next);
    }
  }
}
