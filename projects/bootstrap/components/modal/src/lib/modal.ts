export interface Modal {
  reference: string;
  close: () => void;
  open: () => void;
  visible: boolean;
}
