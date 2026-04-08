import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { PlantTelemetry, EnvTelemetry, EsgScore, AlertItem } from '../types/telemetry'
import type { AetherDataService, TimeRangeKey, HistoricalTelemetry, MaybeAsync } from './dataService'
import { INITIAL_PLANT_TELEMETRY, INITIAL_ENV_TELEMETRY, calculateEsgScore } from '../data/mockGenerator'

interface TelemetryState {
  plant: PlantTelemetry
  env: EnvTelemetry
  esg: EsgScore
  activeAlerts: AlertItem[]
  /** Unix ms when the last telemetry payload was received from the data service */
  lastUpdated: number
}

interface DataServiceContextValue {
  service: AetherDataService
  telemetry: TelemetryState
  getHistory: (range: TimeRangeKey) => MaybeAsync<HistoricalTelemetry>
  dismissAlert: (id: string) => void
  dismissAllAlerts: () => void
}

const DataServiceContext = createContext<DataServiceContextValue | null>(null)

interface Props {
  service: AetherDataService
  children: ReactNode
}

export function DataServiceProvider({ service, children }: Props) {
  const [telemetry, setTelemetry] = useState<TelemetryState>(() => ({
    plant: INITIAL_PLANT_TELEMETRY,
    env: INITIAL_ENV_TELEMETRY,
    esg: calculateEsgScore(INITIAL_PLANT_TELEMETRY, INITIAL_ENV_TELEMETRY),
    activeAlerts: [],
    lastUpdated: Date.now(),
  }))

  useEffect(() => {
    return service.subscribeTelemetry(({ plant, env, esg, alerts }) => {
      setTelemetry({
        plant,
        env,
        esg,
        activeAlerts: alerts,
        lastUpdated: Date.now(),
      })
    })
  }, [service])

  const getHistory = useCallback(
    (range: TimeRangeKey) => service.getHistory(range),
    [service],
  )
  const dismissAlert = useCallback((id: string) => service.dismissAlert(id), [service])
  const dismissAllAlerts = useCallback(() => service.dismissAllAlerts(), [service])

  const value = useMemo<DataServiceContextValue>(() => ({
    service,
    telemetry,
    getHistory,
    dismissAlert,
    dismissAllAlerts,
  }), [service, telemetry, getHistory, dismissAlert, dismissAllAlerts])

  return (
    <DataServiceContext.Provider value={value}>
      {children}
    </DataServiceContext.Provider>
  )
}

export function useDataService(): DataServiceContextValue {
  const ctx = useContext(DataServiceContext)
  if (!ctx) throw new Error('useDataService must be used within DataServiceProvider')
  return ctx
}

export function useTelemetry() {
  const { telemetry } = useDataService()
  return telemetry
}

export function useAetherService() {
  const { service } = useDataService()
  return service
}
