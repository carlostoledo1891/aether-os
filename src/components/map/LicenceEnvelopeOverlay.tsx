import { Layer, Source } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import { useGeoJsonFeatureCollection } from './geojson'
import envelopeUrl from '../../data/geojson/caldeira-licence-envelope.geojson?url'

export const LICENCE_ENVELOPE_FILL_LAYER_ID = 'licence-envelope-fill'

export function LicenceEnvelopeOverlay() {
  const data = useGeoJsonFeatureCollection(envelopeUrl)
  if (!data) return null

  return (
    <Source id="licence-envelope-source" type="geojson" data={data}>
      <Layer
        id={LICENCE_ENVELOPE_FILL_LAYER_ID}
        type="fill"
        filter={['==', ['get', 'kind'], 'licence-envelope']}
        paint={{
          'fill-color': W.violet,
          'fill-opacity': 0.03,
        }}
      />
      <Layer
        id="licence-envelope-line"
        type="line"
        filter={['==', ['get', 'kind'], 'licence-envelope']}
        paint={{
          'line-color': W.violetSoft,
          'line-width': 1.2,
          'line-opacity': 0.35,
          'line-dasharray': [5, 4],
        }}
      />
    </Source>
  )
}
