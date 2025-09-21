import { Directive, effect, ElementRef, input } from '@angular/core';
import { TagDirective } from './tag.directive';

@Directive({
  selector: '[inside]'
})
export class InsideDirective extends TagDirective {
  inside = input<ElementRef | Element>();
  private removeLast = () => {
  };

  constructor() {
    super();
    effect(() => this.resetInside(this.inside()));
  }


  protected override afterViewInit() {
    super.afterViewInit();
    this.resetInside(this.inside());
  }

  private resetInside(element?: ElementRef | Element) {
    this.removeLast();
    if (element) {
      let insert = element;
      if (element instanceof ElementRef) {
        insert = element.nativeElement;
      }
      this.removeLast = () => this.renderer.removeChild(this.element, insert);
      this.renderer.appendChild(this.element, insert);
    } else this.removeLast = () => {
    };
  }
}
