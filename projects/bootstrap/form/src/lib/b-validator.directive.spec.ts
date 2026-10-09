import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BValidatorDirective } from './b-validator.directive';

@Component({
  imports: [ReactiveFormsModule, BValidatorDirective],
  template: `
    <input id="email" [formControl]="email" error="Enter an e-mail." valid="Looks good." />
    <input id="forced" is-valid="false" error="Refused." />
    <input [formControl]="plain" error="Required." />
  `,
})
class FieldsComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly plain = new FormControl('', Validators.required);
}

/** First render + 50 ms of TagDirective, then the 100 ms of the validity of a control. */
const rendered = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve, 300));
  fixture.detectChanges();
  await new Promise((resolve) => setTimeout(resolve, 300));
  fixture.detectChanges();
};

describe('BValidatorDirective', () => {
  let fixture: ComponentFixture<FieldsComponent>;
  const input = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLInputElement;
  const describedBy = (selector: string) => input(selector).getAttribute('aria-describedby');

  beforeEach(async () => {
    fixture = TestBed.createComponent(FieldsComponent);
    await rendered(fixture);
  });

  it('does not announce an empty required field before the user went through it', () => {
    expect(input('#email').hasAttribute('aria-invalid')).toBeFalse();
    expect(describedBy('#email')).toBeNull();
  });

  it('announces the error and links its message once the user left the field', async () => {
    input('#email').dispatchEvent(new Event('blur'));
    expect(input('#email').getAttribute('aria-invalid')).toBe('true');
    expect(describedBy('#email')).toBe('email-invalid');
    expect(document.getElementById('email-invalid')?.textContent).toBe('Enter an e-mail.');
  });

  it('links the valid message instead of the error when the value becomes valid', async () => {
    input('#email').dispatchEvent(new Event('blur'));
    fixture.componentInstance.email.setValue('me@example.com');
    await rendered(fixture);
    expect(input('#email').hasAttribute('aria-invalid')).toBeFalse();
    expect(describedBy('#email')).toBe('email-valid');
  });

  it('announces a forced is-valid="false" at once', () => {
    expect(input('#forced').getAttribute('aria-invalid')).toBe('true');
    expect(describedBy('#forced')).toBe('forced-invalid');
  });

  it('names the messages of a field without id with an id of its own', async () => {
    const plain = fixture.nativeElement.querySelectorAll('input')[2] as HTMLInputElement;
    plain.dispatchEvent(new Event('blur'));
    const id = plain.getAttribute('aria-describedby')!;
    expect(id).toMatch(/^ngb-field-\d+-invalid$/);
    expect(document.getElementById(id)?.textContent).toBe('Required.');
  });
});
