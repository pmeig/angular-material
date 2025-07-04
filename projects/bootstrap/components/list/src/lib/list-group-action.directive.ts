import { Directive, Host, HostListener, Optional } from '@angular/core';
import { TagDirective } from '@pmeig/ng-material-core';
import { BListGroupDirective } from './b-list-group.directive';

@Directive({
  selector: 'button, a'
})
export class ListGroupActionDirective extends TagDirective {

  constructor(@Host() @Optional() private readonly listGroup?: BListGroupDirective) {
    super();
  }

  @HostListener('click')
  private onClick( ) {
    if (this.element.classList.contains('active')) {
      this.removeClass('active')
    } else  this.putClass('active')
  }

  protected override afterViewInit() {
    if (this.listGroup) {
      this.putClass('list-group-item-action')
      setTimeout(() => {
        this.removeClass('btn')
        this.element.classList.forEach(value => {
          if (value.startsWith('btn-')) {
            this.removeClass(value)
          }
        })
      })
    }
    super.afterViewInit()
  }
}
