import { booleanAttribute, Directive, input, Input } from '@angular/core';
import { BooleanAttribute } from '@pmeig/ng-material-core';
import { BOOTSTRAP_ANIMATION_TIMEOUT, BTagTemplateDirective } from '@pmeig/ngb-core';

@Directive({
  selector: '[collapse]'
})
export class CollapseDirective extends BTagTemplateDirective {
  private reset = () => {}
  private orchestrator: Element | undefined = undefined;

  readonly collapseAnimation = input<'vertical' | 'horizontal'>('vertical');

  @Input()
  set collapse(value: BooleanAttribute | Element) {
    if (!['boolean', 'string'].includes(typeof value)) {
      this.reset()
      this.orchestrator = value as Element
      this.reset = this.renderer.listen(this.orchestrator, 'click', () => {
        this.collapse = this.orchestrator!.classList.contains('collapsed')
      })
      setTimeout(() => this.collapse = this.orchestrator!.classList.contains('collapsed'))
    } else {
      value = booleanAttribute(value)
      if (value) {
        this.show();
      } else {
        this.close()
      }
    }
  }

  constructor() {
    super();
  }

  protected override onShow() {
    console.log('open')
    const style = this.getConfig();
    this.removeClass(this.orchestrator, 'collapsed')
    this.removeClass('collapse')
    this.putClass('collapsing')
    this.putStyle({ [style.style]: `${this.findPixel(style.style)}px`})


    this.addTimeout(() => {
      this.putClass('collapse', 'show')
      this.removeClass('collapsing')
    }, BOOTSTRAP_ANIMATION_TIMEOUT)
  }

  private close() {
    this.putClass(this.orchestrator, 'collapsed')
    this.removeClass('collapse', 'show')
    this.putClass('collapsing')
    this.removeStyle('height', 'width')
    this.addTimeout(() => {
      this.hide()
    }, BOOTSTRAP_ANIMATION_TIMEOUT)
  }

  private getConfig():  { style: 'height' | 'width', start: 'Top' | 'Left', end: 'Bottom' | 'Right' } {
    this.removeClass('collapse-horizontal')
    if (this.collapseAnimation() === 'vertical') {
      return {
        style: 'height',
        start: 'Top',
        end: 'Bottom'
      }
    }
    this.putClass('collapse-horizontal')
    return {
      style: 'width',
      start: 'Left',
      end: 'Right'
    }
  }

  private findPixel(style: 'height' | 'width') {
    let size = 0
    if (style === 'height') {

      this.element.childNodes.forEach(child => {
        const element = child as Element
        size += element.getBoundingClientRect().height
      })
    } else {
      this.element.childNodes.forEach(child => {
        const element = child as Element
        const width = element.getBoundingClientRect().width
        if (size < width) size = width
      })
    }
    return size
  }
}
