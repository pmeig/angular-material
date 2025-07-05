import { booleanAttribute, computed, Directive, effect, Host, Input, input, Optional } from '@angular/core';
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
  providers: [JsonPipe],
})
export class BValidatorDirective extends BTagDirective<
  Element & { setCustomValidity?: (message: string) => void }
> {

  private state: ValidatorState = {
    decorator: true,
    classSuffixTemplate: '-feedback',
    messages: {},
  };
  private lastObserveChange?: string;
  private validate?: boolean;

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
  });

  constructor(
    private json: JsonPipe,
    @Host() @Optional() private formControlName?: FormControlName,
  ) {
    super();
    effect(() => this.refresh(() => this.checkMessage('invalid')));
    effect(() => this.refresh(() => this.checkMessage('valid')));
    effect(() => this.refresh(() => this.initValidityChange()));
  }

  @Input('is-valid')
  set isValid(isValid: BooleanAttribute) {
    this.validate = booleanAttribute(isValid);
    this.refresh(this.refreshValidate);

  }

  @Input()
  set decorator(decorator: BooleanAttribute | '') {
    this.state.decorator =
      decorator === '' ? true : booleanAttribute(decorator);
    this.refresh(this.refreshDecorator);
  }

  @Input()
  set tooltip(tooltip: BooleanAttribute | '') {
    this.refresh(this.removeLastClass);
    this.state.classSuffixTemplate =
      tooltip === '' || booleanAttribute(tooltip) ? '-tooltip' : '-feedback';
    this.refresh(this.refreshMessageType);
  }

  protected override onInit() {
    this.insertStyle(NoValidationCss);
    this.refreshDecorator();
    this.refreshMessageType();
  }

  protected override afterViewInit(): void {
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

  private putValidity(validity: string) {
    if (this.element.setCustomValidity)
      this.element.setCustomValidity(validity);
  }

  private observeValueChange(control: FormControl) {
    if (this.lastObserveChange) {
      this.clearSubscription(this.lastObserveChange);
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

  private refreshValidate() {
    if (this.validate) {
      this.putValidity('');
    } else {
      this.putValidity('manual-invalid');
    }
  }

  private checkMessage(key: 'valid' | 'invalid') {
    const message = this[key]();
    if (message) {
      this.getOrCreateElement(key).innerHTML = message;
    } else if (this.state.messages[key]) {
      this.renderer.removeChild(this.renderer.parentNode(this.element), this.state.messages[key]);
    }
  }

  private getOrCreateElement(key: 'valid' | 'invalid'): Element {
    let element = this.state.messages[key];
    if (!element) {
      const classname = `${key}${this.state.classSuffixTemplate}`;
      element = this.renderer.createElement('div') as Element;
      element.id = `${this.element.id}-${key}`;
      this.putClass(element, classname);
      const parent = this.insertParent('form-field-validator');
      this.renderer.appendChild(parent, element);
      this.state.messages[key] = element;
    }
    return element as Element;
  }

  private removeLastClass(key?: 'valid' | 'invalid') {
    if (key) {
      const element = this.state.messages[key];
      if (element) {
        this.removeClass(element, `${key}${this.state.classSuffixTemplate}`);
      }
    } else {
      this.removeLastClass('valid');
      this.removeLastClass('invalid');
    }
  }
}
