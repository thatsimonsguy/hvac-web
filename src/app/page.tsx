'use client'

import { useState } from 'react'
import { Zone, SystemStatus } from '@/types/api'
import { Dashboard } from '@/components/Dashboard'
import { ZoneDetail } from '@/components/ZoneDetail'
import { SystemModeControl } from '@/components/SystemModeControl'

type View = 'dashboard' | 'zone' | 'system'

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleZoneClick = (zone: Zone, system: SystemStatus) => {
    setSelectedZone(zone)
    setSystemStatus(system)
    setCurrentView('zone')
  }

  const handleSystemClick = (system: SystemStatus) => {
    setSystemStatus(system)
    setCurrentView('system')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedZone(null)
    setSystemStatus(null)
    // Refresh dashboard data when returning from a detail view
    setRefreshTrigger(prev => prev + 1)
  }

  const handleZoneUpdate = (updatedZone: Zone) => {
    setSelectedZone(updatedZone)
    // Trigger dashboard refresh when data changes
    setRefreshTrigger(prev => prev + 1)
  }

  const handleSystemUpdate = (updatedSystem: SystemStatus) => {
    setSystemStatus(updatedSystem)
    // Trigger dashboard refresh when data changes
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <>
      {currentView === 'dashboard' && (
        <Dashboard 
          onZoneClick={handleZoneClick}
          onSystemClick={handleSystemClick}
          refreshTrigger={refreshTrigger}
        />
      )}

      {currentView === 'zone' && selectedZone && systemStatus && (
        <ZoneDetail 
          zone={selectedZone}
          systemStatus={systemStatus}
          onBack={handleBackToDashboard}
          onUpdate={handleZoneUpdate}
        />
      )}

      {currentView === 'system' && systemStatus && (
        <SystemModeControl 
          system={systemStatus}
          onBack={handleBackToDashboard}
          onUpdate={handleSystemUpdate}
        />
      )}
    </>
  )
}