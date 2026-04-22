export const PUBLIC_DECK_NAV = [
  { id: 'home', label: 'Home', path: '/deck/home' },
] as const

export type PublicDeckNavId = (typeof PUBLIC_DECK_NAV)[number]['id']

const PUBLIC_MANIFEST_PREFIX = 'public-'

export function isPublicMarketingDeckManifestId(manifestId: string) {
  return manifestId.startsWith(PUBLIC_MANIFEST_PREFIX) && manifestId !== 'public-site'
}
