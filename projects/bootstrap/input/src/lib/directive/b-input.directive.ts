import {
  Directive,
  EventEmitter,
  Host,
  HostListener,
  inject,
  Injectable,
  INJECTOR,
  input,
  Optional,
  Output,
  TemplateRef
} from '@angular/core';
import { NgpDate, NgpDatePipe, NgpDateTime, NgpTime, Nullable } from '@pmeig/ng-core';
import { emptyBooleanAttribute, EmptyBooleanAttribute, RGB } from '@pmeig/ng-material-core';
import { findMapper, InputMapper } from '../b-input.mapper';
import { BTagDirective } from '@pmeig/ngb-core';
import { FormControlName } from '@angular/forms';

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

@Injectable({ providedIn: 'root' })
@Directive({
  selector:
    'input:not([type=date]):not([type=datetime-local]):not([type=month]):not([type=week]):not([type=time])' +
    ':not([type=datetime]):not([type=datetime-local])',
  exportAs: 'input',
  providers: [NgpDatePipe],
})
export class BInputDirective extends BTagDirective<HTMLInputElement> {
  describe = input<string | TemplateRef<any>>();
  value = input<InputValue>();
  type = input<string>('text');
  readonly = input<boolean,EmptyBooleanAttribute>(false, { transform: emptyBooleanAttribute  });

  @Output() valueChange = new EventEmitter<Nullable<InputValue> | null>();

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

  private injector = inject(INJECTOR);
  private describeElement?: HTMLSpanElement;

  constructor(
    protected dateParser: NgpDatePipe,
    @Optional() @Host() private readonly formControl?: FormControlName
  ) {
    super();
    this.effect(this.renderDescribe);
    this.effect(this.refreshValue);
    this.effect(this.refreshType);
  }

  protected override onInit() {
    super.onInit();
    this.addAttribute('class-ignore', 'form-control form-check-input form-range');
  }

  protected override afterViewInit(): void {
    this.refreshType();
  }

  private renderDescribe() {
    const describe = this.describe();
    if (describe) {
      this.updateParent(false, `input-describe-${this.element.id}`);
      this.describeElement = undefined;
    }
    if (describe) {
      if (typeof describe === 'string') {
        this.describeElement = this.renderer.createElement('span');
        this.describeElement!!.innerHTML = describe;
      } else {
        this.describeElement = this.renderer.createElement('div');
        describe.createEmbeddedView({}, this.injector).rootNodes.forEach(node => this.renderer.appendChild(this.describeElement!, node));
      }
      const parent = this.insertParent(`input-describe-${this.element.id}`);
      this.putClass(this.describeElement, 'form-text');
      this.renderer.appendChild(parent, this.describeElement);
    }
  }

  private refreshType() {
    const type = this.type();
    this.element.type = type;
    this.removeParent();
    switch (type) {
      case 'checkbox':
      case 'radio':
        this.removeClass('form-control', 'form-range');
        if (!this.element.classList.contains('btn-check')) {
          this.insertParent('form-check');
          this.putClass('form-check-input');
        }
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

  private refreshValue() {
    const value = this.value();
    if (value) {
      this.element.value = this.mapper.input(value);
    } else {
      this.element.value = '';
    }
  }


  @HostListener('input')
  private onValueChange() {
    if (!this.formControl?.disabled && !this.readonly()) {
      this.valueChange.emit(this.mapper.value());
    } else {
      this.element.value = '';
    }
  }

  @HostListener('keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent) {
    if (this.formControl?.disabled || this.readonly()) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }
}
