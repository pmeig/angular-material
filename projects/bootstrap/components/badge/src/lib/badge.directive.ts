import { Directive, input } from '@angular/core';
import {
  ColorAttribute,
  colorAttributeToString,
  emptyBooleanAttribute,
  EmptyBooleanAttribute
} from '@pmeig/ng-material-core';
import { BTagDirective } from '@pmeig/ngb-core';

@Directive({
  selector: 'badge'
})
export class BadgeDirective extends BTagDirective {

  private lastColor = colorAttributeToString('secondary', 'text-bg');
  private colorChanged = false

  color = input<string, ColorAttribute>(this.lastColor, {transform: color => {
    this.colorChanged = true;
    return colorAttributeToString(color, 'text-bg')
    }})
  format = input<'pill' | 'circle' | 'default'>('default')
  annotate = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute})

  constructor() {
    super();
    this.effect(this.applyColor)
    this.effect(this.applyFormat)
    this.effect(this.applyAnnotate)
  }


  protected override afterViewInit() {
    super.afterViewInit();
    this.putClass('badge');
    this.applyColor()
    this.applyFormat()
  }

  private applyColor() {
    this.removeClass(this.lastColor);
    this.putClass(this.color());
    this.lastColor = this.color();
  }

  private applyFormat() {
    this.removeClass('rounded-pill', 'rounded-circle');
    if (this.format() !== 'default') {
      this.putClass(`rounded-${this.format()}`);
    }
  }

  private applyAnnotate() {
    if (this.annotate()) {
      this.putClass('position-absolute', 'top-0', 'start-100',  'translate-middle');
      if (!this.colorChanged) {
        this.removeClass(this.lastColor);
        this.putClass(colorAttributeToString('danger', 'text-bg'))
      }
      if (this.element.childElementCount === 0 && !this.element.textContent) {
        if (this.format() === 'default') {
          this.putClass('rounded-circle');
        }
        this.putClass('p-2');
        const span = this.renderer.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        span.setAttribute('pmeig-notify', ' ');
        span.textContent = 'notify';
        this.putClass(span, 'visually-hidden')
        this.renderer.appendChild(this.element, span);
      } else if (this.format() === 'default') {
        this.putClass('rounded-pill');
      }
      this.putClass(this.renderer.parentNode(this.element), 'position-relative', 'mt-2')
    } else {
      this.removeClass('position-absolute', 'top-0', 'start-100',  'translate-middle', 'p-2');
      this.applyFormat()
      this.removeClass(this.renderer.parentNode(this.element), 'position-relative', 'mt-2')
      if (!this.colorChanged) {
        this.removeClass(colorAttributeToString('danger', 'text-bg'))
        this.putClass(this.lastColor);
      }
      this.element.childNodes.forEach(child => {
        if (child.nodeName === 'SPAN' && (child as Element).hasAttribute('pmeig-notify')) {
          this.renderer.removeChild(this.element, child);
        }
      })
    }
  }
}
