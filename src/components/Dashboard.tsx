'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Zone, SystemStatus } from '@/types/api'
import { REFRESH_INTERVAL } from '@/config/api'
import { SystemCard } from './SystemCard'
import { ZoneCard } from './ZoneCard'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'

interface DashboardProps {
  onZoneClick: (zone: Zone, system: SystemStatus) => void
  onSystemClick: (system: SystemStatus) => void
  refreshTrigger?: number // Optional prop to trigger refresh
}

export function Dashboard({ onZoneClick, onSystemClick, refreshTrigger }: DashboardProps) {
  const [zones, setZones] = useState<Zone[]>([])
  const [system, setSystem] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setError(null)
      const [zonesData, systemData] = await Promise.all([
        api.getZones(),
        api.getSystemMode()
      ])
      setZones(zonesData)
      setSystem(systemData)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Refresh data at configured interval
    const interval = setInterval(fetchData, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  // Refresh data when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      fetchData()
    }
  }, [refreshTrigger])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} />
        <button 
          onClick={() => {
            setLoading(true)
            fetchData()
          }}
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">HVAC Control</h1>
        <button 
          onClick={() => {
            setLoading(true)
            fetchData()
          }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {system && (
          <SystemCard 
            system={system} 
            onClick={() => onSystemClick(system)} 
          />
        )}
        
        {zones.map((zone) => (
          <ZoneCard 
            key={zone.id} 
            zone={zone} 
            onClick={(zone) => system && onZoneClick(zone, system)}
          />
        ))}
      </div>
    </div>
  )
}