import { booleanAttribute, Directive, input } from '@angular/core';
import {
  BooleanAttribute,
  ColorAttribute,
  colorAttributeToString,
  Empty,
  timeoutAttribute,
  TimeoutAttribute,
} from '@pmeig/ng-material-core';
import { BOOTSTRAP_ANIMATION_TIMEOUT, BTagTemplateDirective } from '@pmeig/ngb-core';
import { Nullable, Timeout } from '@pmeig/ng-core';

@Directive({
  selector: '[alert]',
})
export class BAlertDirective extends BTagTemplateDirective {

  private lastColor = 'alert-danger';
  private closeId?: string;

  private addCloseButtonIfNotExist() {
    const lastChild = this.element.lastChild as Element;
    if (['btn-close', 'btn-close-white'].every(value => !lastChild.classList.contains(value))) {
      this.addCloseButtonIfNotExist = () => {
        const button = this.renderer.createElement('button') as HTMLButtonElement;
        this.putClass(button, 'btn-close');
        this.renderer.listen(button, 'click', () => this.hide());
        this.renderer.appendChild(this.element, button);
      };
      this.addCloseButtonIfNotExist();
    }
  }

  alertDisplayed = input((_: boolean) => {
  });
  alert = input<boolean, BooleanAttribute>(false, { transform: booleanAttribute });
  alertColor = input<string, Empty<ColorAttribute>>('alert-danger', { transform: color => colorAttributeToString(color || 'danger', 'alert') });
  alertManual = input<boolean, BooleanAttribute>(true, { transform: booleanAttribute });
  alertTimeout = input<Nullable<Timeout>, TimeoutAttribute>(undefined, { transform: timeoutAttribute });

  constructor() {
    super();
    this.effect(this.refreshColor);
    this.effect(this.show);
  }


  protected override onInit() {
    super.onInit();
    this.show();
  }


  protected override show(context?: any) {
    if (this.alert()) {
      super.show(context);
    } else {
      super.hide();
    }
  }

  protected override onShow() {
    this.refreshColor();
    this.putClass('alert', 'alert-dismissible', 'fade');
    setTimeout(() => this.putClass('show'));
    this.alertDisplayed()(true);
    if (this.alertManual()) {
      this.addCloseButtonIfNotExist();
    }
    const timeout = this.alertTimeout();
    if (timeout) {
      this.closeId = this.addTimeout(() => {
        this.hide();
      }, timeout).id;
    }
  }


  protected override hide() {
    this.removeClass('show');
    this.display = false;
    this.clearTimeout(this.closeId);
    setTimeout(() => {
      this.display = true;
      super.hide();
      this.alertDisplayed()(false);
    }, BOOTSTRAP_ANIMATION_TIMEOUT);
  }

  private refreshColor() {
    this.removeClass(this.lastColor);
    this.lastColor = this.alertColor();
    this.putClass(this.lastColor);
  }
}
