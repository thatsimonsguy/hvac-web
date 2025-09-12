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
  }

  const handleZoneUpdate = (updatedZone: Zone) => {
    setSelectedZone(updatedZone)
    // You might want to trigger a refresh of the dashboard data here
  }

  const handleSystemUpdate = (updatedSystem: SystemStatus) => {
    setSystemStatus(updatedSystem)
    // You might want to trigger a refresh of the dashboard data here
  }

  return (
    <>
      {currentView === 'dashboard' && (
        <Dashboard 
          onZoneClick={handleZoneClick}
          onSystemClick={handleSystemClick}
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