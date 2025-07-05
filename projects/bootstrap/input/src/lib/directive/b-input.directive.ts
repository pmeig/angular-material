import {
  booleanAttribute,
  Directive,
  EventEmitter,
  HostListener,
  inject,
  Injectable,
  INJECTOR,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { NgpDate, NgpDatePipe, NgpDateTime, NgpTime, Optional } from '@pmeig/ng-core';
import { BooleanAttribute, RGB } from '@pmeig/ng-material-core';
import { findMapper, InputMapper } from '../b-input.mapper';
import { BTagDirective } from '@pmeig/ngb-core';

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
  describe?: HTMLElement;
}

@Injectable({ providedIn: 'root' })
@Directive({
  selector:
    'input:not([type=date]):not([type=datetime-local]):not([type=month]):not([type=week]):not([type=time])' +
    ':not([type=datetime]):not([type=datetime-local])',
  exportAs: 'input',
  providers: [NgpDatePipe],
})
export class BInputDirective extends BTagDirective<HTMLInputElement> {
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

  private injector = inject(INJECTOR);
  private state: InputState = {
    readonly: false,
    disabled: false,
  };

  constructor(
    protected dateParser: NgpDatePipe,
  ) {
    super();
  }

  @Input()
  set type(type: string) {
    this.element.type = type;
    this.refresh(this.refreshType);
  }

  @Input()
  set describe(value: string | TemplateRef<any>) {
    this.refresh(() => {
      if (this.state.describe) {
        this.renderer.removeChild(this.removeParent(`input-describe-${this.element.id}`), this.state.describe);
        this.state.describe = undefined;
      }
      if (value) {
        if (typeof value === 'string') {
          this.state.describe = this.renderer.createElement('span');
          this.state.describe!!.innerHTML = value;
        } else {
          this.state.describe = this.renderer.createElement('div');
          value.createEmbeddedView({}, this.injector).rootNodes.forEach(node => this.renderer.appendChild(this.state.describe!, node));
        }
        if (this.ready) {
          this.refreshDescribe();
        }
      }
    });
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


  protected override onInit() {
    super.onInit();
    this.addAttribute('class-ignore', 'form-control form-check-input form-range');
  }

  protected override afterViewInit(): void {
    this.refreshType();
    this.refreshDescribe();
  }

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
    this.removeParent('form-check');
    switch (this.element.type) {
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

  private refreshDescribe() {
    if (this.state.describe) {
      const parent = this.insertParent(`input-describe-${this.element.id}`);
      this.putClass(this.state.describe, 'form-text');
      this.renderer.appendChild(parent, this.state.describe);
    }
  }
}
