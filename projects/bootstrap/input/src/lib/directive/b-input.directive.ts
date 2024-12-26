import {
  booleanAttribute,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import {
  NgpDate,
  NgpDatePipe,
  NgpDateTime,
  NgpTime,
  Optional,
} from '@ngp/core';
import { BooleanAttribute, RGB, TagDirective } from '@ngp-material/core';
import { findMapper, InputMapper } from '../b-input.mapper';

export interface InputWeek {
  week?: number;
  year?: number;
  monday?: Date | NgpDate;
  sunday?: Date | NgpDate;
}

export type InputValue =
  | string
  | NgpDate
  | NgpTime
  | NgpDateTime
  | Date
  | undefined
  | number
  | boolean
  | InputWeek
  | RGB;

interface InputState {
  readonly: boolean;
  disabled: boolean;
}

@Directive({
  selector:
    'input:not([type=date]):not([type=datetime-local]):not([type=month]):not([type=week]):not([type=time])' +
    ':not([type=datetime]):not([type=datetime-local])',
  standalone: true,
  providers: [NgpDatePipe],
})
export class BInputDirective extends TagDirective<HTMLInputElement> {
  @Output() valueChange = new EventEmitter<Optional<InputValue>>();

  protected mapper: InputMapper = {
    input: (item) => {
      this.mapper = findMapper('ts-date', this.element, this.dateParser);
      return this.mapper.input(item);
    },
    value: () => {
      this.mapper = findMapper('ts-date', this.element, this.dateParser);
      return this.mapper.value();
    },
  };

  private state: InputState = {
    readonly: false,
    disabled: false,
  };

  @Input()
  set type(type: string) {
    this.element.type = type;
    this.refreshType();
  }

  @Input()
  set value(value: Optional<InputValue>) {
    if (value) {
      this.element.value = this.mapper.input(value);
    } else {
      this.element.value = '';
    }
  }

  @Input()
  set readonly(readonly: BooleanAttribute | '') {
    this.state.readonly = booleanAttribute(readonly);
    this.element.readOnly = this.state.readonly;
  }

  @Input()
  set disabled(disabled: BooleanAttribute | '') {
    this.state.disabled = booleanAttribute(disabled);
    this.element.disabled = this.state.disabled;
  }

  constructor(
    elementRef: ElementRef<HTMLInputElement>,
    renderer: Renderer2,
    protected dateParser: NgpDatePipe,
  ) {
    super(elementRef, renderer);
  }

  protected override onInit() {
    this.refreshType();
  }

  protected afterViewInit(): void {}

  @HostListener('input')
  private onValueChange() {
    if (!this.state.disabled && !this.state.readonly) {
      this.valueChange.emit(this.mapper.value());
    } else {
      this.element.value = '';
    }
  }

  @HostListener('keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent) {
    if (this.state.disabled || this.state.readonly) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  private refreshType() {
    switch (this.element.type) {
      case 'checkbox':
      case 'radio':
        this.removeClass('form-control', 'form-range');
        this.putClass('form-check-input');
        break;
      case 'range':
        this.removeClass('form-control', 'form-check-input');
        this.putClass('form-range');
        break;
      default:
        this.removeClass('form-check-input', 'form-range');
        this.putClass('form-control');
    }
  }
}
