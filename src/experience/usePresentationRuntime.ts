import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createSceneUrl, getSceneIndex } from './routeModel'
import type { ExperienceManifest, PresentationRuntimeState } from './types'

interface UsePresentationRuntimeOptions {
  manifest: ExperienceManifest
  initialSceneId?: string
}

export function usePresentationRuntime({
  manifest,
  initialSceneId,
}: UsePresentationRuntimeOptions): PresentationRuntimeState {
  const location = useLocation()
  const navigate = useNavigate()

  const activeSceneIndex = useMemo(
    () => Math.max(getSceneIndex(manifest, initialSceneId), 0),
    [manifest, initialSceneId],
  )

  const goToIndex = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, manifest.scenes.length - 1))
      const nextScene = manifest.scenes[nextIndex]
      const nextUrl = createSceneUrl(manifest, nextScene.id, location.pathname)
      if (nextUrl !== `${location.pathname}${location.hash}`) {
        navigate(nextUrl, { replace: true })
      }
    },
    [location.hash, location.pathname, manifest, navigate],
  )

  const goToScene = useCallback(
    (sceneId: string) => {
      goToIndex(getSceneIndex(manifest, sceneId))
    },
    [goToIndex, manifest],
  )

  const nextScene = useCallback(() => {
    goToIndex(activeSceneIndex + 1)
  }, [activeSceneIndex, goToIndex])

  const previousScene = useCallback(() => {
    goToIndex(activeSceneIndex - 1)
  }, [activeSceneIndex, goToIndex])

  return useMemo(() => {
    const scene = manifest.scenes[Math.max(activeSceneIndex, 0)] ?? manifest.scenes[0]
    return {
      manifest,
      activeScene: scene,
      activeSceneIndex: Math.max(activeSceneIndex, 0),
      isFirstScene: activeSceneIndex <= 0,
      isLastScene: activeSceneIndex >= manifest.scenes.length - 1,
      goToScene,
      goToIndex,
      nextScene,
      previousScene,
    }
  }, [activeSceneIndex, goToIndex, goToScene, manifest, nextScene, previousScene])
}
