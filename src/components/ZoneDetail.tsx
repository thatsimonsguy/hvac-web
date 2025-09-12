'use client'

import { useState } from 'react'
import { Zone, SystemMode, SystemStatus } from '@/types/api'
import { api } from '@/lib/api'
import { Card } from './Card'
import { ModeDisplay } from './ModeDisplay'
import { ErrorMessage } from './ErrorMessage'

interface ZoneDetailProps {
  zone: Zone
  systemStatus: SystemStatus
  onBack: () => void
  onUpdate: (updatedZone: Zone) => void
}

export function ZoneDetail({ zone, systemStatus, onBack, onUpdate }: ZoneDetailProps) {
  const [setpoint, setSetpoint] = useState(zone.setpoint.toString())
  const [selectedMode, setSelectedMode] = useState<SystemMode>(zone.mode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Determine available modes based on system mode and zone capabilities
  const getAvailableModes = (): SystemMode[] => {
    const baseModes: SystemMode[] = ['off']
    
    // Add circulate if zone has heating or cooling capability
    if (zone.capabilities.includes('heating') || zone.capabilities.includes('cooling')) {
      baseModes.push('circulate')
    }
    
    // Add heating mode if system supports it and zone has heating capability
    if (systemStatus.mode === 'heating' && zone.capabilities.includes('heating')) {
      baseModes.push('heating')
    }
    
    // Add cooling mode if system supports it and zone has cooling capability
    if (systemStatus.mode === 'cooling' && zone.capabilities.includes('cooling')) {
      baseModes.push('cooling')
    }
    
    return baseModes
  }

  const availableModes = getAvailableModes()

  const handleSetpointChange = async () => {
    const newSetpoint = parseFloat(setpoint)
    if (isNaN(newSetpoint)) {
      setError('Invalid setpoint value')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await api.setZoneSetpoint(zone.id, { setpoint: newSetpoint })
      const updatedZone = { ...zone, setpoint: newSetpoint }
      onUpdate(updatedZone)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update setpoint')
    } finally {
      setLoading(false)
    }
  }

  const handleModeChange = async (newMode: SystemMode) => {
    setLoading(true)
    setError(null)

    try {
      await api.setZoneMode(zone.id, { mode: newMode })
      const updatedZone = { ...zone, mode: newMode }
      setSelectedMode(newMode)
      onUpdate(updatedZone)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mode')
    } finally {
      setLoading(false)
    }
  }

  const hasChanges = setpoint !== zone.setpoint.toString()

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">{zone.label}</h1>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="space-y-6">
        {/* Current Status */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-600">Current Temperature</span>
              <p className="text-2xl font-bold text-gray-900">
                {zone.current_temp > 0 ? `${zone.current_temp.toFixed(1)}°F` : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Target Temperature</span>
              <p className="text-2xl font-bold text-gray-900">
                {zone.setpoint.toFixed(1)}°F
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Mode</span>
              <div className="mt-2">
                <ModeDisplay mode={zone.mode} />
              </div>
            </div>
          </div>
        </Card>

        {/* Temperature Control */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Temperature Control</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Temperature (°F)
              </label>
              <input
                type="number"
                value={setpoint}
                onChange={(e) => setSetpoint(e.target.value)}
                step="0.5"
                min="50"
                max="95"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSetpointChange}
              disabled={loading || !hasChanges}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </Card>

        {/* Mode Control */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mode Control</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableModes.map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                disabled={loading}
                className={`p-3 rounded-lg border-2 transition-colors text-center ${
                  selectedMode === mode
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ModeDisplay mode={mode} />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Available modes depend on the current system mode: {systemStatus.mode}
          </p>
        </Card>
      </div>
    </div>
  )
}