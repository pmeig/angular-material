import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BInputDirective } from './b-input.directive';

@Component({
  imports: [FormsModule, BInputDirective],
  template: `
    <input id="model" name="model" [ngModel]="model()" />
    <input id="zero" type="number" [value]="zero" />
    <input id="text" [value]="text()" />
    <input id="free" />
    <input id="readonly" readonly [value]="'kept'" />
    <input id="described" describe="Your name in this session" aria-describedby="mine" />
    <input [describe]="hint()" />
  `,
})
class InputsComponent {
  readonly model = signal('written by ngModel');
  readonly text = signal('first');
  readonly zero = 0;
  readonly hint = signal('First hint');
}

/** The directives work once the first render is over plus 50 ms (TagDirective). */
const rendered = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve, 100));
  fixture.detectChanges();
  await fixture.whenStable();
};

describe('BInputDirective', () => {
  let fixture: ComponentFixture<InputsComponent>;
  const input = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(InputsComponent);
    await rendered(fixture);
  });

  it('keeps the value written by ngModel when value is not bound', () => {
    expect(input('model').value).toBe('written by ngModel');
    expect(input('model').classList).toContain('form-control');
  });

  it('shows 0', () => {
    expect(input('zero').value).toBe('0');
  });

  it('follows the bound value', async () => {
    expect(input('text').value).toBe('first');
    fixture.componentInstance.text.set('second');
    await rendered(fixture);
    expect(input('text').value).toBe('second');
  });

  it('keeps what the user typed in a field without value nor ngModel', async () => {
    input('free').value = 'typed';
    input('free').dispatchEvent(new Event('input'));
    await rendered(fixture);
    expect(input('free').value).toBe('typed');
  });

  it('describes a field with its help text: the id of the text is in aria-describedby, after the one of the application', () => {
    const help = fixture.nativeElement.querySelector('#described-describe') as HTMLElement;
    expect(help.textContent).toBe('Your name in this session');
    expect(help.classList).toContain('form-text');
    expect(input('described').getAttribute('aria-describedby')).toBe('mine described-describe');
  });

  it('names the help text of a field without id, and replaces it when it changes', async () => {
    const nameless = () => fixture.nativeElement.querySelectorAll('input')[6] as HTMLInputElement;
    const helpOf = () => document.getElementById(nameless().getAttribute('aria-describedby') ?? '');
    expect(helpOf()?.textContent).toBe('First hint');
    fixture.componentInstance.hint.set('Second hint');
    await rendered(fixture);
    expect(helpOf()?.textContent).toBe('Second hint');
    expect(fixture.nativeElement.querySelectorAll('.form-text').length).toBe(2);
  });

  it('does not empty a readonly field on input', () => {
    input('readonly').dispatchEvent(new Event('input'));
    expect(input('readonly').value).toBe('kept');
  });
});
