import { Directive, input } from '@angular/core';
import { BTagParentDirective } from '@pmeig/ngb-core';
import { Empty, emptyBooleanAttribute, EmptyBooleanAttribute, Size } from '@pmeig/ng-material-core';

@Directive({
  selector: 'table, .table'
})
export class BTableDirective extends BTagParentDirective {

  striped = input<Empty<'table-striped' | 'table-striped-columns'>, Empty<'column'>>('', {transform: this.transformStriped.bind(this)});
  hover = input<boolean, EmptyBooleanAttribute>(true, {transform: emptyBooleanAttribute});
  border = input<boolean | undefined, EmptyBooleanAttribute>(undefined, {transform: emptyBooleanAttribute});
  small = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute});
  responsive = input<string, Empty<Omit<Size, 'xxs' | 'xs'>>>('table-responsive', {transform: responsive => `table-responsive${responsive === '' ? '' : `-${responsive}`}`});

  constructor() {
    super();
    this.effect(this.refreshStriped)
    this.effect(this.refreshHover);
    this.effect(this.refreshBorder)
    this.effect(this.refreshSmall);
    this.effect(this.refreshResponsive);
  }


  protected override onInit() {
    super.onInit();
    this.putClass('table');
  }

  private refreshStriped() {
    this.removeClass('table-striped-columns', 'table-striped');
    this.putClass(this.striped());
  }

  private transformStriped(striped?: Empty<'column' | 'row'>): Empty<'table-striped' | 'table-striped-columns'> {
    if (typeof striped === 'string') return `table-striped${striped === 'column' ? '-columns' : ''}`;
    return '';
  }

  private refreshHover() {
    this.removeClass('table-hover');
    if (this.hover()) this.putClass('table-hover');
  }

  private refreshBorder() {
    this.removeClass('table-borderless', 'table-bordered');
    const border = this.border();
    if (typeof border === 'boolean') this.putClass(border ? 'table-bordered' : 'table-borderless');
  }

  private refreshSmall() {
    this.removeClass('table-sm');
    if (this.small()) this.putClass('table-sm');
  }

  private refreshResponsive() {
    this.removeParent();
    const responsive = this.responsive();
    if (responsive !== '') {
      this.insertParent(responsive);
    }
  }
}
