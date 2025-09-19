import { TagDirective } from '@pmeig/ng-material-core';
import { Subject } from 'rxjs';

export const sharedDirectiveParent = new Subject<{child: Element, directive: TagDirective, index: number}>()

export const navParent = sharedDirectiveParent.asObservable()
