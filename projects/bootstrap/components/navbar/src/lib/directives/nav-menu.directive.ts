import { Directive, input } from '@angular/core';
import { TagParentDirective } from '@pmeig/ng-material-core';
import { sharedDirectiveParent } from './event.directives';

@Directive({
  selector: '[nav-menu]',
  standalone: true,
})
export class NavMenuDirective extends TagParentDirective {
  ref = Math.random().toString(36);
  navigator = input<string>('page')
  name = input<string>('');

  constructor() {
    super()
  }


  protected override afterViewInit() {
    super.afterViewInit();
    this.children((child, index) => {
      if (child) {
        sharedDirectiveParent.next({child, directive: this, index})
        const li = this.renderer.createElement('li')
        this.putClass(li, 'nav-item')
        this.renderer.insertBefore(this.element, li, child)
        this.renderer.removeChild(this.element, child)
        this.renderer.appendChild(li, child)
        if (!child.id) this.putAttribute(child, 'id', `${this.name()}-nav-item-${index}`)
      }
    })
  }
}
