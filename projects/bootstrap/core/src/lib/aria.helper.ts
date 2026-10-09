/** Ids already given by `uniqueId`: a counter per page, so that two components of a page never share an id. */
let counter = 0;

/** A new id for an element a component creates (`ngb-describe-1`), when the host element has none. */
export const uniqueId = (prefix: string): string => `${prefix}-${++counter}`;

const tokens = (element: Element, attribute: string): string[] =>
  (element.getAttribute(attribute) ?? '').split(/\s+/).filter(token => token !== '');

/**
 * Adds the id of an element that describes `element` (a help text, an error message, a tooltip) to its `aria-describedby`,
 * next to the ids already there: several components may describe the same field. Once, whatever the number of calls.
 */
export const addDescribedBy = (element: Element, id: string): void => {
  const current = tokens(element, 'aria-describedby');
  if (!current.includes(id)) {
    element.setAttribute('aria-describedby', [...current, id].join(' '));
  }
};

/** Removes an id from `aria-describedby`, and the attribute when it was the last one (an empty value is noise). */
export const removeDescribedBy = (element: Element, id: string): void => {
  const remaining = tokens(element, 'aria-describedby').filter(token => token !== id);
  if (remaining.length > 0) {
    element.setAttribute('aria-describedby', remaining.join(' '));
  } else {
    element.removeAttribute('aria-describedby');
  }
};
