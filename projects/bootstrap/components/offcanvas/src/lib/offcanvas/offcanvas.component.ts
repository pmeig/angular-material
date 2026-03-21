import { booleanAttribute, Component, HostListener, input, output } from '@angular/core';
import { BTagComponent } from '@pmeig/ngb-core';
import {
  BooleanAttribute,
  Empty,
  emptyBooleanAttribute,
  EmptyBooleanAttribute,
  getDocument,
  signalRecord,
} from '@pmeig/ng-material-core';
import { OffCanvasPosition, OffCanvasPositionClass, OffCanvasResponsive, OffCanvasSize } from '../offcanvas.type';
import { HasChildrenDirective } from '@pmeig/ng-core';


@Component({
  selector: 'offcanvas',
  templateUrl: './offcanvas.component.html',
  imports: [
    HasChildrenDirective
  ],
  styleUrl: './offcanvas.component.scss'
})
export class OffcanvasMaterial extends BTagComponent {
  private orchestrator: (() => void) | undefined = undefined;

  scrollable = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute});
  backdrop = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute});
  static = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute});
  position = input<OffCanvasPositionClass, OffCanvasPosition>('offcanvas-start',
    { transform: property => `offcanvas-${property}` });
  responsive = input<OffCanvasResponsive, Empty<OffCanvasSize>>('offcanvas', {transform: property => {
    if (property.length === 0) return 'offcanvas';
    return `offcanvas-${property}` as OffCanvasResponsive;
    }});
  close = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute});
  show = input<boolean, BooleanAttribute | Element>(false, {transform: item => {
    if (this.orchestrator) {
      this.orchestrator();
      this.orchestrator = undefined;
    }
    if (typeof item !== 'object') {
      return booleanAttribute(item);
    }
    this.orchestrator = this.renderer.listen(item, 'click', () => {
      this.open(!this.state.show())
    })
    return false;
    }});
  showChange = output<boolean>();
  title = input<string>();


  protected state = signalRecord({
    show: false,
    animate: false,
    dom: false,
  })

  private body: HTMLElement | undefined;
  private backdropElement = this.createBackdrop();
  constructor() {
    super();
    this.effect(() => this.open(this.show()))
    // this.effect(() => this.animate(this.state.animate()))
    this.effect(this.insertBackdrop)
    this.effect(this.removeBackdrop)
    this.effect(this.refreshPosition);
    this.effect(this.refreshResponsive);

  }

  @HostListener('document:click', ['$event'])
  protected onClick(event: MouseEvent) {
    if (!this.backdrop() && !this.static() && this.state.show()) {
      const info = this.element.getBoundingClientRect();
      switch (this.position()) {
        case 'offcanvas-start': if (event.x > info.x) this.open(false); break;
        case 'offcanvas-end': if (event.x < info.x) this.open(false); break;
        case 'offcanvas-top': if (event.y > info.y) this.open(false); break;
        case 'offcanvas-bottom': if (event.y < info.y) this.open(false); break;
      }
    }
  }


  protected override afterViewInit() {
    super.afterViewInit();
    this.body = getDocument(this.element).body
    this.open(this.show())
  }

  protected open(show: boolean) {
    if (this.state.show() !== show) {
      if (show) {
        this.state.dom.set(show);
        if (!this.scrollable()) {
          this.putStyle(this.body ?? getDocument(this.element).body, {
            overflow: 'hidden',
            paddingRight: '15px'
          })
        }
        setTimeout(() => this.startAnimation(show));
      } else {
        this.startAnimation(show);
        this.removeStyle(this.body ?? getDocument(this.element).body, 'overflow', 'padding-right');
        setTimeout(() => this.state.dom.set(show), 350);
      }

    }
  }

  private startAnimation(show: boolean) {
    this.animate(true);
    setTimeout(() => {
      this.animate(false);
      this.showChange.emit(show);
    }, 300);
  }

  private createBackdrop() {
    const backdrop = this.renderer.createElement('div');
    this.putClass(backdrop, 'offcanvas-backdrop', 'fade', 'show');
    this.renderer.listen(backdrop, 'click', () => {this.open(this.static())})
    return backdrop as HTMLDivElement;
  }

  private insertBackdrop() {
    if (this.backdrop()) {
      const parent = this.renderer.parentNode(this.element);
      if (this.state.dom()) {
        this.renderer.insertBefore(parent, this.backdropElement, this.renderer.nextSibling(this.element));
      } else {
        this.renderer.removeChild(parent, this.backdropElement);
      }
    }
  }

  private removeBackdrop() {
    if (this.state.dom() && !this.backdrop()) {
      const parent = this.renderer.parentNode(this.element);
      if (parent.contains(this.backdropElement)) {
        this.renderer.removeChild(parent, this.backdropElement);
      }
    }
  }

  private animate(animate: boolean) {
    if (animate) {
      this.putClass(this.state.show() ? 'hiding' : 'showing')
    } else {
      const classes = ['hiding', 'showing']
      if (this.state.show()) {
        classes.push('show')
        this.state.show.set(false);
      } else {
        this.state.show.set(true);
        this.putClass('show');
      }
      this.removeClass(...classes)
    }
  }

  private refreshPosition() {
    this.removeClass(...['start', 'end', 'top', 'bottom'].map(value => `offcanvas-${value}`));
    this.putClass(this.position());
  }

  private refreshResponsive() {
    this.removeClass(...['sm' , 'md' , 'lg' , 'xl' , 'xxl'].map(value => `offcanvas-${value}`));
    this.putClass(this.responsive());
  }
}
