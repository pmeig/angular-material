import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipMaterial } from './tooltip.directive';

@Component({
  imports: [TooltipMaterial],
  template: `<button id="trigger" aria-describedby="mine" tooltip="Saves the form" tooltip-id="saving-help">Save</button>`,
})
class TooltipComponent {}

/** First render + 50 ms of TagDirective. */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const rendered = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve, 150));
  fixture.detectChanges();
};

describe('TooltipMaterial', () => {
  let fixture: ComponentFixture<TooltipComponent>;
  const trigger = () => fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TooltipComponent);
    await rendered(fixture);
  });

  afterEach(() => document.querySelectorAll('[role=tooltip]').forEach((tooltip) => tooltip.remove()));

  it('describes its trigger while it is shown, next to what the application wrote', async () => {
    trigger().dispatchEvent(new MouseEvent('mouseenter'));
    const tooltip = document.getElementById('saving-help');
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
    expect(trigger().getAttribute('aria-describedby')).toBe('mine saving-help');

    trigger().dispatchEvent(new MouseEvent('mouseleave'));
    // the link goes at once, the element after its fade-out
    expect(trigger().getAttribute('aria-describedby')).toBe('mine');
    await wait(600);
    expect(document.getElementById('saving-help')).toBeNull();
  });

  it('is shown by the keyboard focus and hidden by Escape', async () => {
    trigger().dispatchEvent(new Event('focus'));
    expect(document.getElementById('saving-help')).not.toBeNull();

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(trigger().getAttribute('aria-describedby')).toBe('mine');
    await wait(600);
    expect(document.getElementById('saving-help')).toBeNull();
  });

  it('is hidden when the element loses the focus', async () => {
    trigger().dispatchEvent(new Event('focus'));
    trigger().dispatchEvent(new Event('blur'));
    expect(trigger().getAttribute('aria-describedby')).toBe('mine');
    await wait(600);
    expect(document.getElementById('saving-help')).toBeNull();
  });
});
