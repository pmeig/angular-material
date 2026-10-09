import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BBtnDirective } from './b-btn.directive';

@Component({
  imports: [BBtnDirective],
  template: `
    <button id="default">Default</button>
    <button id="secondary" color="secondary">Secondary</button>
    <button id="outline" outline color="danger">Outline</button>
    <button id="link" color="link">Link</button>
    <button id="link-class" class="btn-link">Link</button>
    <button id="close" close aria-label="Close"></button>
    <button id="custom" color="#ff0000">Custom</button>
    <button id="ignored" pmeig-ignore class="nav-link">Tab</button>
  `,
})
class ButtonsComponent {}

/** The directives add their classes once the first render is over plus 50 ms (TagDirective). */
const rendered = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve, 100));
  fixture.detectChanges();
};

describe('BBtnDirective', () => {
  let fixture: ComponentFixture<ButtonsComponent>;
  const classes = (id: string) => (fixture.nativeElement.querySelector(`#${id}`) as HTMLElement).classList;

  beforeEach(async () => {
    document.getElementById('ngb-css')?.remove();
    fixture = TestBed.createComponent(ButtonsComponent);
    await rendered(fixture);
  });

  it('is a primary button when no color is given', () => {
    expect(classes('default')).toContain('btn');
    expect(classes('default')).toContain('btn-primary');
    expect(classes('default')).not.toContain('btn-btn-primary');
  });

  it('writes the class of the Bootstrap color, solid or outline', () => {
    expect(classes('secondary')).toContain('btn-secondary');
    expect(classes('secondary')).not.toContain('btn-primary');
    expect(classes('outline')).toContain('btn-outline-danger');
  });

  it('knows the Bootstrap link variant, given as color or kept from the class', () => {
    expect(classes('link')).toContain('btn-link');
    expect(classes('link')).not.toContain('btn-primary');
    expect(classes('link-class')).toContain('btn-link');
    expect(classes('link-class')).not.toContain('btn-primary');
  });

  it('gives a close button no color', () => {
    expect(classes('close')).toContain('btn-close');
    expect(classes('close')).not.toContain('btn');
    expect([...classes('close')].filter((name) => name.startsWith('btn-') && name !== 'btn-close')).toEqual([]);
  });

  it('paints a CSS color as background', () => {
    const button = fixture.nativeElement.querySelector('#custom') as HTMLElement;
    expect(button.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(classes('custom')).not.toContain('btn-primary');
  });

  it('leaves a pmeig-ignore button alone', () => {
    expect([...classes('ignored')]).toEqual(['nav-link']);
  });

  it('inserts the Bootstrap stylesheet like every other directive', () => {
    expect(document.getElementById('ngb-css')).not.toBeNull();
  });
});
