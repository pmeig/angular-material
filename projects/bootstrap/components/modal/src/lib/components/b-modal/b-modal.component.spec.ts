import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalMaterial } from './b-modal.component';

@Component({
  imports: [ModalMaterial],
  template: `
    <modal id="confirm" title="Delete?" [(show)]="shown"><p>Body</p></modal>
    <modal id="full" fullscreen [show]="true"><p>Full</p></modal>
    <modal id="full-md" fullscreen size="md" [show]="true"><p>Full below md</p></modal>
    <modal id="large" size="lg" [show]="true"><p>Large</p></modal>
    <modal id="flow" [show]="true">
      @if (flow()) {
        <p class="flow">Control flow</p>
      }
      <ng-template #body><p class="tpl">Template body</p></ng-template>
    </modal>
  `,
})
class ModalsComponent {
  readonly shown = signal(false);
  readonly flow = signal(true);
}

@Component({
  imports: [ModalMaterial],
  template: `
    <button id="opener" type="button" (click)="shown.set(true)">Open</button>
    <modal id="single" title="Delete?" [(show)]="shown"><p>Body</p></modal>
  `,
})
class SingleModalComponent {
  readonly shown = signal(false);
}

/** First render + 50 ms of TagComponent + the 170 ms animation of the modal. */
const settled = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve, 400));
  fixture.detectChanges();
  await fixture.whenStable();
};

describe('ModalMaterial', () => {
  let fixture: ComponentFixture<ModalsComponent>;
  const first = () => fixture.nativeElement.querySelector('modal#confirm .modal') as HTMLElement | null;
  const dialog = (modal: string) => fixture.nativeElement.querySelector(`modal#${modal} .modal-dialog`) as HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ModalsComponent);
    await settled(fixture);
  });

  it('opens from [show] with what Bootstrap JavaScript sets: role, aria-modal, labelled by its title, focused', async () => {
    fixture.componentInstance.shown.set(true);
    await settled(fixture);
    const modal = first()!;
    expect(modal.getAttribute('role')).toBe('dialog');
    expect(modal.getAttribute('aria-modal')).toBe('true');
    const title = document.getElementById(modal.getAttribute('aria-labelledby')!);
    expect(title?.textContent).toBe('Delete?');
    expect(document.activeElement).toBe(modal);
  });

  it('closes on Escape and gives false back to [(show)], so that it can be opened again', async () => {
    fixture.componentInstance.shown.set(true);
    await settled(fixture);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await settled(fixture);
    expect(fixture.componentInstance.shown()).toBeFalse();
    expect(first()).toBeNull();

    fixture.componentInstance.shown.set(true);
    await settled(fixture);
    expect(first()?.classList).toContain('show');
  });

  it('gives false back when the cross closes it', async () => {
    fixture.componentInstance.shown.set(true);
    await settled(fixture);
    (first()!.querySelector('button[close]') as HTMLButtonElement).click();
    await settled(fixture);
    expect(fixture.componentInstance.shown()).toBeFalse();
  });

  it('renders a control-flow block of its content once, and a #body template', async () => {
    await settled(fixture);
    const flow = fixture.nativeElement.querySelector('modal#flow') as HTMLElement;
    expect(flow.querySelectorAll('.flow').length).toBe(1);
    expect(flow.querySelectorAll('.tpl').length).toBe(1);
  });

  it('writes the Bootstrap size classes', async () => {
    // [show]="true" from the start: opened by an effect that a later change detection runs
    await settled(fixture);
    expect(dialog('full').classList).toContain('modal-fullscreen');
    expect(dialog('full-md').classList).toContain('modal-fullscreen-md-down');
    expect(dialog('large').classList).toContain('modal-lg');
  });
});

describe('ModalMaterial focus', () => {
  let fixture: ComponentFixture<SingleModalComponent>;
  const opener = () => fixture.nativeElement.querySelector('#opener') as HTMLButtonElement;
  const dialog = () => fixture.nativeElement.querySelector('modal#single .modal') as HTMLElement | null;
  const escape = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(SingleModalComponent);
    await settled(fixture);
    opener().focus();
    opener().click();
    await settled(fixture);
  });

  it('moves the focus into the modal, and gives it back to the button that opened it once it is closed', async () => {
    expect(document.activeElement).toBe(dialog());

    escape();
    await settled(fixture);
    expect(document.activeElement).toBe(opener());
  });

  it('leaves the focus where the user put it when it is closed', async () => {
    const other = document.createElement('input');
    document.body.appendChild(other);
    other.focus();

    escape();
    await settled(fixture);
    expect(document.activeElement).toBe(other);
    other.remove();
  });
});
