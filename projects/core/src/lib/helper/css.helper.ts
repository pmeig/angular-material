import { Renderer2 } from '@angular/core';
import { toSnakeKey } from './type.helper';


export type CssValue = Partial<Record<toSnakeKey<keyof CSSStyleDeclaration & string>, any>>;

export interface Css {
  name: string;
  value?: string | CssValue;
  children?: Css[]
}

export interface StyleElement {
  id: string;
  css: (string | Css)[];
}

export interface Link {
  href: string;
  rel: string;
  type?: string;
  id?: string;
  integrity?: string;
  crossorigin?: string;
}

export const cssValueToCssFormat = (value: string | CssValue | undefined) => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  const result = Object.entries(value).map(([key, value]) => `\t${key}:${value}`).join(';\n')
  return `${result};`;
};
export const cssToStyle = (css: string | Css): string => {
  if (typeof css === 'string') {
    return css
  }
  const styles = cssValueToCssFormat(css.value)
  const subStyles = css.children?.map(child => cssToStyle({
    ...child,
    name: `${css.name}${child.name}`
  }))?.join('\n') ?? ''

  return `${css.name} {\n${styles}\n}\n\n${subStyles}`
}

export function addStyleToHead(id: string, css: (string | Css)[], renderer: Renderer2, document: Document): void;
export function addStyleToHead(style: StyleElement, renderer: Renderer2, document: Document): void;
export function addStyleToHead(id: string | StyleElement, css: (string | Css)[] | Renderer2,
                               renderer: Renderer2 | Document, document?: Document){
  if (typeof id === 'string') {
    addStyleToHead({id, css: css as (string | Css)[]}, renderer as Renderer2, document as Document)
  } else if(!(renderer as Document)?.getElementById(id.id)) {
    const style = (css as Renderer2).createElement('style') as HTMLStyleElement
    style.id = id.id
    style.innerHTML = id.css.map(css => cssToStyle(css)).join('\n\n')
    putInHead(style, renderer as Document, css as Renderer2);
  }
}

export function addLinkToHead(id: string, link: Link, renderer: Renderer2, document: Document): void;
export function addLinkToHead(link: Link, renderer: Renderer2, document: Document): void;
export function addLinkToHead(id: Link | string, link: Renderer2 | Link,
                              renderer: Renderer2 | Document, document?: Document): void {
  if (typeof id === 'string') {
    link = link as Link
    renderer = renderer as Renderer2
    document = document as Document
    link.id = id
  } else {
    document = renderer as Document
    renderer = link as Renderer2
    link = id as Link
  }
  if (!document.getElementById(link.id as string)) {
    const linkElement = renderer.createElement('link') as HTMLLinkElement
    linkElement.id = link.id as string
    linkElement.href = link.href
    linkElement.rel = link.rel
    if (link.type) {
      linkElement.type = link.type
    }
    if (link.integrity) {
      linkElement.integrity = link.integrity
    }
    if (link.crossorigin) {
      linkElement.crossOrigin = link.crossorigin
    }
    putInHead(linkElement, document, renderer)
  }

}

const putInHead = (element: HTMLElement, document: Document, renderer: Renderer2) => {
  const head = document.getElementsByTagName('head').item(0) as HTMLHeadElement;
  renderer.appendChild(head, element);
}
