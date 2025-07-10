import { Renderer2 } from '@angular/core';
import { putAttribute, putClass, putStyle, removeClass, removeStyle } from './css.helper';
import { styleToRecord } from './internal.helper';

export interface ParentExclude {
  classes?: string[];
  styles?: string[];
}


export type TagParent = keyof HTMLElementTagNameMap;

export const HTMLElementBuilder = {
  a: () => new HTMLAnchorElement(),
  abbr: () => new HTMLElement(),
  address: () => new HTMLElement(),
  area: () => new HTMLAreaElement(),
  article: () => new HTMLElement(),
  aside: () => new HTMLElement(),
  audio: () => new HTMLAudioElement(),
  b: () => new HTMLElement(),
  base: () => new HTMLBaseElement(),
  bdi: () => new HTMLElement(),
  bdo: () => new HTMLElement(),
  blockquote: () => new HTMLQuoteElement(),
  body: () => new HTMLBodyElement(),
  br: () => new HTMLBRElement(),
  button: () => new HTMLButtonElement(),
  canvas: () => new HTMLCanvasElement(),
  caption: () => new HTMLTableCaptionElement(),
  cite: () => new HTMLElement(),
  code: () => new HTMLElement(),
  col: () => new HTMLTableColElement(),
  colgroup: () => new HTMLTableColElement(),
  data: () => new HTMLDataElement(),
  datalist: () => new HTMLDataListElement(),
  dd: () => new HTMLElement(),
  del: () => new HTMLModElement(),
  details: () => new HTMLDetailsElement(),
  dfn: () => new HTMLElement(),
  dialog: () => new HTMLDialogElement(),
  div: () => new HTMLDivElement(),
  dl: () => new HTMLDListElement(),
  dt: () => new HTMLElement(),
  em: () => new HTMLElement(),
  embed: () => new HTMLEmbedElement(),
  fieldset: () => new HTMLFieldSetElement(),
  figcaption: () => new HTMLElement(),
  figure: () => new HTMLElement(),
  footer: () => new HTMLElement(),
  form: () => new HTMLFormElement(),
  h1: () => new HTMLHeadingElement(),
  h2: () => new HTMLHeadingElement(),
  h3: () => new HTMLHeadingElement(),
  h4: () => new HTMLHeadingElement(),
  h5: () => new HTMLHeadingElement(),
  h6: () => new HTMLHeadingElement(),
  head: () => new HTMLHeadElement(),
  header: () => new HTMLElement(),
  hgroup: () => new HTMLElement(),
  hr: () => new HTMLHRElement(),
  html: () => new HTMLHtmlElement(),
  i: () => new HTMLElement(),
  iframe: () => new HTMLIFrameElement(),
  img: () => new HTMLImageElement(),
  input: () => new HTMLInputElement(),
  ins: () => new HTMLModElement(),
  kbd: () => new HTMLElement(),
  label: () => new HTMLLabelElement(),
  legend: () => new HTMLLegendElement(),
  li: () => new HTMLLIElement(),
  link: () => new HTMLLinkElement(),
  main: () => new HTMLElement(),
  map: () => new HTMLMapElement(),
  mark: () => new HTMLElement(),
  menu: () => new HTMLMenuElement(),
  meta: () => new HTMLMetaElement(),
  meter: () => new HTMLMeterElement(),
  nav: () => new HTMLElement(),
  noscript: () => new HTMLElement(),
  object: () => new HTMLObjectElement(),
  ol: () => new HTMLOListElement(),
  optgroup: () => new HTMLOptGroupElement(),
  option: () => new HTMLOptionElement(),
  output: () => new HTMLOutputElement(),
  p: () => new HTMLParagraphElement(),
  picture: () => new HTMLPictureElement(),
  pre: () => new HTMLPreElement(),
  progress: () => new HTMLProgressElement(),
  q: () => new HTMLQuoteElement(),
  rp: () => new HTMLElement(),
  rt: () => new HTMLElement(),
  ruby: () => new HTMLElement(),
  s: () => new HTMLElement(),
  samp: () => new HTMLElement(),
  script: () => new HTMLScriptElement(),
  section: () => new HTMLElement(),
  search: () => new HTMLElement(),
  select: () => new HTMLSelectElement(),
  slot: () => new HTMLSlotElement(),
  small: () => new HTMLElement(),
  source: () => new HTMLSourceElement(),
  span: () => new HTMLSpanElement(),
  strong: () => new HTMLElement(),
  style: () => new HTMLStyleElement(),
  sub: () => new HTMLElement(),
  summary: () => new HTMLElement(),
  sup: () => new HTMLElement(),
  table: () => new HTMLTableElement(),
  tbody: () => new HTMLTableSectionElement(),
  td: () => new HTMLTableCellElement(),
  template: () => new HTMLTemplateElement(),
  textarea: () => new HTMLTextAreaElement(),
  tfoot: () => new HTMLTableSectionElement(),
  th: () => new HTMLTableCellElement(),
  thead: () => new HTMLTableSectionElement(),
  time: () => new HTMLTimeElement(),
  title: () => new HTMLTitleElement(),
  tr: () => new HTMLTableRowElement(),
  track: () => new HTMLTrackElement(),
  u: () => new HTMLElement(),
  ul: () => new HTMLUListElement(),
  var: () => new HTMLElement(),
  video: () => new HTMLVideoElement(),
  wbr: () => new HTMLElement(),
} as const;

