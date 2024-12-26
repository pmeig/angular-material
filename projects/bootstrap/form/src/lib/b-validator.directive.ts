import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  Input,
  input,
  Optional,
  Renderer2,
} from '@angular/core';
import {BooleanAttribute, TagDirective} from '@ngp-material/core';
import {NoValidationCss} from './b-form.css';
import {FormControl, FormControlName, FormGroupDirective,} from '@angular/forms';

interface ValidatorState {
  decorator: boolean;
  classSuffixTemplate: string;
  messages: {
    invalid?: Element;
    valid?: Element;
  };
}

@Directive({
  selector: '[error], [valid], [decorator], [formControl], [formControlName]',
  standalone: true,
  providers: [FormGroupDirective],
})
export class BValidatorDirective extends TagDirective<
  Element & { setCustomValidity?: (message: string) => void }
> {
  private state: ValidatorState = {
    decorator: true,
    classSuffixTemplate: '-feedback',
    messages: {},
  };

  invalid = input<string>('', { alias: 'error' });
  valid = input<string>('');
  formControl = input<FormControl>();

  private readonly control = computed(() => {
    if (this.formControlName) {
      return (
        this.formControlDirective.getControl(this.formControlName) ??
        new FormControl()
      );
    }
    return this.formControl() ?? new FormControl();
  });

  @Input('is-valid')
  set isValid(isValid: BooleanAttribute) {
    const validate = booleanAttribute(isValid);
    if (validate) {
      this.putValidity('');
    } else {
      this.putValidity('manual-invalid');
    }
  }

  @Input()
  set decorator(decorator: BooleanAttribute | '') {
    this.state.decorator =
      decorator === '' ? true : booleanAttribute(decorator);
    this.refreshDecorator();
  }

  @Input()
  set tooltip(tooltip: BooleanAttribute | '') {
    this.removeMessage('invalid');
    this.removeMessage('valid');
    this.state.classSuffixTemplate =
      tooltip === '' || booleanAttribute(tooltip) ? '-tooltip' : '-feedback';
    this.refreshMessageType();
  }

  constructor(
    element: ElementRef<
      Element & { setCustomValidity?: (message: string) => void }
    >,
    renderer: Renderer2,
    private formControlDirective: FormGroupDirective,
    @Optional() private formControlName?: FormControlName,
  ) {
    super(element, renderer, true);
    effect(() => this.checkMessage('invalid'));
    effect(() => this.checkMessage('valid'));
    this.addObservable(this.control().valueChanges, () => {
      if (this.control().invalid) {
        this.element.ariaInvalid = 'true';
        this.putValidity(JSON.stringify(this.control().errors));
      } else {
        this.element.ariaInvalid = 'false';
        this.putValidity('');
      }
    });
  }

  protected override onInit() {
    super.onInit();
    this.insertStyle(NoValidationCss);
  }

  private refreshDecorator() {
    if (!this.state.decorator) this.putClass('decorator-none');
  }

  private refreshMessageType() {
    this.checkMessage('invalid');
    this.checkMessage('valid');
  }

  private checkMessage(id: 'valid' | 'invalid') {
    this.removeMessage(id);
    if (this[id]()) {
      this.insertMessage(id);
    }
  }

  private insertMessage(id: 'valid' | 'invalid') {
    if (this.state.messages[id]) return;
    const div = this.renderer.createElement('div') as HTMLDivElement;
    const classname = `${id}${this.state.classSuffixTemplate}`;
    div.innerHTML = this[id]();
    div.id = `${this.element.id}-${classname}`;
    this.state.messages[id] = div;
    this.putClass(div, classname);
    const parent = this.renderer.parentNode(this.element) as Element;
    if (
      ['form-check', 'form-floating'].find((classname) =>
        parent.className.includes(classname),
      )
    ) {
      this.renderer.appendChild(parent, div);
    } else {
      setTimeout(() =>
        this.renderer.insertBefore(
          this.element,
          div,
          this.renderer.nextSibling(this.element),
        ),
      );
    }
  }

  private removeMessage(id: 'valid' | 'invalid') {
    const element = this.state.messages[id];
    if (element) {
      this.renderer.removeChild(this.renderer.parentNode(element), element);
      this.state.messages[id] = undefined;
    }
  }

  protected afterViewInit(): void {
    this.refreshDecorator();
    this.refreshMessageType();
  }

  protected override onRemove() {}

  private putValidity(validity: string) {
    const setterValidity = this.element.setCustomValidity
      ? this.element.setCustomValidity.bind(this.element)
      : () => {};
    setterValidity(validity);
  }
}
