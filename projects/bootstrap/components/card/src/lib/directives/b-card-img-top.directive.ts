import { Directive, Host, Optional } from '@angular/core';
import { BCardComponent } from '../b-card/b-card.component';
import { TagDirective } from '@pmeig/ng-material-core';

@Directive({
  selector: 'img[top]',
})
export class BCardImgTopDirective extends TagDirective {

  constructor(@Host() @Optional() private readonly card?: BCardComponent) {
    super();
  }


  protected override afterViewInit() {
    super.afterViewInit();
    if (this.card) {
      this.putClass('card-img-top');
    }
  }
}
