import { createContext, useContext, useRef, useCallback, type ReactNode } from 'react'

export interface CameraState {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
}

interface MapCameraContextValue {
  saveCamera: (state: CameraState) => void
  getCamera: () => CameraState | null
  clearCamera: () => void
}

const Ctx = createContext<MapCameraContextValue | null>(null)

export function MapCameraProvider({ children }: { children: ReactNode }) {
  const cameraRef = useRef<CameraState | null>(null)

  const saveCamera = useCallback((state: CameraState) => {
    cameraRef.current = state
  }, [])

  const getCamera = useCallback(() => cameraRef.current, [])

  const clearCamera = useCallback(() => {
    cameraRef.current = null
  }, [])

  return (
    <Ctx.Provider value={{ saveCamera, getCamera, clearCamera }}>
      {children}
    </Ctx.Provider>
  )
}

export function useMapCamera(): MapCameraContextValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useMapCamera must be used within MapCameraProvider')
  return ctx
}
