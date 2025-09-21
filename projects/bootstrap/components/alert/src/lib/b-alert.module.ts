import { NgModule } from '@angular/core';
import { BAlertDirective } from './directives/b-alert.directive';
import { BAlertLinkDirective } from './directives/b-alert-link.directive';
import { BAlertHeaderDirective } from './directives/b-alert-header.directive';

const ALERT_DIRECTIVES = [BAlertDirective, BAlertLinkDirective, BAlertHeaderDirective];

@NgModule({
  imports: ALERT_DIRECTIVES,
  exports: ALERT_DIRECTIVES,
})
export class AlertMaterial {
}
