import { computed, Directive, ElementRef, inject, input } from '@angular/core';
import { BTagDirective } from '@pmeig/ngb-core';
import { colorAttribute, ColorAttribute, ColorConfig } from '@pmeig/ng-material-core';

@Directive({
  selector: 'spinner'
})
export class SpinnerMaterial extends BTagDirective {
  size = input<'sm' | 'lg'>()
  shape = input<'border' | 'grow'>('border')
  color = input<ColorConfig, ColorAttribute>({style: ''}, {transform: color => colorAttribute(color, 'text')})

  private removeLastColor = () => {};

  private classname = computed(() => `spinner-${this.shape()}`)

  constructor(elementRef: ElementRef<Element> = inject(ElementRef)) {
    super(elementRef);
    this.effect(this.refreshSize)
    this.effect(this.refreshColor)
  }


  protected override onInit() {
    super.onInit();
    this.putClass(this.classname());
  }

  private refreshSize() {
    const size = this.size();
    this.removeClass(`${this.classname()}-sm`, `${this.classname()}-lg`)
    if  (size) {
      this.putClass( `${this.classname()}-${size}`)
    }
  }

  private refreshColor() {
    this.removeLastColor();
    this.removeLastColor = () => {};
    const color = this.color();
    if (color.color) {
      this.putClass(color.color);
      this.removeLastColor = () => {
        this.removeClass(color.color!);
      }
    } else if (color.style) {
      this.removeLastColor = () => this.removeStyle('color');
      this.putStyle('color', color.rgb ?? color.style as string)
    }
  }
}
