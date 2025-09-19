import { booleanAttribute, Directive, input } from '@angular/core';
import { BooleanAttribute } from '@pmeig/ng-material-core';
import { BOOTSTRAP_ANIMATION_TIMEOUT, BTagTemplateDirective } from '@pmeig/ngb-core';
import { delay, of } from 'rxjs';

@Directive({
  selector: '[collapse]'
})
export class CollapseMaterial extends BTagTemplateDirective {
  private reset = () => {
  };
  private orchestrator: Element | undefined = undefined;

  readonly collapseAnimation = input<'vertical' | 'horizontal'>('vertical');
  readonly collapse = input<boolean | Element, BooleanAttribute | Element>(false, { transform: value => {
    if (typeof value === 'object') {
      return value;
    }
    return booleanAttribute(value);
  } });

  constructor() {
    super();
    this.effect(this.refreshCollapse);
  }


  protected override onInit() {
    super.onInit();
    const collapsing = this.collapse();
    this.display = typeof collapsing !== 'boolean' || !collapsing;
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

  protected override onHide() {
    this.putClass(this.orchestrator, 'collapsed');
    this.removeClass('collapse', 'show');
    this.putClass('collapsing');
    this.removeStyle('height', 'width');
    this.putAttribute(this.orchestrator, 'aria-expanded', 'false');
    return of(true).pipe(delay(BOOTSTRAP_ANIMATION_TIMEOUT));
  }

  private refreshCollapse() {
    this.reset();
    const collapse = this.collapse();
    if (typeof collapse === 'boolean') {
      this.executeAnimation(collapse);
      this.reset = () => {};
    } else {
      this.orchestrator = collapse;
      this.orchestrator.ariaExpanded = 'false';
      const resetListen = this.renderer.listen(this.orchestrator, 'click', () => {
        this.executeAnimation(this.orchestrator!.classList.contains('collapsed'));
      });
      this.reset = () => {
        resetListen();
        this.removeAttribute(this.orchestrator, 'aria-expanded');
      };
      setTimeout(() => this.executeAnimation(this.orchestrator!.classList.contains('collapsed')));
    }
  }

  private executeAnimation(onShow: boolean) {
    if (onShow) {
      this.show();
    } else {
      this.hide();
    }
  }

  private getConfig(): { style: 'height' | 'width', start: 'Top' | 'Left', end: 'Bottom' | 'Right' } {
    this.removeClass('collapse-horizontal');
    if (this.collapseAnimation() === 'vertical') {
      return {
        style: 'height',
        start: 'Top',
        end: 'Bottom'
      };
    }
    this.putClass('collapse-horizontal');
    return {
      style: 'width',
      start: 'Left',
      end: 'Right'
    };
  }

  private findPixel(style: 'height' | 'width') {
    let size = 0;
    if (style === 'height') {
      this.element.childNodes.forEach(child => {
        const element = child as Element;
        if (element instanceof HTMLElement)
          size += element.getBoundingClientRect()?.height ?? 0;
      });
    } else {
      this.element.childNodes.forEach(child => {
        const element = child as Element;
        if (element instanceof HTMLElement)
          size = element.getBoundingClientRect()?.width ?? 0;
      });
    }
    return size;
  }
}
