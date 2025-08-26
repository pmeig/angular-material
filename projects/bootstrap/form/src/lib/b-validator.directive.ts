import { computed, Directive, Host, input, Optional } from '@angular/core';
import { EmptyBooleanAttribute, emptyBooleanAttribute } from '@pmeig/ng-material-core';
import { NoValidationCss } from './b-form.css';
import { FormControl, FormControlName } from '@angular/forms';
import { BTagDirective } from '@pmeig/ngb-core';
import { JsonPipe } from '@angular/common';
import { isBlank } from '@pmeig/ng-core';

interface ValidatorState {
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
    messages: {},
  };
  private lastObserveChange?: string;

  invalid = input<string>('', { alias: 'error' });
  valid = input<string>('');
  formControl = input<FormControl>();

  validate = input<boolean | undefined, EmptyBooleanAttribute>(undefined,
    {transform: emptyBooleanAttribute, alias: 'is-valid'});
  decorator = input<boolean, EmptyBooleanAttribute>(true, {transform: emptyBooleanAttribute});
  tooltip = input<'feedback' | 'tooltip', EmptyBooleanAttribute>('feedback',
    {transform: suffix => emptyBooleanAttribute(suffix) ? 'tooltip' : 'feedback'});

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
    this.effect(() => this.checkMessage('invalid'));
    this.effect(() =>  this.checkMessage('valid'));
    this.effect(this.initValidityChange);
    this.effect(this.refreshValidate);
    this.effect(this.refreshDecorator);
    this.effect(this.refreshTooltip);
  }

  protected override onInit() {
    this.insertStyle(NoValidationCss);
  }

  private refreshDecorator() {
    if (!this.decorator()) this.putClass('decorator-none');
  }

  private putValidity(validity: string) {
    if (this.element.setCustomValidity)
      this.element.setCustomValidity(validity);
  }

  private observeValueChange(control: FormControl) {
    if (this.lastObserveChange) {
      this.clearSubscription(this.lastObserveChange);
    }
    setTimeout(() => this.updateValidity(control), 100);
    this.lastObserveChange = this.addObservable(control.valueChanges, () => this.updateValidity(control));
  }

  private updateValidity(control: FormControl) {
    if (isBlank(this.validate())) {
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
    const validate = this.validate();
    if (validate || validate === undefined) {
      this.putValidity('');
    } else {
      this.putValidity('manual-invalid');
    }
  }

  private checkMessage(key: 'valid' | 'invalid') {
    const message = this[key]();
    if (message) {
      this.getOrCreateElement(key, message).innerHTML = message;
    } else if (this.state.messages[key]) {
      this.renderer.removeChild(this.renderer.parentNode(this.element), this.state.messages[key]);
    }
  }

  private getOrCreateElement(key: 'valid' | 'invalid', message: string): Element {
    let element = this.state.messages[key];
    if (!element) {
      const classname = `${key}-${this.tooltip()}`;
      element = this.renderer.createElement('div') as Element;
      element.id = `${this.element.id}-${key}`;
      this.putClass(element, classname);
      const parent = this.insertParent('form-field-validator');
      this.createMarginMessage(parent, key, message, element);
      this.renderer.appendChild(parent, element);
      this.state.messages[key] = element;
    }
    return element as Element;
  }

  private removeLastClass(key?: 'valid' | 'invalid') {
    if (key) {
      const element = this.state.messages[key];
      if (element) {
        this.removeClass(element, `${key}-feedback`, `${key}-tooltip`);
      }
    } else {
      this.removeLastClass('valid');
      this.removeLastClass('invalid');
    }
  }

  private createMarginMessage(parent: Element, key: 'valid' | 'invalid', message: string, element: Element) {
    const margin = this.renderer.createElement('div') as Element;
    margin.innerHTML = message;
    this.putClass(margin, 'opacity-0');
    this.renderer.appendChild(parent, margin);
    const currentHeight = margin.getBoundingClientRect().height;
    this.renderer.removeChild(parent, margin);
    if (this.element.getAttribute('error') && this.element.getAttribute('valid')) {
      this.putClass(margin, 'feedback-margin');
      this.setMaxHeight(parent, currentHeight, key, element, margin);
    } else {
      this.putClass(margin, `feedback-margin-${key}`);
      this.renderer.appendChild(parent, margin);
    }
  }

  private setMaxHeight(parent: Element, currentHeight: number, key: 'valid' | 'invalid', element: Element, margin: Element) {
    const otherMarginElement = parent.querySelector(`.feedback-margin`);
    const otherMargin = otherMarginElement?.getBoundingClientRect().height;
    if (!otherMargin) {
      this.putClass(margin, 'feedback-margin');
      this.renderer.appendChild(parent, margin);
    } else {
      if (otherMargin !== currentHeight) {
        const otherMessage = parent.querySelector(`${key === 'valid' ? 'invalid' : 'valid'}-feedback`);
        if (currentHeight > otherMargin) {
          const style = {height: `${currentHeight}px`};
          this.putStyle(otherMessage, style);
          otherMarginElement!.innerHTML = margin.innerHTML;
        } else {
          const style = {height: `${otherMargin}px`};
          this.putStyle(element, style);
        }
      }
    }
  }

  private refreshTooltip(key?: 'valid' | 'invalid') {
    if (key) {
      const classname = `${key}-${this.tooltip()}`
      this.removeLastClass(key);
      this.putClass(this.state.messages[key], classname);
    } else {
      this.refreshTooltip('valid');
      this.refreshTooltip('invalid');
    }
  }
}
