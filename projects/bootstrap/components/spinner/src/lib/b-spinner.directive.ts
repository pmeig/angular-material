import { computed, Directive, ElementRef, inject, input } from '@angular/core';
import { BTagDirective } from '@pmeig/ngb-core';
import { colorAttribute, ColorAttribute, ColorConfig } from '@pmeig/ng-material-core';

@Directive({
  selector: 'spinner'
})
export class Spinner extends BTagDirective {
  size = input<'sm' | 'lg'>()
  shape = input<'border' | 'grow'>('border')
  color = input<ColorConfig, ColorAttribute>({style: ''}, {transform: color => colorAttribute(color, 'text')})

  private removeLastColor = () => {};

  private classname = computed(() => `spinner-${this.shape()}`)

  constructor(elementRef: ElementRef<Element> = inject(ElementRef)) {
    super(elementRef);
    this.effect(() => this.refreshSize(this.size()))
    this.effect(() => this.refreshColor(this.color()))
  }


  protected override onInit() {
    super.onInit();
    this.putClass(this.classname());
    this.refreshSize(this.size());
    this.refreshColor(this.color());

  }

  private refreshSize(size?: 'sm' | 'lg') {
    this.removeClass(`${this.classname()}-sm`, `${this.classname()}-lg`)
    if  (size) {
      this.putClass( `${this.classname()}-${size}`)
    }
  }

  private refreshColor(color: ColorConfig) {
    this.removeLastColor();
    this.removeLastColor = () => {};
    if (color.color) {
      this.putClass(color.color);
      this.removeLastColor = () => {
        console.log('remove', color)
        this.removeClass(color.color!);
      }
    } else if (color.style) {
      this.removeLastColor = () => this.removeStyle('color');
      this.putStyle('color', color.rgb ?? color.style as string)
    }
  }
}
