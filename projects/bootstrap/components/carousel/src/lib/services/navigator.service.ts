import { Injectable, Renderer2 } from '@angular/core';
import { putAttribute, putClass } from '@pmeig/ng-material-core';
import { AnimationExecutor } from '../animation.helper';


const BUTTON_LABELS = Object.freeze({
  prev: 'Previous',
  next: 'Next'
})

const HIDDEN_CLASS = 'visually-hidden'


@Injectable()
export class NavigatorService {

  constructor(private readonly renderer: Renderer2) {

  }

  createButton(direction: keyof typeof BUTTON_LABELS, id: string, switchSlide: AnimationExecutor) {
    const button = this.renderer.createElement('button') as HTMLButtonElement
    const control = `carousel-control-${direction}`
    putClass(button, this.renderer, [control])
    putAttribute(button, this.renderer, 'id', `${id}-button-${direction}`)
    putAttribute(button, this.renderer, 'type', 'button')
    putAttribute(button, this.renderer, 'aria-label', BUTTON_LABELS[direction])
    this.renderer.appendChild(button, this.createSpan(control))
    this.renderer.appendChild(button, this.createSpan())
    this.renderer.listen(button, 'click', () => switchSlide())
    return button;
  }

  private createSpan(control: string = HIDDEN_CLASS) {
    const span = this.renderer.createElement('span') as HTMLSpanElement;
    if (control !== HIDDEN_CLASS) {
      control = `${control}-icon`
      putAttribute(span, this.renderer, 'aria-hidden', 'true')
    }
    putClass(span, this.renderer, [control])
    return span;
  }
}
