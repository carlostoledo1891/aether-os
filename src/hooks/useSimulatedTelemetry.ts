import { useState, useEffect, useRef, useCallback } from 'react'
import type { PlantTelemetry, EnvTelemetry, EsgScore, AlertItem, SimulationMode } from '../types/telemetry'
import {
  INITIAL_PLANT_TELEMETRY,
  INITIAL_ENV_TELEMETRY,
  generatePlantTelemetry,
  generateEnvTelemetry,
  calculateEsgScore,
  detectAlerts,
} from '../data/mockGenerator'

const HISTORY_LENGTH = 40

export function useSimulatedTelemetry() {
  const [simMode, setSimMode] = useState<SimulationMode>({ type: 'live' })
  const [plant, setPlant] = useState<PlantTelemetry>(INITIAL_PLANT_TELEMETRY)
  const [env, setEnv] = useState<EnvTelemetry>(INITIAL_ENV_TELEMETRY)
  const [esg, setEsg] = useState<EsgScore>({ overall: 94, operator: 95, regulator: 91, buyer: 96 })
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [plantHistory, setPlantHistory] = useState<PlantTelemetry[]>([INITIAL_PLANT_TELEMETRY])
  const [envHistory, setEnvHistory] = useState<EnvTelemetry[]>([INITIAL_ENV_TELEMETRY])

  const plantRef = useRef(plant)
  const envRef = useRef(env)
  const alertsRef = useRef(alerts)
  plantRef.current = plant
  envRef.current = env
  alertsRef.current = alerts

  useEffect(() => {
    if (simMode.type !== 'live') return
    const interval = setInterval(() => {
      const newPlant = generatePlantTelemetry(plantRef.current)
      const newEnv = generateEnvTelemetry(envRef.current)
      const newEsg = calculateEsgScore(newPlant, newEnv)
      const newAlerts = detectAlerts(newPlant, newEnv, alertsRef.current)

      setPlant(newPlant)
      setEnv(newEnv)
      setEsg(newEsg)
      setAlerts(newAlerts)
      setPlantHistory(h => [...h.slice(-(HISTORY_LENGTH - 1)), newPlant])
      setEnvHistory(h => [...h.slice(-(HISTORY_LENGTH - 1)), newEnv])
    }, 2000)
    return () => clearInterval(interval)
  }, [simMode.type])

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a))
  }, [])

  const dismissAllAlerts = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })))
  }, [])

  const activeAlerts = alerts.filter(a => !a.dismissed)

  return {
    plant, env, esg, alerts, activeAlerts,
    plantHistory, envHistory,
    simMode, setSimMode,
    dismissAlert, dismissAllAlerts,
  }
}
