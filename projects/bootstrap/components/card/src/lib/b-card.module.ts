import { BCardTabDirective } from './directives/b-card-tab.directive';
import { BCardImgTopDirective } from './directives/b-card-img-top.directive';
import { BCardComponent } from './b-card/b-card.component';
import { NgModule } from '@angular/core';

const CARD_EXPORTS = [BCardComponent, BCardTabDirective, BCardImgTopDirective];

@NgModule({
  imports: CARD_EXPORTS,
  exports: CARD_EXPORTS
})
export class CardMaterial {}
