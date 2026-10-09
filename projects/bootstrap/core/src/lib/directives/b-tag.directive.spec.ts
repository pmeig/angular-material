import { Component, Directive } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNgbBootstrapLink } from '../b-tag.constant';
import { BTagDirective } from './b-tag.directive';

@Directive({ selector: '[probe]' })
class ProbeDirective extends BTagDirective {
  constructor() {
    super();
  }
}

@Component({
  imports: [ProbeDirective],
  template: `<div probe></div>`,
})
class ProbeComponent {}

/** The directives work once the first render is over plus 50 ms (TagDirective). */
const rendered = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve, 100));
};

describe('BTagDirective', () => {
  beforeEach(() => document.getElementById('ngb-css')?.remove());

  it('adds the Bootstrap stylesheet of the CDN by default', async () => {
    await rendered(TestBed.createComponent(ProbeComponent));
    const link = document.getElementById('ngb-css') as HTMLLinkElement | null;
    expect(link?.href).toContain('cdn.jsdelivr.net/npm/bootstrap@5.3.4');
  });

  it('adds nothing when the application turned it off', async () => {
    TestBed.configureTestingModule({ providers: [provideNgbBootstrapLink(false)] });
    await rendered(TestBed.createComponent(ProbeComponent));
    expect(document.getElementById('ngb-css')).toBeNull();
  });
});
