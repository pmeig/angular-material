import { Renderer2 } from '@angular/core';
import { toSnakeKey } from './type.helper';
import { Optional } from '@pmeig/ng-core';
import { stylesCss } from './style.helper';


export type Item = Optional<Element>;
export type CssValue = Partial<Record<toSnakeKey<keyof CSSStyleDeclaration & string>, any>>;

export interface Css {
  name: string;
  value?: string | CssValue;
  children?: Css[];
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


export const putClass = (element: Item, renderer: Renderer2, classes: string[]) => {
  if (element) {
    const className = element.getAttribute('class')?.split(' ') ?? [];
    const action = element.nodeType === Node.COMMENT_NODE
      ? (value: string) => element.setAttribute('class', `${element.getAttribute('class')} ${value}`)
      : (value: string) => renderer.addClass(element, value);
    classes
      .filter((value) => className.length === 0 || !className.includes(value))
      .forEach((value) => action(value));
  }
};

export const removeClass = (element: Item, renderer: Renderer2, classes: string[]) => {
  if (element) {
    const className = element.getAttribute('class')?.split(' ') ?? [];
    const action = element.nodeType === Node.COMMENT_NODE
      ? (value: string) => element.setAttribute('class', (element.getAttribute('class')?.split(value) ?? []).map(cssClass => cssClass.trim()).join(' '))
      : (value: string) => renderer.removeClass(element, value);
    classes
      .filter((value) => className.includes(value))
      .forEach((value) => action(value));
  }
};

export const
  putStyle = (element: Item, renderer: Renderer2, styles: Record<string, string>) => {
    if (element) {
      if (element.nodeType === Node.COMMENT_NODE) {
        element.setAttribute('style', stylesCss(styles));
      } else {
        Object.entries(styles).forEach(([name, value]) => renderer.setStyle(element, name, value));
      }
    }
  };

export const removeStyle = (element: Item, renderer: Renderer2, cssStyles: string[]) => {
  if (element) {
    if (element.nodeType === Node.COMMENT_NODE) {
      const styles = element.getAttribute('style')?.split(';')?.map(style => style.split(':').map(part => part.trim()))
        .filter(([name]) => !cssStyles.includes(name))
        .reduce((accumulator, [name, value]) => ({ ...accumulator, [name]: value }), {});
      if (styles && Object.keys(styles).length > 0) {
        element.setAttribute('style', stylesCss(styles));
      } else {
        element.removeAttribute('style');
      }
    } else {
      cssStyles.forEach(value => renderer.removeStyle(element, value));
    }
  }
};

export const addAttribute = (element: Item, renderer: Renderer2, name: string, value?: any) => {
  if (element) {
    let attribute = element.getAttribute(name);
    if (!attribute) {
      attribute = '';
    } else {
      attribute = `${attribute} `;
    }
    putAttribute(element, renderer, name, `${attribute}${value ?? ''}`);
  }
};

export const putAttribute = (element: Item, renderer: Renderer2, name: string, value?: any) => {
  if (element) {
    let action = {
      put: () => renderer.setAttribute(element, name, value),
      remove: () => renderer.removeAttribute(element, name)
    };
    if (element.nodeType === Node.COMMENT_NODE) {
      action = {
        put: () => element.setAttribute(name, value.toString()),
        remove: () => element.removeAttribute(name)
      };
    }
    if (value) {
      action.put();
    } else {
      action.remove();
    }
  }
};

export const removeAttribute = (element: Item, renderer: Renderer2, names: string[]) => {
  if (element) {
    names.forEach(name => renderer.removeAttribute(element, name));
  }
};

export const cssValueToCssFormat = (value: string | CssValue | undefined) => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  const result = Object.entries(value).map(([key, value]) => `\t${key}:${value}`).join(';\n');
  return `${result};`;
};
export const cssToStyle = (css: string | Css): string => {
  if (typeof css === 'string') {
    return css;
  }
  const styles = cssValueToCssFormat(css.value);
  const subStyles = css.children?.map(child => cssToStyle({
    ...child,
    name: `${css.name}${child.name}`
  }))?.join('\n') ?? '';

  return `${css.name} {\n${styles}\n}\n\n${subStyles}`;
};

export function addStyleToHead(id: string, css: (string | Css)[], renderer: Renderer2, document: Document): void;
export function addStyleToHead(style: StyleElement, renderer: Renderer2, document: Document): void;
export function addStyleToHead(id: string | StyleElement, css: (string | Css)[] | Renderer2,
                               renderer: Renderer2 | Document, document?: Document) {
  if (typeof id === 'string') {
    addStyleToHead({ id, css: css as (string | Css)[] }, renderer as Renderer2, document as Document);
  } else if (!(renderer as Document)?.getElementById(id.id)) {
    const style = (css as Renderer2).createElement('style') as HTMLStyleElement;
    style.id = id.id;
    style.innerHTML = id.css.map(css => cssToStyle(css)).join('\n\n');
    putInHead(style, renderer as Document, css as Renderer2);
  }
}

export function addLinkToHead(id: string, link: Link, renderer: Renderer2, document: Document): void;
export function addLinkToHead(link: Link, renderer: Renderer2, document: Document): void;
export function addLinkToHead(id: Link | string, link: Renderer2 | Link,
                              renderer: Renderer2 | Document, document?: Document): void {
  if (typeof id === 'string') {
    link = link as Link;
    renderer = renderer as Renderer2;
    document = document as Document;
    link.id = id;
  } else {
    document = renderer as Document;
    renderer = link as Renderer2;
    link = id as Link;
  }
  if (!document.getElementById(link.id as string)) {
    const linkElement = renderer.createElement('link') as HTMLLinkElement;
    linkElement.id = link.id as string;
    linkElement.href = link.href;
    linkElement.rel = link.rel;
    if (link.type) {
      linkElement.type = link.type;
    }
    if (link.integrity) {
      linkElement.integrity = link.integrity;
    }
    if (link.crossorigin) {
      linkElement.crossOrigin = link.crossorigin;
    }
    putInHead(linkElement, document, renderer);
  }

}

const putInHead = (element: HTMLElement, document: Document, renderer: Renderer2) => {
  const head = document.getElementsByTagName('head').item(0) as HTMLHeadElement;
  renderer.appendChild(head, element);
};
