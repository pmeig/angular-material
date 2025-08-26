import { Signal } from '@angular/core';

export interface Modal {
  reference: string;
  close: () => void;
  open: () => void;
  visible: Signal<boolean>;
}
