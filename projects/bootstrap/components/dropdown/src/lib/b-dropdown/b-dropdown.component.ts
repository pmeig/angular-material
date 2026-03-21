import {
  Component,
  computed,
  ContentChildren,
  ElementRef,
  Host,
  HostListener,
  input,
  Optional,
  output,
  QueryList,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { BTagComponent } from '@pmeig/ngb-core';
import { AutoClose, createElementItem, ElementItem } from '../dropdown.model';
import {
  ColorAttribute,
  emptyBooleanAttribute,
  EmptyBooleanAttribute,
  InsideDirective,
  signalRecord,
  SizeAttribute
} from '@pmeig/ng-material-core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { DropdownLiDirective } from '../directives/dropdown-li.directive';
import { ButtonMaterial } from '@pmeig/ngb-button';
import { DropdownDirection, DropdownDirectionDirective } from '../directives/dropdown-direction.directive';

@Component({
  selector: 'dropdown',
  templateUrl: './b-dropdown.component.html',
  styleUrl: './b-dropdown.component.scss',
  imports: [
    NgClass,
    NgTemplateOutlet,
    InsideDirective,
    DropdownLiDirective,
    ButtonMaterial,
  ],
  standalone: true,
})
export class BDropdownComponent extends BTagComponent {
  protected selected = signal<ElementItem | undefined>(undefined);
  protected state = signalRecord({
    show: false,
    visible: false,
    content: {
      label: {
        value: '',
        mutable: true,
      },
    },
  });
  protected contents: ElementItem[] = [];
  @ContentChildren(TemplateRef) private templates!: QueryList<TemplateRef<any>>;
  @ViewChild('content') private templateContent!: TemplateRef<any>;
  @ViewChild('splitButton') protected splitButton?: ElementRef<HTMLButtonElement>;

  selection = output<ElementItem>();
  action = output<ElementItem>();
  readonly render = input<(item: ElementItem) => string>(item => this.defaultRenderLabel(item));
  readonly split = input<boolean, EmptyBooleanAttribute>(false, { transform: emptyBooleanAttribute });

  color = input<ColorAttribute>('primary');
  size = input<SizeAttribute>();

  direction = input<DropdownDirection>('down');

  autoClose = input<AutoClose>('outside');
  text = input<string>('');

  protected menuWidth = signal(0);
  protected label = computed(() => {
    if (this.state.content.label.mutable()) {
      const selected = this.selected();
      if (selected) {
        return this.render()(selected);
      }
      return '';
    }
    return this.state.content.label.value();
  });

  @HostListener('document:click', ['$event'])
  protected whenDocumentClick(event: MouseEvent) {
    if (this.state.visible()) {
      const isInside = this.element.contains(event.target as Node);
      if (this.autoClose() === 'both' ||
        (this.autoClose() === 'outside' && !isInside) ||
        (this.autoClose() === 'inside' && isInside)) {
        this.drop();
      }
    }
  }


  constructor(private readonly viewContentRef: ViewContainerRef,
              @Optional() @Host() protected readonly directionOptions?: DropdownDirectionDirective) {
    super();
    this.effect(() => {
      this.state.content.label.value.set(this.text());
      this.state.content.label.mutable.set(this.text() === '');
    })
  }


  protected override afterViewInit() {
    super.afterViewInit();
    this.initContent();
  }

  protected select(item: ElementItem) {
    this.selection.emit(item);
    this.selected.set(item);
    if (!this.split()) {
      this.action.emit(item);
    }
    this.drop();
  }

  protected drop() {
    if (this.state.show()) {
      this.state.show.set(false);
      setTimeout(() => this.state.visible.set(false));
    } else {
      this.state.visible.set(true);
      setTimeout(() => this.state.show.set(true));
    }
  }

  protected sendAction() {
    this.action.emit(this.selected()!);
  }

  protected dropMenuWidth(dropMenu: HTMLUListElement) {
    setTimeout(() => {
      this.menuWidth.set(dropMenu.getBoundingClientRect().width);
    });
    return this.menuWidth();
  }

  private defaultRenderLabel(item: ElementItem) {
    let label!: string;
    if (item.isTemplate) {
      const ref = this.viewContentRef.createEmbeddedView(item.template());
      label = this.getLabel(ref.rootNodes[0] as Element);
      ref.destroy();
    } else {
      label = this.getLabel(item.element() as Element);
    }
    return label;
  }

  private getLabel(element: Element) {
    if (this.renderer.parentNode(element)?.tagName === 'UL') {
      element = element.firstChild as Element;
    }
    return element.textContent ?? element.innerHTML;
  }

  private initContent() {
    let ref = this.viewContentRef.createEmbeddedView(this.templateContent);
    let indexTemplate = 0;
    ref.rootNodes.forEach((node: Node, index) => {
      this.contents.push(createElementItem(Node.COMMENT_NODE === node.nodeType
        ? this.templates.get(indexTemplate++)!
        : node as Element, index));
    });
    ref.destroy();
    this.selected.set(this.contents[0]);
  }
}
