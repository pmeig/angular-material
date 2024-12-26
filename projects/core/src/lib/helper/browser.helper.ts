export const getWindow = (element: Element): Window => getDocument(element).defaultView!!

export const getDocument = (element: Element): Document => element.ownerDocument
