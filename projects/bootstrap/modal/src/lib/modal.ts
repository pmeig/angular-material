export interface Modal {
  name: string
  close: () => void
  open: () => void
  opened: boolean
}
