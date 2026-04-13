import { useState, useCallback, useRef, type DragEvent, type ChangeEvent, type ReactNode } from 'react'
import { Upload } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'

interface FileDropZoneProps {
  onFile: (file: File) => void
  accept?: string
  disabled?: boolean
  children?: ReactNode
}

export function FileDropZone({ onFile, accept = '.pdf,.csv,.json,.txt,.md,.tsv', disabled, children }: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile, disabled])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    if (!disabled) setDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    if (inputRef.current) inputRef.current.value = ''
  }, [onFile])

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); inputRef.current?.click() } }}
      style={{
        border: `2px dashed ${dragging ? W.violet : W.border2}`,
        borderRadius: W.radius.lg,
        padding: '32px 24px',
        textAlign: 'center',
        cursor: disabled ? 'default' : 'pointer',
        background: dragging ? `${W.violet}10` : W.glass02,
        transition: 'all 0.2s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {children ?? (
        <>
          <Upload size={24} style={{ color: W.text3, margin: '0 auto 8px' }} />
          <p style={{ fontSize: 12, color: W.text2, margin: 0 }}>
            Drop a file here or click to browse
          </p>
          <p style={{ fontSize: 10, color: W.text4, margin: '4px 0 0' }}>
            PDF, CSV, JSON, TXT, MD (max 10 MB)
          </p>
        </>
      )}
    </div>
  )
}
