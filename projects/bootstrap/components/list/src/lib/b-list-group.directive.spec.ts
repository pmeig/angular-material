import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BListGroupDirective } from './b-list-group.directive';

@Component({
  imports: [BListGroupDirective],
  template: `
    <list-group flush background="info">
      @for (item of items(); track item) {
        <li>{{ item }}</li>
      }
    </list-group>
  `,
})
class ListComponent {
  readonly items = signal(['first']);
}

/** First render + 50 ms of TagDirective + the setTimeout of the children. */
const settled = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve, 300));
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve, 100));
};

describe('BListGroupDirective', () => {
  let fixture: ComponentFixture<ListComponent>;
  const items = () => [...fixture.nativeElement.querySelectorAll('list-group > li')] as HTMLElement[];

  beforeEach(async () => {
    fixture = TestBed.createComponent(ListComponent);
    await settled(fixture);
  });

  it('styles the items of the first render', () => {
    expect(fixture.nativeElement.querySelector('list-group').classList).toContain('list-group-flush');
    expect(items()[0].classList).toContain('list-group-item');
    expect(items()[0].classList).toContain('list-group-item-info');
  });

  it('styles the items added after the first render too', async () => {
    fixture.componentInstance.items.set(['first', 'second', 'third']);
    await settled(fixture);
    expect(items().length).toBe(3);
    items().forEach((item) => {
      expect(item.classList).toContain('list-group-item');
      expect(item.classList).toContain('list-group-item-info');
    });
  });
});
