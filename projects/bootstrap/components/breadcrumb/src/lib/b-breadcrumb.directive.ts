import { Directive, HostListener, input, output } from '@angular/core';
import { BTagParentDirective } from '@pmeig/ngb-core';

@Directive({
  selector: '[breadcrumb]',
})
export class BBreadcrumbDirective extends BTagParentDirective {

  role = input<string>();
  ariaLabel = input<string>('breadcrumb');
  breadcrumb = input<string>();
  breadcrumbChange = output<string>();
  index = output<number>();
  divider = input<string>();
  id = input<string>();

  constructor() {
    super();
    this.effect(() => this.refreshDivider());
  }


  protected override onInit() {
    super.onInit();
    if (!this.id()) {
      throw new Error('Please set id for breadcrumb');
    }
    this.putClass('breadcrumb');
    this.putAttribute(this.renderer.parentNode(this.element), 'aria-label', this.role() || 'breadcrumb');
    const active = this.breadcrumb() || this.id() + '-0';
    this.getChildren().forEach((child, index) => {
      this.putClass(child, 'breadcrumb-item');
      let id = child.id;
      if (!id) {
        id = this.id() + '-' + index;
        child.id = id;
      }
      if (id === active) {
        this.putClass(child, 'active');
        this.putAttribute(child, 'aria-current', 'page');
      }
    });
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent) {
    this.getChildren().forEach((child, index) => {
      this.removeClass(child, 'active');
      this.removeAttribute(child, 'aria-current');
      if (child.id === (event.target as unknown as { id: string }).id) {
        this.putClass(child, 'active');
        this.breadcrumbChange.emit(child.id);
        this.index.emit(index);
      }
    });
  }

  refreshDivider() {
    const divider = this.divider();
    this.removeStyle(this.renderer.parentNode(this.element), '--bs-breadcrumb-divider');
    if (divider) {
      this.addAttribute(this.renderer.parentNode(this.element), 'style', `--bs-breadcrumb-divider: '${divider}';`);
    }
  }
}
