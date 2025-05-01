import { booleanAttribute, Component, effect, input } from '@angular/core';
import { BTagComponent } from '@pmeig/ngb-core';
import { BooleanAttribute, putClass, removeClass, signalRecord } from '@pmeig/ng-material-core';
import { NgClass } from '@angular/common';
import { HasChildrenDirective } from '@pmeig/ng-core';

@Component({
  selector: 'b-card',
  templateUrl: './b-card.component.html',
  standalone: true,
  imports: [
    HasChildrenDirective,
    NgClass
  ],
  styleUrl: './b-card.component.scss'
})
export class BCardComponent extends BTagComponent {
  protected enabled = signalRecord({
    header: true,
    footer: true,
    body: true
  })

  overlay = input<BooleanAttribute, boolean>(false, {transform: booleanAttribute})

  constructor() {
    super()
    effect(() => {
      if (this.overlay()) {
        putClass(this.element, this.renderer, ['text-bg-dark'])
      } else removeClass(this.element, this.renderer, ['text-bg-dark'])
    })
  }


  protected override onInit() {
    super.onInit();
    putClass(this.element, this.renderer, ['card']);
  }
}
