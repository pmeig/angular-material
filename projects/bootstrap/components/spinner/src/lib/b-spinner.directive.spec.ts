import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerMaterial } from './b-spinner.directive';

@Component({
  imports: [SpinnerMaterial],
  template: `
    <spinner id="primary" color="primary" size="sm"></spinner>
    <spinner id="custom" color="#ff0000"></spinner>
  `,
})
class SpinnersComponent {}

/** The directives work once the first render is over plus 50 ms (TagDirective). */
const rendered = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve, 100));
  fixture.detectChanges();
};

describe('SpinnerMaterial', () => {
  let fixture: ComponentFixture<SpinnersComponent>;
  const spinner = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(SpinnersComponent);
    await rendered(fixture);
  });

  it('writes the Bootstrap classes of shape, size and color', () => {
    expect(spinner('primary').classList).toContain('spinner-border');
    expect(spinner('primary').classList).toContain('spinner-border-sm');
    expect(spinner('primary').classList).toContain('text-primary');
  });

  it('paints a CSS color', () => {
    expect(spinner('custom').style.color).toBe('rgb(255, 0, 0)');
  });
});
