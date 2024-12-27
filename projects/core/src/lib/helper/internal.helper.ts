import {Nullable} from '@pmeig/ng-core';

export const extractElementAndAddStyle = (element: Element | string | Record<string, string>,
                                          value: Nullable<string | Record<string, string>>,
                                          cssStyles: Record<string, string>): Nullable<Element> => {
  let item: Nullable<string | Record<string, string> | Element> = element
  if (!(item instanceof Element)) {
    if (typeof item === 'string') {
      cssStyles[item] = value as string
    } else {
      Object.entries(item).forEach(([key, value]) => cssStyles[key] = value)
    }
    item = undefined
  } else {
    Object.entries(value!!).forEach(([key, value]) => cssStyles[key] = value)
  }
  return item
}

export const styleToRecord = (style: string) => style.length > 0 ? style.split(';').reduce((acc, item) => {
  const [key, value] = item.split(':')
  acc[key.trim()] = value.trim()
  return acc
}, {} as Record<string, string>) : {}
