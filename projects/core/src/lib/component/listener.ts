import { Component, OnDestroy } from '@angular/core';
import { EventHandler } from '../helper/event-handler';

@Component({ template: '' })
export abstract class Listener extends EventHandler implements OnDestroy {
  ngOnDestroy(): void {
    this.clearEvent();
  }
}
