import { Component, computed, input, output, PipeTransform, signal } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { BTagComponent } from '@pmeig/ngb-core';
import { Empty, numberAttribute, NumberAttribute } from '@pmeig/ng-material-core';

type Between = {previous: number, next: number};
type PaginationSize = 'sm' | 'lg';
type PaginationAlignment = 'center' | 'end';

@Component({
  selector: 'pagination',
  imports: [
    NgClass,
    NgTemplateOutlet
  ],
  templateUrl: './pagination.component.html',
  standalone: true,
  styleUrl: './pagination.component.scss'
})
export class PaginationMaterial extends BTagComponent {
  protected pages: {previous: number[], next: number[]} = {
    previous: [],
    next: []
  };
  protected currentPage = 0;

  total = input<number, NumberAttribute>(undefined,
    {transform: value => numberAttribute(value) ?? 0});
  size = input<Empty<`pagination-${PaginationSize}`>, PaginationSize>('',
    {transform: sizing => `pagination-${sizing}`})
  align = input<Empty<`justify-content-${PaginationAlignment}`>, PaginationAlignment>('',
    {transform: alignment => `justify-content-${alignment}`})

  disabled = input<number[], string | number | number[]>([], {
    alias: 'page-disabled',
    transform: disable => {
      if (typeof disable === 'string') {
        return disable.split(',').map(value => numberAttribute(value) ?? 0);
      }
      let disablePages: number[] = []
      if (typeof disable === 'number') {
        disablePages.push(disable);
      } else {
        disablePages = disable;
      }
      return disablePages;
    }
  })

  page = input<number>();
  pageChange = output<number>();

  config = input<{page: number, total: number}>({page: 1, total: 0});

  navigation = input<'icons' | PipeTransform | false, 'label' | 'icons' | false | 'false' | PipeTransform>('icons', {transform: value => {
    if (value === 'label') {
      return {transform(value: any): any {
          const label = value.slice(value.lastIndexOf('.') + 1)
          return label.charAt(0).toUpperCase() + label.slice(1);
        }
      }
    }
    if (value === 'false') {
      return false;
    }
    return value;
    }});

  between = input<Between, string | number | Between>({previous: 0, next: 0}, {transform: value => {
    if (['number', 'string'].includes(typeof value)) {
      value = numberAttribute(value as NumberAttribute)!;
      return {previous: value, next: value}
    } else {
      return value as Between;
    }
  }});

  protected load = signal(true);

  protected configuration = computed(() => {
    const configure = this.config();
    configure.page = this.page() ?? configure.page;
    configure.total = this.total() ?? configure.total;
    return configure;
  })

  constructor() {
    super();
    this.effect(() => {
      this.load.set(true);
      this.initLink('previous', this.configuration().total);
      this.prepareCellDot(this.between())
      this.load.set(false);
    })
    this.effect(() => {
      this.changePage(this.configuration().page);
    })
  }

  protected override onInit() {
    super.onInit();
    this.putClass('pagination');
  }

  protected changePage(page: number) {
    if (page > 0 && page <= this.configuration().total && this.currentPage !== page && !this.disabled().includes(page)) {
      while (this.pages.previous[0] > page) {
        this.pages.previous = this.pages.previous.map(page => page - 1);
      }
      const previous = this.between().previous;
      const lastPrevious = this.pages.previous[this.pages.previous.length - 1]
      const next = this.pages.next[0];
      if (page > lastPrevious && page < next) {
        while (this.currentPage !== page) {
          this.onDotClick();
        }
      } else {
        if (previous > 0 && next <= page && lastPrevious + 1 !== next) {
          this.initLink('previous', previous);
        }
        this.pageChange.emit(page);
        this.currentPage = page;
      }
    }
  }

  protected navigatorChange(accumulator: any) {
    let page = this.currentPage + accumulator;
    while (this.disabled().includes(page)) {
      page += accumulator;
    }
    this.changePage(page);
  }

  protected onDotClick() {
    let prev = this.pages.previous[this.pages.previous.length - 1];
    this.pages.previous = this.pages.previous.map(page => page + 1);
    while (this.disabled().includes(prev + 1)) {
      prev = this.pages.previous[this.pages.previous.length - 1];
      this.pages.previous = this.pages.previous.map(page => page + 1);
    }
    this.changePage(prev + 1);
  }

  private prepareCellDot(between: Between) {
    if (between.previous > 0) {
      this.initLink('previous', between.previous);
      this.initLink('next', between.next);
      const total = this.configuration().total;
      this.pages.next = this.pages.next.map(page => total - page + 1).reverse()
    }
  }

  private initLink(linked: 'previous' | 'next', total: number) {
    this.pages[linked] = [];
    while (total > 0) {
      this.pages[linked].unshift(total--);
    }
  }


}
