export interface Modal {
  id: () => string
  close: () => void
  open: () => void
  isOpened: () => boolean
}
