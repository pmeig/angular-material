import { Directive, input } from '@angular/core';
import { TagDirective } from '@pmeig/ng-material-core';

@Directive({
  selector: 'li',
})
export class DropdownLiDirective extends TagDirective {

  active = input<boolean>(false);

  constructor() {
    super();
    this.effect(() => this.refreshActive(this.active()));
  }


  protected override afterViewInit() {
    const classes = ['dropdown-item'];
    if (this.active()) {
      classes.push('active');
    }
    this.putStyle('cursor', 'pointer');
    this.element.childNodes.forEach(child => {
      if (child?.nodeType !== Node.ELEMENT_NODE) {
        this.renderer.removeChild(this.element, child);
        const span = this.renderer.createElement('span');
        this.putClass(span, ...classes);
        this.renderer.appendChild(span, child);
        this.renderer.appendChild(this.element, span);
      } else {
        this.putClass(child as Element, ...classes);
      }
    });
    super.afterViewInit();
  }

  private refreshActive(active: boolean) {
    let action: (element: Element, ...classes: string[]) => void = this.removeClass.bind(this);
    if (active) {
      action = this.putClass.bind(this);
    }
    let element: Element | null = null;
    const nodes = this.element.childNodes;
    let index = nodes.length;
    while (!element && index-- > 0) {
      const child = nodes[index];
      if (child?.nodeType === Node.ELEMENT_NODE && (child as Element).classList.contains('dropdown-item')) {
        element = child as Element;
      }
    }
    if (element) {
      action(element, 'active');
    }
  }
}
