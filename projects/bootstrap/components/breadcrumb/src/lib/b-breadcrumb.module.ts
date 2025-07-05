import { BBreadcrumbDirective } from './b-breadcrumb.directive';
import { NgModule } from '@angular/core';

const BREADCRUMB_MODULE = [BBreadcrumbDirective];

@NgModule({
  imports: BREADCRUMB_MODULE,
  exports: BREADCRUMB_MODULE
})
export class BreadcrumbMaterial {
}
