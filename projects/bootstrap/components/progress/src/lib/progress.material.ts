import { NgModule } from '@angular/core';
import { BProgressComponent } from './components/b-progress/b-progress.component';
import { BLoadBarComponent } from './components/b-load-bar/b-load-bar.component';

const PROGRESS_EXPORTS = [BLoadBarComponent, BProgressComponent]

@NgModule({
  imports: PROGRESS_EXPORTS,
  exports: PROGRESS_EXPORTS
})
export class ProgressMaterial {}
