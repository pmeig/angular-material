import { booleanAttribute, Directive, input } from '@angular/core';
import {
  ColorAttribute,
  colorAttributeToString,
  Empty,
  emptyBooleanAttribute,
  EmptyBooleanAttribute,
  timeoutAttribute,
  TimeoutAttribute
} from '@pmeig/ng-material-core';
import { BOOTSTRAP_ANIMATION_TIMEOUT, BTagTemplateDirective } from '@pmeig/ngb-core';
import { Nullable, Timeout, TimeoutUnit } from '@pmeig/ng-core';
import { delay, of } from 'rxjs';

@Directive({
  selector: '[alert]',
})
export class BAlertDirective extends BTagTemplateDirective {

  private lastColor = 'alert-danger';
  private closeId?: string;

  alert = input<boolean, EmptyBooleanAttribute>(false, { transform: alert => alert === '' ? false : booleanAttribute(alert) });
  alertColor = input<string, Empty<ColorAttribute>>('alert-danger', { transform: color => colorAttributeToString(color || 'danger', 'alert') });
  alertClose = input<boolean, EmptyBooleanAttribute>(false, { transform: emptyBooleanAttribute});
  alertTimeout = input<Nullable<Timeout>, TimeoutAttribute>({
    value: 3,
    unit: TimeoutUnit.SECOND
  }, { transform: timeoutAttribute });

  constructor() {
    super();
    this.effect(this.refreshColor);
    this.effect(this.refreshDOMWithAlert);
  }

  protected override onShow() {
    this.putClass('alert', 'alert-dismissible', 'fade');
    this.refreshColor();
    setTimeout(() => {
      this.putClass('show')
    }, 250);
    if (this.alertClose() || !this.alertTimeout()) {
      this.addCloseButtonIfNotExist();
    }
    const timeout = this.alertTimeout();
    if (timeout) {
      this.closeId = this.addTimeout(() => {
        this.hide();
      }, timeout).id;
    }
  }


  protected override onHide() {
    this.removeClass('show');
    this.clearTimeout(this.closeId);
    return of(true).pipe(delay(BOOTSTRAP_ANIMATION_TIMEOUT))
  }


  private refreshDOMWithAlert() {
    if (this.alert()) {
      this.show();
    } else {
      this.hide();
    }
  }

  private refreshColor() {
    this.removeClass(this.lastColor);
    this.lastColor = this.alertColor();
    this.putClass(this.lastColor);
  }

  private addCloseButtonIfNotExist() {
    const lastChild = this.element.lastChild as unknown as Element;
    if (['btn-close', 'btn-close-white'].every(value => !lastChild?.classList?.contains(value))) {
      this.addCloseButtonIfNotExist = () => {
        const button = this.renderer.createElement('button') as HTMLButtonElement;
        this.putClass(button, 'btn-close');
        this.renderer.listen(button, 'click', () => this.hide());
        this.renderer.appendChild(this.element, button);
      };
      this.addCloseButtonIfNotExist();
    }
  }
}
