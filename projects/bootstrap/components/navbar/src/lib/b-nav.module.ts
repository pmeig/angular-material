import { NgModule } from '@angular/core';
import { BNavbarComponent } from './components/b-navbar/b-navbar.component';
import { BNavbarExternalComponent } from './components/b-navbar-external/b-navbar-external.component';
import { BNavADirective } from './directives/b-nav-a.directive';
import { BNavDirective } from './directives/b-nav.directive';
import { BNavOffcanvasOptionsDirective } from './directives/b-nav-offcanvas.options.directive';

const NAVBAR_EXPORTS = [BNavADirective, BNavDirective, BNavOffcanvasOptionsDirective, BNavbarComponent, BNavbarExternalComponent];

@NgModule({
  imports: NAVBAR_EXPORTS,
  exports: NAVBAR_EXPORTS
})
export class NavbarMaterial {
}
