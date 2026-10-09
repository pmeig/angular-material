import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonMaterial } from '@pmeig/ngb-button';
import { BListGroupDirective } from './b-list-group.directive';
import { ListGroupActionDirective } from './list-group-action.directive';

@Component({
  imports: [BListGroupDirective, ListGroupActionDirective, ButtonMaterial],
  template: `
    <list-group>
      <button id="action" type="button">Action</button>
      <div id="row">
        <button id="inner" type="button" color="danger">Delete</button>
      </div>
      <button id="ignored" type="button" pmeig-ignore class="mine">Mine</button>
    </list-group>
  `,
})
class ListActionsComponent {}

/** First render + 50 ms of TagDirective + the setTimeout of the actions. */
const settled = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve, 400));
  fixture.detectChanges();
};

describe('ListGroupActionDirective', () => {
  let fixture: ComponentFixture<ListActionsComponent>;
  const button = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ListActionsComponent);
    await settled(fixture);
  });

  it('makes a direct child button a list action that toggles active', () => {
    expect(button('action').classList).toContain('list-group-item-action');
    button('action').click();
    expect(button('action').classList).toContain('active');
  });

  it('leaves a button inside a row alone: it keeps its own classes and does not toggle active', () => {
    expect(button('inner').classList).not.toContain('list-group-item-action');
    expect(button('inner').classList).toContain('btn');
    button('inner').click();
    expect(button('inner').classList).not.toContain('active');
  });

  it('leaves a pmeig-ignore button alone', () => {
    expect(button('ignored').classList).not.toContain('list-group-item-action');
    button('ignored').click();
    expect(button('ignored').classList).not.toContain('active');
  });
});
