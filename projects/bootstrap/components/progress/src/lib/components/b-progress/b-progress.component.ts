import { booleanAttribute, Component, computed, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  BooleanAttribute,
  colorAttribute,
  ColorAttribute,
  ColorConfig,
  emptyBooleanAttribute,
  EmptyBooleanAttribute
} from '@pmeig/ng-material-core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { BTagComponent } from '@pmeig/ngb-core';

@Component({
  selector: 'progressbar',
  imports: [
    NgClass
  ],
  templateUrl: './b-progress.component.html',
  styleUrl: './b-progress.component.scss',
  standalone: true,
})
export class BProgressComponent extends BTagComponent {
  private unsubscribeLastObservable = () => {};

  striped = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute});
  animated =  input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute});
  label = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute, alias: 'label-enabled'});
  observer = input<Observable<HttpEvent<any>> | number, Observable<HttpEvent<any>> | number | `${number}`>(0, {transform: value => {
    // noinspection SuspiciousTypeOfGuard
      if (typeof value === 'string') {
      return Number(value);
    }
    return value;
  }});
  color = input<ColorConfig, ColorAttribute>({style: ''}, {transform: color => colorAttribute(color, 'bg')});
  various= input<Record<`${number}`, ColorAttribute>>({})

  protected readonly Number = Number;

  protected progress = signal('');
  protected backgroundColor = computed(() => this.createBuilderColorByPercent(this.various()));
  protected progressForm = computed(() => {
    return {
      'progress-bar-striped': this.striped(),
      'progress-bar-animated': this.animated()
    }
  });

  constructor() {
    super();
    this.effect(this.observe);
    this.effect(() => this.putAttribute('aria-valuenow', this.progress().replace('%', '')))
  }


  protected override onInit() {
    super.onInit();
    this.putClass('progress');
    this.putAttribute('role', 'progressbar');
  }

  protected toWidth(textContent: string | null) {
    if (!textContent) return '0%';
    return textContent?.endsWith('%') ? textContent : `${textContent}%`;
  }

  private observe() {
    const observer = this.observer();
    if (typeof observer === 'number') {
      if (observer < 0 && this.progress() !== '0%') {
        this.progress.set('0%');
      } else if (observer > 100 && this.progress() !== '100%') {
        this.progress.set('100%');
      } else if (observer >= 0 && observer <= 100) {
        this.progress.set(`${observer}%`);
      }
    } else {
      this.unsubscribeLastObservable();
      const id = this.addObservable(observer, (event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.progress.set('0%');
            break;
          case HttpEventType.Response:
            if (event.status < 300 && event.status >= 200) {
              this.progress.set('100%');
            }
            break;
          case HttpEventType.UploadProgress:
          case HttpEventType.DownloadProgress:
            const progressEvent = event as unknown as ProgressEvent;
            const percent = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
            this.progress.set(`${percent}%`);

        }
      })
      if (id) {
        this.unsubscribeLastObservable = () => {
          this.clearSubscription(id)
          this.unsubscribeLastObservable = () => {};
        }
      }
    }
  }

  private createBuilderColorByPercent(value: Record<`${number}`, ColorAttribute>) {
    let founder = (_: number) => this.color();
    Object.entries(value).sort(entry => -Number(entry[0]))
      .forEach(([max, color]) => {
        const next = founder;
        const control = Number(max);
        founder = percent => {
          if (percent < control) {
            return colorAttribute(color, 'bg');
          }
          return next(percent);
        }
      })
    return founder;
  }
}
