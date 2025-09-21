const getWindow = (element: Element): Window => getDocument(element).defaultView!!;
const getDocument = (element: Element): Document => element.ownerDocument;
const computedStyle = (element: Element): CSSStyleDeclaration => getWindow(element).getComputedStyle(element);

export { getWindow, getDocument, computedStyle };
