import { Renderer2 } from '@angular/core';
import { putAttribute, putClass, putStyle, removeClass, removeStyle } from './css.helper';
import { styleToRecord } from './internal.helper';

export interface ParentExclude {
  classes?: string[];
  styles?: string[];
}

export interface InsertParent {
  parent: Element;
  id: string;
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

export const createParent = (origin: Element, tag: TagParent, renderer: Renderer2, id?: string) => {
  const parent = renderer.parentNode(origin) as Element;
  let newParent = parent;
  if (!newParent.getAttribute('pmeig-parent')) {
    newParent = renderer.createElement(tag) as HTMLElement;
    putAttribute(newParent, renderer, 'pmeig-parent', origin.tagName);
    renderer.insertBefore(parent, newParent, origin);
    renderer.removeChild(parent, origin);
    renderer.appendChild(newParent, origin);
  }
  id = id || origin.id || Math.random().toString(36).substring(2, 15);
  putAttribute(newParent, renderer, `pmeig-parent-by-${id}`, id);
  return {
    parent: newParent,
    id
  };
}

export const insertParent = (
  origin: Element,
  tag: TagParent,
  renderer: Renderer2,
  excludes: ParentExclude = {
    classes: origin.className.split(' '),
    styles: Object.keys(styleToRecord(origin.getAttribute('style') ?? '')),
  },
  styles: Record<string, string> = {},
  ...classes: string[]
) => {
  const parent = createParent(origin, tag, renderer);
  const classesAdded = origin.className.split(' ').filter(classname => !excludes.classes?.includes(classname));
  putClass(parent.parent, renderer, classesAdded.concat(classes));
  removeClass(origin, renderer, classesAdded);
  const stylesAdded = Object.entries(styleToRecord(origin.getAttribute('style') ?? ''))
    .filter(([name]) => !excludes.styles?.includes(name)).reduce((acc, [name, value]) => {
      acc[name] = value;
      return acc;
    }, styles);
  putStyle(parent.parent, renderer, stylesAdded);
  removeStyle(origin, renderer, Object.keys(stylesAdded));
  return parent;
}

export const removeParent = (origin: Element, renderer: Renderer2, id: string) => {
  const parent = renderer.parentNode(origin) as Element;
  if (parent?.getAttribute('pmeig-parent')) {
    const parentBy = parent.getAttribute(`pmeig-parent-by-${id}`);
    let attemptParentBy = 0;
    if (parentBy && parent.getAttributeNames().some(name => {
      if (name.startsWith('pmeig-parent-by-')) {
        attemptParentBy++;
      }
      return attemptParentBy < 2;
    })) {
      const newParent = renderer.parentNode(parent) as Element;
      renderer.insertBefore(newParent, origin, parent);
      renderer.removeChild(newParent, parent);
      return newParent;
    }
  }
  return parent;
}
