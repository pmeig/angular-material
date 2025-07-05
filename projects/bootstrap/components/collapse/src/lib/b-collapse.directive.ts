import { booleanAttribute, Directive, input, Input } from '@angular/core';
import { BooleanAttribute } from '@pmeig/ng-material-core';
import { BOOTSTRAP_ANIMATION_TIMEOUT, BTagTemplateDirective } from '@pmeig/ngb-core';

@Directive({
  selector: '[collapse]',
})
export class BCollapseDirective extends BTagTemplateDirective {
  private reset = () => {
  };
  private orchestrator: Element | undefined = undefined;

  readonly collapseAnimation = input<'vertical' | 'horizontal'>('vertical');

  @Input()
  set collapse(value: BooleanAttribute | Element) {
    this.reset();
    if (!['boolean', 'string'].includes(typeof value)) {
      this.orchestrator = value as Element;
      this.orchestrator.ariaExpanded = 'false';
      const resetListen = this.renderer.listen(this.orchestrator, 'click', () => {
        this.collapse = this.orchestrator!.classList.contains('collapsed');
      });
      this.reset = () => {
        resetListen();
        this.removeAttribute(this.orchestrator, 'aria-expanded');
      };
      setTimeout(() => this.collapse = this.orchestrator!.classList.contains('collapsed'));
    } else {
      value = booleanAttribute(value);
      if (value) {
        this.show();
      } else {
        this.close();
      }
    }
  }

  constructor() {
    super();
  }

  protected override onShow() {
    const style = this.getConfig();
    this.removeClass(this.orchestrator, 'collapsed');
    this.removeClass('collapse');
    this.putClass('collapsing');
    this.putStyle({ [style.style]: `${this.findPixel(style.style)}px` });
    if (this.orchestrator && this.element.id) {
      let controls = this.orchestrator.getAttribute('aria-controls');
      if (!controls) {
        controls = '';
      }
      if (controls.split(' ').every(value => value !== this.element.id)) {
        controls += ` ${this.element.id}`;
      }
      this.putAttribute(this.orchestrator, 'aria-controls', controls);
    }
    this.putAttribute(this.orchestrator, 'aria-expanded', 'true');


    this.addTimeout(() => {
      this.putClass('collapse', 'show');
      this.removeClass('collapsing');
    }, BOOTSTRAP_ANIMATION_TIMEOUT);
  }

  private close() {
    this.putClass(this.orchestrator, 'collapsed');
    this.removeClass('collapse', 'show');
    this.putClass('collapsing');
    this.removeStyle('height', 'width');
    this.putAttribute(this.orchestrator, 'aria-expanded', 'false');
    this.addTimeout(() => {
      this.hide();
    }, BOOTSTRAP_ANIMATION_TIMEOUT);
  }

  private getConfig(): { style: 'height' | 'width', start: 'Top' | 'Left', end: 'Bottom' | 'Right' } {
    this.removeClass('collapse-horizontal');
    if (this.collapseAnimation() === 'vertical') {
      return {
        style: 'height',
        start: 'Top',
        end: 'Bottom',
      };
    }
    this.putClass('collapse-horizontal');
    return {
      style: 'width',
      start: 'Left',
      end: 'Right',
    };
  }

  private findPixel(style: 'height' | 'width') {
    let size = 0;
    if (style === 'height') {

      this.element.childNodes.forEach(child => {
        const element = child as Element;
        if (element.textContent)
          size += 16;
        else
          size += element.getBoundingClientRect()?.height ?? 0;
      });
    } else {
      this.element.childNodes.forEach(child => {
        const element = child as Element;
        let width: number;
        if (element.textContent)
          width = size += element.textContent.length * 16;
        else
          width = element.getBoundingClientRect()?.width ?? 0;
        if (size < width) size = width;
      });
    }
    return size;
  }
}
