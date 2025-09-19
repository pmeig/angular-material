import { EmbeddedViewRef, Provider, Renderer2, TemplateRef } from '@angular/core';
import { getDocument, getWindow, putAttribute, putClass, putStyle, removeClass } from '@pmeig/ng-material-core';
import {
  PopoverFactory,
  TooltipBodyFactory,
  TooltipBuilderState,
  TooltipFactory,
  TooltipPlacement,
  TooltipRendered,
  TooltipRenderer
} from './tooltip.type';

const TooltipBodyClassname = Object.freeze({
  tooltip: 'tooltip-inner',
  popover: 'popover-body',
});

export const TooltipPlacementOtherwise = Object.freeze({
  top: 'bottom',
  bottom: 'top',
  start: 'end',
  end: 'start',
})

const TooltipContentPlacement = Object.freeze({
  layout: {
    top: (config: DOMRect, tooltip:DOMRect, arrow: DOMRect) => Object.freeze({
      top: config.y - tooltip.height - arrow.height / 2 - 3,
      left: config.x + config.width / 2 - tooltip.width / 2,
    }),
    bottom: (config: DOMRect, tooltip:DOMRect, arrow: DOMRect) => ({
      ...TooltipContentPlacement.layout.top(config, tooltip, arrow),
      top: config.y + config.height + arrow.height / 2 + 3,
    }),
    start: (config: DOMRect, tooltip:DOMRect, arrow: DOMRect) => ({
      top: config.y + config.height / 2 - tooltip.height / 2,
      left: config.x - tooltip.width - arrow.width / 2,
    }),
    end: (config: DOMRect, tooltip:DOMRect, arrow: DOMRect) => ({
      ...TooltipContentPlacement.layout.start(config, tooltip, arrow),
      left: config.x + config.width + arrow.width / 2,
    }),
  },
  arrow: {
    top: (_: DOMRect, tooltip:DOMRect, arrow: DOMRect) => ({
      left: tooltip.width / 2 - arrow.width / 2,
    }),
    bottom: (config: DOMRect, tooltip:DOMRect, arrow: DOMRect) => TooltipContentPlacement.arrow.top(config, tooltip, arrow),
    start: (config: DOMRect, tooltip:DOMRect, arrow: DOMRect) => ({
      ...TooltipContentPlacement.arrow.end(config, tooltip, arrow),
      right: -arrow.width/2,
    }),
    end: (_: DOMRect, tooltip:DOMRect, arrow: DOMRect) => ({
      top: tooltip.height / 2 - arrow.height / 2,
    }),
  }
})



class TooltipCreator extends TooltipRenderer implements TooltipBodyFactory<TooltipFactory | PopoverFactory>, TooltipRendered {
  tooltip: HTMLElement;
  currentPlacement: TooltipPlacement = 'top';

  private readonly viewContainerRef: EmbeddedViewRef<any>[] = [];
  private readonly ref: string = Math.random().toString(36).substring(2, 15);
  private state: TooltipBuilderState = {
    placement: 'top',
    id: '',
  }



  constructor(private readonly renderer: Renderer2,
              private readonly type: 'tooltip' | 'popover' = 'tooltip') {
    super();
    this.tooltip = this.renderer.createElement('div') as HTMLDivElement;
  }

  id(id: string = ''): TooltipFactory | PopoverFactory {
    return this.saveState('id', id);
  }


  body(template: TemplateRef<any> | string): TooltipFactory | PopoverFactory {
    if (!template) return this;
    return this.saveState('body', template);
  }

  create(type: 'tooltip'): TooltipFactory;
  create(type: 'popover'): PopoverFactory;
  create(type: 'tooltip' | 'popover'): TooltipFactory | PopoverFactory {
    return new TooltipCreator(this.renderer, type) as unknown as TooltipFactory | PopoverFactory;
  }

  placement(placement: TooltipPlacement = 'top'): TooltipFactory | PopoverFactory {
    return this.saveState('placement', placement);
  }

  otherwise(placement?: TooltipPlacement): TooltipFactory | PopoverFactory {
    return this.saveState('otherwise', placement) as unknown as TooltipFactory | PopoverFactory;
  }



  title(template?: TemplateRef<any> | string): PopoverFactory {
    if (this.type === 'tooltip') return this as unknown as PopoverFactory;
    return this.saveState('title', template) as unknown as PopoverFactory;
  }

  render(target: HTMLElement): TooltipRendered  {
    this.clearTooltipNotShowing();
    this.tooltip = this.createLayout(target.id);
    const arrow = this.createArrow();
    this.renderer.appendChild(this.tooltip, arrow);
    if (this.state.title) {
      this.renderer.appendChild(this.tooltip, this.createBodyOrTitle('h3', 'popover-header', this.state.title));
    }
    if (this.state.body) {
      this.renderer.appendChild(this.tooltip, this.createBodyOrTitle('div', TooltipBodyClassname[this.type], this.state.body));
    }
    this.renderer.appendChild(getDocument(target).body, this.tooltip);
    setTimeout(() => {
      this.placementTooltip(arrow, target);
    })
    return this;
  }



  destroy(): void {
    removeClass(this.tooltip, this.renderer, ['show'])
    setTimeout(() => {
      this.viewContainerRef.forEach(view => view.destroy());
      this.renderer.removeChild(this.renderer.parentNode(this.tooltip), this.tooltip);
    }, 200);
  }

