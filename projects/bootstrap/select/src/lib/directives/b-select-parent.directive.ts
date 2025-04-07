import { ContentChildren, Directive, HostListener, input, Input, output, QueryList } from '@angular/core';
import { BTagParentDirective } from '@pmeig/ngb-core';
import { Empty, emptyBooleanAttribute, EmptyBooleanAttribute } from '@pmeig/ng-material-core';
import { BOptionDirective } from './b-option.directive';

@Directive()
export class BSelectParentDirective<Item extends any, T extends Item | Item[] | undefined = Item | undefined> extends BTagParentDirective<HTMLSelectElement> {
  private static classnameChild = 'form-select-option';
  @ContentChildren(BOptionDirective, {descendants: true}) optionValues?: QueryList<BOptionDirective>;
  private _disabled = false;
  private lastValue = '';


  readonly selection = output<T>();
  readonly id = input<string>();

  @Input()
  set tall(value: Empty<'sm' | 'lg'>) {
    ['sm', 'lg'].forEach(value => this.removeClass('form-select-' + value));
    if (value) this.putClass(`form-select-${value}`);
  }

  @Input()
  set disabled(value: EmptyBooleanAttribute) {
    this._disabled = emptyBooleanAttribute(value);
  }

  protected constructor(private readonly mapper: (selection: Item[]) => T) {
    super();
  }

  @HostListener('change', ['$event'])
  protected onChangeSelection(event: Event) {
    if (this._disabled) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      this.element.value = this.lastValue;
    } else this.onChange();
  }

  protected override onInit() {
    super.onInit();
    this.lastValue = this.element.value
    if (!this.id()) throw new Error('id is required for select');
    this.putClass('form-select');
    this.onChange();
  }


  protected override onChange() {
    super.onChange();
    this.children((child, index) => {
      if (!child?.className?.split(' ')?.some(classname => classname === BSelectParentDirective.classnameChild)) {
        this.putClass(child, BSelectParentDirective.classnameChild);
        this.putAttribute(child, 'id', `${this.id()}-option-${index}`)
      }
    })
    const numberSelected = this.element.selectedOptions.length;
    this.selection.emit(this.mapper(this.getChildren().map((option, index) => {
      let indexSelected = numberSelected;
      let found = false;
      while (!found && indexSelected-- > 0) {
        found = this.element.selectedOptions.item(indexSelected)!!.id === option.id;
      }
      if (found) return index
      return -1;
    }).filter(index => index !== -1).map(index => this.optionValues?.get(index)?.ngValue())))
    this.lastValue = this.element.value

  }
}
