import { Directive, Host, Optional } from '@angular/core';
import { BCardComponent } from '../b-card/b-card.component';
import { TagDirective } from '@pmeig/ng-material-core';

@Directive({
  selector: 'nav, .nav'
})
export class BCardTabDirective extends TagDirective {

  constructor(@Host() @Optional() private readonly card?: BCardComponent) {
    super();
  }


  protected override afterViewInit() {
    super.afterViewInit();
    if (this.card && this.renderer.parentNode(this.element).classList.contains('card-header')) {
      const suffix = this.element.classList.contains('nav-pills') ? 'pills' : 'tabs';
      this.putClass(`card-header-${suffix}`)
    }
  }
}