  private clearTooltipNotShowing() {
    const tooltips = getDocument(this.tooltip).body.getElementsByClassName(`pmeig-${this.type}-${this.ref}`);
    for (let index = 0; index < tooltips.length; index++) {
      const tooltip = tooltips[index];
      if (!tooltip.classList.contains('show')) {
        this.renderer.removeChild(this.renderer.parentNode(tooltip), tooltip);
      }
    }
  }

  private createBodyOrTitle(tag: 'h3' | 'div', classname: 'popover-body' | 'tooltip-inner' | 'popover-header', template: TemplateRef<any> | string) {
    const content = this.renderer.createElement(tag) as HTMLHeadElement;
    putClass(content, this.renderer, [classname]);
    this.insertTemplate(content, template);
    return content;
  }


  private insertTemplate(element: HTMLElement, template: TemplateRef<any> | string) {
    if (template instanceof TemplateRef) {
      const viewContainerRef = template.createEmbeddedView(null);
      viewContainerRef.detectChanges();
      viewContainerRef.rootNodes.forEach(node => {
        this.renderer.appendChild(element, node);
      });
      this.viewContainerRef.push(viewContainerRef);
    } else element.innerHTML = template;
  }

  private saveState<Key extends keyof TooltipBuilderState>(key: Key, value: TooltipBuilderState[Key]): PopoverFactory | TooltipFactory {
    this.state[key] = value;
    return this as unknown as PopoverFactory | TooltipFactory;
  }

  private createLayout(id: string) {
    const tooltip = this.renderer.createElement('div') as HTMLDivElement;
    putClass(tooltip, this.renderer, [this.type, 'fade', 'show', 'position-absolute', 'm-0', 'opacity-0', `pmeig-${this.type}-${this.ref}`])
    putAttribute(tooltip, this.renderer, 'role', 'tooltip');
    if (!this.state.id) {
      this.state.id = id || Math.random().toString(36).substring(2, 15);
    }
    putAttribute(tooltip, this.renderer, 'id', this.state.id);
    return tooltip;
  }

  private createArrow() {
    const arrow = this.renderer.createElement('div') as HTMLDivElement;
    putClass(arrow, this.renderer, [`${this.type}-arrow`, 'position-absolute']);
    return arrow;
  }

  private getStylePlacement(key: keyof typeof TooltipContentPlacement,config: DOMRect, tooltip: DOMRect, arrow: DOMRect, placement: TooltipPlacement) {
    return Object.entries(TooltipContentPlacement[key][placement](config, tooltip, arrow)).reduce((acc, [key, value]) => {
      acc[key] = `${value}px`;
      return acc;
    }, {} as Record<string, string>);
  }

  private determinePlacement(config: DOMRect, tooltip: DOMRect, arrow: DOMRect, ...placements: TooltipPlacement[]): TooltipPlacement {
    const placementPossible = Object.keys(TooltipPlacementOtherwise) as TooltipPlacement[];
    if (placements.length === placementPossible.length) return this.state.placement;
    const placement = placements[0];
    const styles = TooltipContentPlacement.layout[placement](config, tooltip, arrow);
    const window = getWindow(this.tooltip);
    let invalid = (_: string, px: number) => px < 0;
    if (['bottom', 'end'].includes(placement)) {
      if (placement === 'bottom') {
        invalid = (direction: string, px: number) => direction === 'top' && px > window.innerHeight - tooltip.height;
      } else {
        invalid = (direction: string, px: number) => direction === 'left' && px > window.innerWidth - tooltip.width;
      }
    }
    if (Object.entries(styles).some(([direction, px]) => invalid(direction, px))) {
      if (this.state.otherwise && !placements.includes(this.state.otherwise)) {
        return this.determinePlacement(config, tooltip, arrow, this.state.otherwise, ...placements);
      }
      let otherwise: TooltipPlacement | undefined = TooltipPlacementOtherwise[placement];
      if (placements.includes(otherwise)) {
        otherwise = placementPossible.find(possible => !placements.includes(possible))
      }
      if (otherwise) {
        return this.determinePlacement(config, tooltip, arrow, otherwise, ...placements);
      }
      return this.state.placement;
    }
    return placement;
  }

  private placementTooltip(arrow: HTMLDivElement, target: HTMLElement) {
    const domRect = getScreenPosition(target);
    const tooltipConfig = this.tooltip.getBoundingClientRect();
    const arrowConfig = arrow.getBoundingClientRect();
    this.currentPlacement = this.determinePlacement(domRect, tooltipConfig, arrowConfig, this.state.placement);
    removeClass(this.tooltip, this.renderer, [`bs-${this.type}-top`, `bs-${this.type}-bottom`, `bs-${this.type}-start`, `bs-${this.type}-end`])
    putClass(this.tooltip, this.renderer, [`bs-${this.type}-${this.currentPlacement}`])
    putStyle(this.tooltip, this.renderer, this.getStylePlacement('layout', domRect, tooltipConfig, arrowConfig, this.currentPlacement));
    putStyle(arrow, this.renderer, this.getStylePlacement('arrow', domRect, tooltipConfig, arrowConfig, this.currentPlacement));
    removeClass(this.tooltip, this.renderer, ['opacity-0'])
  }
}

export const getScreenPosition = (element: Element) => {
  const rect = element.getBoundingClientRect();
  const scroll = getWindow(element);
  rect.x += scroll.scrollX;
  rect.y += scroll.scrollY;
  return rect;
}


export const providerTooltipRenderer = {
  provide: TooltipRenderer,
  deps: [Renderer2],
  useFactory: (renderer: Renderer2) => new TooltipCreator(renderer),
} as Provider;
