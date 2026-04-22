import { useEffect, useRef } from 'react'

export function usePopoverDismiss<T extends HTMLElement>({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const anchorRef = useRef<T | null>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!anchorRef.current?.contains(target)) onClose()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return anchorRef
}
