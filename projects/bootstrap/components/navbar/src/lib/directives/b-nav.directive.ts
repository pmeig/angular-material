import { Directive, input } from '@angular/core';
import { BTagParentDirective } from '@pmeig/ngb-core';
import { Empty } from '@pmeig/ng-material-core';
import { sharedDirectiveParent } from './event.directives';

type NavDecorator = 'pills' | 'tabs' | 'underline';
type NavSpaces = 'fill' | 'justified'

@Directive({
  selector: 'nav, ul[nav], ol[nav]',
})
export class BNavDirective extends BTagParentDirective {
  ref = Math.random().toString(36);
  navigator = input<string>('page')
  name = input<string>('');
  direction = input<'horizontal' | 'vertical'>('horizontal');
  format = input<Empty<`nav-${NavDecorator}`>, NavDecorator>('', { transform: (decor: NavDecorator) => `nav-${decor}` });
  spaces = input<Empty<`nav-${NavSpaces}`>, NavSpaces>('', { transform: space => `nav-${space}`});

  constructor() {
    super();
    this.effect(() => this.changeDirection(this.direction()));
    this.effect(() => this.changeFormat(this.format()));
    this.effect(() => this.changeSpaces(this.spaces()));
  }


  protected override onInit() {
    super.onInit();
    this.putClass('nav');
    this.changeDirection(this.direction());
    this.changeFormat(this.format());
  }


  protected override afterViewInit() {
    super.afterViewInit();
    let insert = (child: Element | null) => child
    if (['UL', 'OL'].includes(this.element.tagName)) {
      insert = (child: Element | null) => {
        if (child?.tagName === 'LI') return child;
        const li = this.renderer.createElement('li')
        this.renderer.insertBefore(this.element, li, child);
        this.renderer.removeChild(this.element, child);
        this.renderer.appendChild(li, child);
        return li;
      }
    }
    this.children((child, index) => {
      if (child) {
        sharedDirectiveParent.next({child, directive: this, index})
        child = insert(child);
        if (child?.tagName !== 'A') this.putClass(child, 'nav-item');
      }
    });
  }

  private changeDirection(direction: 'horizontal' | 'vertical') {
    if (direction === 'vertical') {
      this.putClass('flex-column');
    } else {
      this.removeClass('flex-column');
    }
  }

  private changeFormat(decorator: Empty<`nav-${NavDecorator}`>) {
    this.removeClass('nav-pills', 'nav-tabs', 'nav-underline');
    this.putClass(decorator);
  }

  private changeSpaces(spaces: Empty<`nav-${NavSpaces}`>) {
    this.removeClass('nav-fill', 'nav-justified');
    this.putClass(spaces);
  }
}
