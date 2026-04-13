import type { DataProvenanceKind } from '../../services/dataService'
import { W } from '../../app/canvas/canvasTheme'

export const KIND_COLOR: Record<DataProvenanceKind, string> = {
  verified_real: W.green,
  from_public_record: W.cyan,
  issuer_attested: W.violetSoft,
  modeled: W.amber,
  illustrative: W.text3,
  simulated: W.text4,
  ai_predicted: '#c084fc',
}
