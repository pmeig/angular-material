import { Directive, inject, INJECTOR, Input, TemplateRef } from '@angular/core';
import { BTagDirective } from '@pmeig/ngb-core';
import { Optional } from '@pmeig/ng-core';

@Directive()
export class BLabelParentDirective extends BTagDirective {
  protected injector = inject(INJECTOR);
  protected state: Record<string, any> & { label: HTMLLabelElement } = {
    label: this.renderer.createElement('label') as HTMLLabelElement,
  };

  @Input()
  set label(value: Optional<string | TemplateRef<any>>) {
    if (typeof value === 'string') {
      this.state.label.innerHTML = value;
    } else {
      value?.createEmbeddedView({}, this.injector)?.rootNodes?.forEach(node => {
        this.renderer.appendChild(this.state.label, node);
      });
    }
  }

  constructor() {
    super();
  }


  protected override onInit() {
    super.onInit();
    this.state.label.htmlFor = this.element.id;
  }

  protected refreshParent(classname: 'floating' | 'check', add: boolean = true) {
    const formClassname = `form-${classname}`;
    let parent;
    if (add) {
      parent = this.insertParent(formClassname);
      this.removeClass(parent, classname === 'floating' ? 'form-check' : 'form-floating');
      this.removeClass(this.state.label, 'form-label');
      this.renderer.insertBefore(parent, this.state.label, this.renderer.nextSibling(this.element));
      if (!this.element.getAttribute('placeholder')) {
        this.putAttribute('placeholder', ' ');
      }
    } else {
      parent = this.removeParent();
      this.putClass(this.state.label, 'form-label');
      this.renderer.removeChild(parent, this.state.label);
      this.renderer.insertBefore(parent, this.state.label, this.element);
    }
    return parent;
  }

}
