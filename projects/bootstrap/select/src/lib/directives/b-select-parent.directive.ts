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


  readonly selection = input<T>()
  readonly selectionChange = output<T>();
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
    this.effect(() => this.selectOptions())
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
    if (!this.id()) throw new Error('id is required for select');
    this.putClass('form-select');
  }


  protected override afterViewInit() {
    super.afterViewInit();
    this.children((child, index) => {
      if (!child?.className?.split(' ')?.some(classname => classname === BSelectParentDirective.classnameChild)) {
        this.putClass(child, BSelectParentDirective.classnameChild);
        this.putAttribute(child, 'id', `${this.id()}-option-${index}`)
      }
    })
    this.selectOptions();
    this.lastValue = this.element.value
  }

  private onChange() {
    const numberSelected = this.element.selectedOptions.length;
    this.selectionChange.emit(this.mapper(this.getChildren().map((option, index) => {
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

  private selectOptions() {
    if (this.optionValues) {
      const selection = this.selection();
      let isSelected = (value: Item) => value === selection;
      if (Array.isArray(selection)) {
        isSelected = (value: Item) => selection.includes(value);
      }
      this.getChildren().forEach((option, index) => {
        if (isSelected(this.optionValues?.get(index)?.ngValue())) {
          const optionElement = option as HTMLOptionElement
          optionElement.selected = true
        }
      })
    }

  }
}
