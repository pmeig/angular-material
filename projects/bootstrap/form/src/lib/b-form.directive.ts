import { booleanAttribute, Directive, HostListener, input } from '@angular/core';
import { BTagDirective } from '@pmeig/ngb-core';
import { BooleanAttribute } from '@pmeig/ng-material-core';


@Directive({
  selector: 'form:not([formGroup]), [formGroup]',
  standalone: true,
})
export class BFormDirective extends BTagDirective<HTMLFormElement> {
  unvalidated = input<boolean>(false);
  statusHover = input<Element[] | boolean, Element[] | BooleanAttribute>(true, {transform: statusOnHover => {
    if (typeof statusOnHover === 'object') {
      return statusOnHover;
    }
    return booleanAttribute(statusOnHover);
    }, alias: 'status-hover'
  })

  private submitted = false;
  private unlistenStatusHover = () => {};

  constructor() {
    super();
    this.effect(() => {
      if (this.unvalidated()) this.removeClass('was-validated');
      else if (this.submitted) this.putClass('was-validated');
    });
    this.effect(this.listenHoverButtonSubmitted);
  }


  protected override afterViewInit() {
    super.afterViewInit();
    this.putClass('form-validation');
    setTimeout(() => {
      this.listenHoverButtonSubmitted();
    }, 100);
  }

  @HostListener('ngSubmit')
  protected onSubmit() {
    this.submitted = true;
    this.unlistenStatusHover();
    this.putClass('was-validated');
  }

  private isInside(mouse: number, element: { min: number; max: number }) {
    return mouse > element.min && mouse < element.max;
  }

  private toPositionRect(config: DOMRect) {
    return {
      x: {
        min: config.x,
        max: config.x + config.width,
      },
      y: {
        min: config.y,
        max: config.y + config.height,
      }
    }
  }

  private listenHoverButtonSubmitted() {
    this.unlistenStatusHover();
    this.unlistenStatusHover = () => {};
    if (!this.submitted) {
      let hoverElements = this.statusHover();
      if (hoverElements !== false) {
        if (!Array.isArray(hoverElements)) {
          hoverElements = [...this.element.querySelectorAll('button[type="submit"]')];
        }
        const control = this.checkIsHoverSubmittedFunction(hoverElements);
        const onMove = this.renderer.listen(this.element, 'mousemove', event => {
          if (control(event)) {
            this.putClass('was-validated');
          } else {
            this.removeClass('was-validated');
          }
        });
        const onLeave = this.renderer.listen(this.element, 'mouseleave', () => {
          this.removeClass('was-validated');
        });
        this.unlistenStatusHover = () => {
          onMove();
          onLeave();
        }
      }
    }
  }

  private checkIsHoverSubmittedFunction(hoverElements: Element[]) {
    return hoverElements.map(element => {
      const config = element.getBoundingClientRect();
      return this.toPositionRect(config)
    })
      .reduce((acc, config) => {
        const previous = acc;
        return (event: MouseEvent) => {
          if (previous(event)) return true;
          return this.isInside(event.x, config.x) && this.isInside(event.y, config.y);
        }
      }, (_: MouseEvent) => false)
  }
}
