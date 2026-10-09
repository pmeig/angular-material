import { addDescribedBy, removeDescribedBy, uniqueId } from './aria.helper';

describe('aria helper', () => {
  let field: HTMLInputElement;

  beforeEach(() => {
    field = document.createElement('input');
  });

  it('adds an id to aria-describedby, once', () => {
    addDescribedBy(field, 'help');
    addDescribedBy(field, 'help');
    expect(field.getAttribute('aria-describedby')).toBe('help');
  });

  it('keeps the ids that were already there: an id written by the application, then the ones of the libraries', () => {
    field.setAttribute('aria-describedby', 'mine');
    addDescribedBy(field, 'help');
    addDescribedBy(field, 'error');
    expect(field.getAttribute('aria-describedby')).toBe('mine help error');
  });

  it('removes one id and keeps the others', () => {
    field.setAttribute('aria-describedby', 'mine help error');
    removeDescribedBy(field, 'help');
    expect(field.getAttribute('aria-describedby')).toBe('mine error');
  });

  it('removes the attribute with the last id, and ignores an id that is not there', () => {
    addDescribedBy(field, 'help');
    removeDescribedBy(field, 'other');
    expect(field.getAttribute('aria-describedby')).toBe('help');
    removeDescribedBy(field, 'help');
    expect(field.hasAttribute('aria-describedby')).toBeFalse();
  });

  it('gives a different id every time', () => {
    expect(uniqueId('ngb-describe')).not.toBe(uniqueId('ngb-describe'));
    expect(uniqueId('ngb-describe')).toMatch(/^ngb-describe-\d+$/);
  });
});
