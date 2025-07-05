import { Renderer2 } from '@angular/core';
import { putAttribute, putClass, putStyle, removeClass, removeStyle } from './css.helper';
import { styleToRecord, tagParentName } from './internal.helper';

export interface ParentExclude {
  classes?: string[];
  styles?: string[];
}


export type TagParent = typeof tagParentName[number];

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