export const isTag = (tag: string): tag is TagParent => {
  return tag in HTMLElementBuilder;
};


export const getDefaultClassname = (element: Element) => {
  const classname = [`pmeig-${element.tagName.toLowerCase()}`];
  const id = element.getAttribute('id');
  if (id) {
    classname.push(`${classname[0]}-${id}`);
  }
  return classname;
};

export const getIgnored = (element: Element, type: 'style' | 'class') => {
  const ignored = element.getAttribute(`${type}-ignore`);
  if (ignored) {
    return ignored.split(' ');
  }
  return [];
};

export const insertParent = (
  origin: Element,
  tag: TagParent,
  renderer: Renderer2,
  excludes: ParentExclude = {},
  styles: Record<string, string> = {},
  ...classes: string[]
) => {
  const parent = renderer.parentNode(origin) as Element;
  let element = renderer.createElement(tag) as HTMLElement;
  let created = true;
  const parentOf = parent.getAttribute('pmeig-parent');
  if (parentOf) {
    element = parent as HTMLElement;
    created = false;
  }
  excludes.styles = [...(excludes.styles || []), ...getIgnored(origin, 'style')];
  excludes.classes = [...(excludes.classes || []), ...getDefaultClassname(origin), ...getIgnored(origin, 'class')];

  origin.className.split(' ').filter(name => !excludes.classes!!.includes(name)).forEach(name => {
    putClass(element, renderer, [name]);
    removeClass(origin, renderer, [name]);
  });
  origin.getAttribute('style')?.split(';')?.map(style => style.trim().split(':').map(value => value.trim()))
    ?.filter(([name]) => !excludes.styles!!.includes(name))?.forEach(([name, value]) => {
    putStyle(element, renderer, { [name]: value });
    removeStyle(origin, renderer, [name]);
  });
  putClass(element, renderer, classes);
  putStyle(element, renderer, styles);
  if (created) {
    renderer.insertBefore(parent, element, origin);
    renderer.removeChild(parent, origin);
    renderer.appendChild(element, origin);
    putAttribute(element, renderer, 'pmeig-parent', origin.tagName);
  }
  return element;
};

export function removeParent(element: Element, renderer: Renderer2, attributes: { class: string, style: string },
                             styles: string[], ...classes: string[]): Element;
export function removeParent(element: Element, renderer: Renderer2,
                             attributes: { class: string, style: string },
                             ...classes: string[]): Element;
export function removeParent(element: Element, renderer: Renderer2, styles: string[], ...classes: string[]): Element;
export function removeParent(element: Element, renderer: Renderer2, ...classes: string[]): Element;
export function removeParent(element: Element, renderer: Renderer2,
                             attributes: { class: string, style: string } | string | string[],
                             styles: string | string[], ...classes: string[]) {
  const parent = renderer.parentNode(element) as Element;
  if (parent && parent.getAttribute('pmeig-parent')) {
    if (typeof attributes === 'string') {
      classes.push(...attributes.split(' '));
      attributes = {
        class: '',
        style: ''
      };
    } else if (Array.isArray(attributes)) {
      styles = attributes;
      attributes = {
        class: '',
        style: ''
      };
    }
    if (typeof styles === 'string') {
      classes.push(...styles.split(' '));
      styles = [];
    }
    removeClass(parent, renderer, classes);
    removeStyle(parent, renderer, styles);
    if (!parent.getAttribute('class') && !parent.getAttribute('style')) {
      const origin = renderer.parentNode(parent);
      while (parent.childElementCount) {
        const child = parent.children.item(0)!!;
        renderer.insertBefore(origin, child, parent);
      }
      renderer.removeChild(origin, parent);
      putClass(element, renderer, attributes.class.split(' '));
      putStyle(element, renderer, styleToRecord(attributes.style));
      return origin;
    }
  }
  return parent;
}
