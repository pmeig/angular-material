import { Component, computed, ContentChildren, input, QueryList, TemplateRef } from '@angular/core';
import { HasChildrenDirective, Nullable } from '@pmeig/ng-core';
import { BTagComponent } from '@pmeig/ngb-core';
import {
  ColorAttribute,
  colorAttribute,
  ColorConfig,
  emptyBooleanAttribute,
  EmptyBooleanAttribute,
  signalRecord
} from '@pmeig/ng-material-core';
import { Observable } from 'rxjs';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'toast',
  imports: [
    HasChildrenDirective,
    NgTemplateOutlet,
    NgClass
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastMaterial extends BTagComponent {
  orchestrator = input<Element | Observable<any>>()
  show = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute})
  color = input<Nullable<ColorConfig>, ColorAttribute>(undefined,
    {transform: color  => colorAttribute(color, 'text-bg')})

  @ContentChildren('header') protected headers!: QueryList<TemplateRef<any>>;
  @ContentChildren(TemplateRef) private templates!: QueryList<TemplateRef<any>>;

  protected colorClass = computed(() => this.color()?.color ?? '')
  protected colorStyle = computed(() => this.color()?.rgb ?? this.color()?.color ? '' : this.color()?.style)
  protected get bodies() {
    return this.templates.filter(template => [...this.headers].every(header => header.elementRef.nativeElement !== template.elementRef.nativeElement))
  }

  protected state = signalRecord({
    display: {
      showing: false,
      show: false,
      layout: false,
    }
  })

  constructor() {
    super()
    this.effect(this.onShow);
  }

  showing() {
    if (!this.state.display.show()) {
      this.state.display.layout.set(true);
      this.state.display.showing.set(true);
      this.state.display.show.set(true);
      setTimeout(() => {
        this.state.display.showing.set(false);
      })
    }

  }

  hide() {
    if (this.state.display.show()) {
      this.state.display.showing.set(true);
      setTimeout(() => {
        this.state.display.show.set(false);
        this.state.display.layout.set(false);
      }, 150)
    }
  }

  private onShow() {
    if (this.show()) {
      this.showing();
    } else this.hide();
  }
}
