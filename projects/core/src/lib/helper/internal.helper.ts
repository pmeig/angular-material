import {Nullable} from "@ngp/core";

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
