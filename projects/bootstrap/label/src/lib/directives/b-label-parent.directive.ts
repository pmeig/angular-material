import { Directive, inject, INJECTOR, input, TemplateRef } from '@angular/core';
import { BTagDirective } from '@pmeig/ngb-core';

@Directive()
export class BLabelParentDirective extends BTagDirective {

  label = input<HTMLLabelElement,string | TemplateRef<any>>(this.renderer.createElement('label'),
    {transform: value => this.labelValueTransform(value)});

  protected injector = inject(INJECTOR);

  constructor() {
    super();
    this.effect(() => {
      this.label().htmlFor = this.element.getAttribute('id') ?? '';
      this.putClass(this.label(), 'form-label');
      this.renderer.insertBefore(this.renderer.parentNode(this.element), this.label(), this.element);
    })
  }


  protected refreshParent(classname: 'floating' | 'check', add: boolean = true) {
    const formClassname = `form-${classname}`
    let parent
    if (add) {
      parent = this.insertParent(formClassname)
      if (!parent.classList.contains('input-group')) {
        this.removeClass(parent, classname === 'floating' ? 'form-check' : 'form-floating')
        this.removeClass(this.label(), 'form-label');
        this.renderer.insertBefore(parent!, this.label(), this.renderer.nextSibling(this.element), true);
        if (!this.element.getAttribute('placeholder')) {
          this.putAttribute('placeholder', ' ')
        }
      }
    } else {
      parent = this.removeParent();
      this.putClass(this.label(), 'form-label');
      this.renderer.insertBefore(parent, this.label(), this.element, true);
    }
    return parent;
  }

  private labelValueTransform(value: string | TemplateRef<any>) {
    const label = this.renderer.createElement('label');
    if (typeof value === 'string') {
      label.innerHTML = value;
    } else {
      value.createEmbeddedView({}, this.injector)?.rootNodes?.forEach(node => {
        this.renderer.appendChild(label, node);
      });
    }
    return label;
  }
}
