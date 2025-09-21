import { Size } from '@pmeig/ng-material-core';

export type OffCanvasPosition = 'start' | 'end' | 'top' | 'bottom';

export type OffCanvasPositionClass = `offcanvas-${OffCanvasPosition}`;

export type OffCanvasSize = Exclude<Size, 'xs' | 'xxs'>

export type OffCanvasResponsive = `offcanvas-${OffCanvasSize}` | 'offcanvas';
