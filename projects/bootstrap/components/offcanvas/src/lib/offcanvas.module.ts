import { NgModule } from '@angular/core';
import { OffcanvasComponent } from './offcanvas/offcanvas.component';

const OFFCANVAS_EXPORTS = [OffcanvasComponent];

@NgModule({
  imports: OFFCANVAS_EXPORTS,
  exports: OFFCANVAS_EXPORTS,
})
export class OffCanvasMaterial { }
