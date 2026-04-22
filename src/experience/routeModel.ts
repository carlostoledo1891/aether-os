import type { ExperienceManifest } from './types'

export interface ResolvedExperienceRoute {
  manifestId: string
  initialSceneId?: string
}

export function getSceneIndex(manifest: ExperienceManifest, sceneId?: string | null) {
  const requestedId = sceneId?.trim()
  const index = manifest.scenes.findIndex(scene => scene.id === requestedId)
  return index >= 0 ? index : manifest.scenes.findIndex(scene => scene.id === manifest.defaultSceneId)
}

export function getSceneForPath(manifest: ExperienceManifest, pathname: string) {
  const match = manifest.scenes.find(scene => scene.routePath === pathname)
  return match?.id
}

export function resolveExperienceRoute(pathname: string, hash: string): ResolvedExperienceRoute | null {
  if (pathname === '/deck/home') {
    return {
      manifestId: 'public-home',
      initialSceneId: parseSceneFromHash(hash),
    }
  }

  if (pathname === '/deck/business') {
    return {
      manifestId: 'public-business',
      initialSceneId: parseSceneFromHash(hash),
    }
  }

  if (pathname === '/deck/tech') {
    return {
      manifestId: 'public-tech',
      initialSceneId: parseSceneFromHash(hash),
    }
  }

  if (pathname === '/deck/trust') {
    return {
      manifestId: 'public-trust',
      initialSceneId: parseSceneFromHash(hash),
    }
  }

  if (pathname === '/deck/founders') {
    return {
      manifestId: 'deck-founders',
      initialSceneId: parseSceneFromHash(hash),
    }
  }

  if (pathname === '/deck/meteoric') {
    return {
      manifestId: 'deck-meteoric',
      initialSceneId: parseSceneFromHash(hash),
    }
  }

  return null
}

export function createSceneUrl(manifest: ExperienceManifest, sceneId: string, currentPathname: string) {
  if (manifest.mode === 'horizontalSlides') {
    return `${currentPathname}#${encodeURIComponent(sceneId)}`
  }

  return currentPathname
}

export function parseSceneFromHash(hash: string) {
  if (!hash.startsWith('#')) return undefined
  const sceneId = decodeURIComponent(hash.slice(1))
  return sceneId || undefined
}
