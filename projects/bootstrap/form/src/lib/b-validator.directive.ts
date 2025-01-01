import { booleanAttribute, computed, Directive, effect, Input, input, Optional } from '@angular/core';
import { BooleanAttribute } from '@pmeig/ng-material-core';
import { NoValidationCss } from './b-form.css';
import { FormControl, FormControlName } from '@angular/forms';
import { BTagDirective } from '@pmeig/ngb-core';
import { JsonPipe } from '@angular/common';
import { isBlank } from '@pmeig/ng-core';

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
  providers: [JsonPipe]
})
export class BValidatorDirective extends BTagDirective<
  Element & { setCustomValidity?: (message: string) => void }
> {
  invalid = input<string>('', { alias: 'error' });
  valid = input<string>('');
  formControl = input<FormControl>();
  private readonly control = computed(() => {
    if (this.formControlName) {
      return this.formControlName.control;
    } else if (this.formControl()) {
      return this.formControl();
    } else {
      return undefined;
    }
  })

  private state: ValidatorState = {
    decorator: true,
    classSuffixTemplate: '-feedback',
    messages: {}
  };
  private lastObserveChange?: string;
  private validate?: boolean;

  constructor(
    private json: JsonPipe,
    @Optional() private formControlName?: FormControlName
  ) {
    super(true);
    effect(() => this.checkMessage('invalid'));
    effect(() => this.checkMessage('valid'));
    effect(() => this.initValidityChange());
  }

  @Input('is-valid')
  set isValid(isValid: BooleanAttribute) {
    this.validate = booleanAttribute(isValid);
    if (this.validate) {
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

  protected override onInit() {
    this.insertStyle(NoValidationCss);
  }

  protected override afterViewInit(): void {
    this.refreshDecorator();
    this.refreshMessageType();
  }


  protected override onOverride() {
    this.removeMessage('invalid');
    this.removeMessage('valid');
  }

  protected override onRemove() {
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
        parent.className.includes(classname)
      )
    ) {
      this.renderer.appendChild(parent, div);
    } else {
      setTimeout(() =>
        this.renderer.insertBefore(
          this.element,
          div,
          this.renderer.nextSibling(this.element)
        )
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

  private putValidity(validity: string) {
    if (this.element.setCustomValidity)
      this.element.setCustomValidity(validity);
  }

  private observeValueChange(control: FormControl) {
    if (this.lastObserveChange) {
      this.clearSubscription(this.lastObserveChange)
    }
    this.lastObserveChange = this.addObservable(control.valueChanges, () => this.updateValidity(control));
  }

  private updateValidity(control: FormControl) {
    if (isBlank(this.validate)) {
      this.putValidity(control.invalid ? this.json.transform(control.errors) : '');
    }
  }

  private initValidityChange() {
    const control = this.control();
    if (control) {
      this.observeValueChange(control);
      this.updateValidity(control);
    }
  }
}
