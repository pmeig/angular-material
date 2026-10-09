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

  /** A list action: a button or link that is a direct child of the list group and not marked `pmeig-ignore`. */
  private get isAction() {
    return !!this.listGroup && this.ignore() !== '' && this.element.parentElement?.tagName === 'LIST-GROUP';
  }

  @HostListener('click')
  protected whenClick( ) {
    if (this.isAction) {
      if (this.element.classList.contains('active')) {
        this.removeClass('active')
      } else  this.putClass('active')
    }
  }

  protected override afterViewInit() {
    if (this.isAction) {
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
