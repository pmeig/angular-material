import { booleanAttribute, Component, input, signal, ViewEncapsulation } from '@angular/core';
import { BProgressComponent } from '../b-progress/b-progress.component';
import { NgClass } from '@angular/common';
import { BooleanAttribute, ColorAttribute } from '@pmeig/ng-material-core';
import { BTagComponent } from '@pmeig/ngb-core';

@Component({
  selector: 'load-bar',
  imports: [
    BProgressComponent,
    NgClass
  ],
  templateUrl: './b-load-bar.component.html',
  styleUrl: './b-load-bar.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class BLoadBarComponent extends BTagComponent {
  round = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute});
  color = input<ColorAttribute>('primary');
  speed = input<number>(5);
  circle = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute});

  protected progress = signal<number>(0);

  constructor() {
    super();
  }


  protected override onInit() {
    super.onInit();
    this.putClass('progress-stacked');
    let ratio = .3
    this.addInterval(() => {
      this.progress.update(value => {
        if (value >= 300) {
          if (!this.circle()) {
            ratio *= -1;
            return value + ratio;
          }
          return -ratio;
        }
        if (value < 0) {
          ratio *= -1;
        }
        return value + ratio;
      })
    }, this.speed())
  }
}
