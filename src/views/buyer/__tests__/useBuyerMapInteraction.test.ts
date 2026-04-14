import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBuyerMapInteraction } from '../useBuyerMapInteraction'
import { SPRING_PIN_LAYER_ID } from '../../../components/map/SpringPinsOverlay'

function makeEvent(layerId: string, properties: Record<string, unknown>) {
  return {
    features: [
      {
        layer: { id: layerId },
        properties,
      },
    ],
    point: { x: 120, y: 90 },
    lngLat: { lng: -46.5, lat: -21.9 },
  }
}

describe('useBuyerMapInteraction', () => {
  it('shows a popup for spring pins on hover', () => {
    const { result } = renderHook(() => useBuyerMapInteraction([]))

    act(() => {
      result.current.handleBuyerMouseEnter(makeEvent(SPRING_PIN_LAYER_ID, {
        id: 'spring-001',
        name: 'Reference Spring',
        municipality: 'Pocos de Caldas',
        source_label: 'CAR',
      }) as never)
    })

    expect(result.current.popupData).not.toBeNull()
    expect(result.current.popupData?.data.title).toBe('Reference Spring')
    expect(result.current.popupData?.data.rows).toEqual(
      expect.arrayContaining([
        { label: 'Spring ID', value: 'spring-001' },
        { label: 'Source', value: 'CAR' },
      ]),
    )
  })
})
