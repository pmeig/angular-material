import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { Link } from '@pmeig/ng-material-core';

export const bootstrapLink = {
  id: 'ngb-css',
  rel: 'stylesheet',
  integrity: 'sha384-DQvkBjpPgn7RC31MCQoOeC9TI2kdqa4+BSgNMNj8v77fdC77Kj5zpWFTJaaAoMbC',
  crossorigin: 'anonymous',
  href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.4/dist/css/bootstrap.min.css',
};

/**
 * Whether the directives add the Bootstrap stylesheet of the CDN (`bootstrapLink`) to `<head>`: `true` by default,
 * `false` when the application bundles Bootstrap itself (offline PWA, strict CSP, a theme that overrides Bootstrap).
 */
export const NGB_BOOTSTRAP_LINK = new InjectionToken<boolean>('NGB_BOOTSTRAP_LINK', {
  providedIn: 'root',
  factory: () => true,
});

/** `provideNgbBootstrapLink(false)` in the providers of the application: no Bootstrap from the CDN. */
export const provideNgbBootstrapLink = (enabled: boolean): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: NGB_BOOTSTRAP_LINK, useValue: enabled }]);

/** The links a directive inserts on init (injection context): the Bootstrap stylesheet unless it was turned off. */
export const injectBootstrapLinks = (): Link[] => (inject(NGB_BOOTSTRAP_LINK) ? [bootstrapLink] : []);
