export type LicenseStatus = 'lp_approved' | 'li_pending' | 'exploration' | 'inferred'

export interface LicenseDetail {
  id: string
  name: string
  label: string
  status: LicenseStatus
  area_km2: number
  license_count: number
  note: string
  source_ref?: string
  as_of?: string
  confidence?: string
  resource_category?: string
  total_mt?: number
}
