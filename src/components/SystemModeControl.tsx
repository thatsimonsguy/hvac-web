'use client'

import { useState } from 'react'
import { SystemMode, SystemStatus } from '@/types/api'
import { api } from '@/lib/api'
import { Card } from './Card'
import { ModeDisplay } from './ModeDisplay'
import { ErrorMessage } from './ErrorMessage'

interface SystemModeControlProps {
  system: SystemStatus
  onBack: () => void
  onUpdate: (updatedSystem: SystemStatus) => void
}

export function SystemModeControl({ system, onBack, onUpdate }: SystemModeControlProps) {
  const [selectedMode, setSelectedMode] = useState<SystemMode>(system.mode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allModes: SystemMode[] = ['off', 'heating', 'cooling', 'circulate']

  const handleModeChange = async (newMode: SystemMode) => {
    setLoading(true)
    setError(null)

    try {
      await api.setSystemMode({ mode: newMode })
      const updatedSystem = { ...system, mode: newMode }
      setSelectedMode(newMode)
      onUpdate(updatedSystem)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update system mode')
    } finally {
      setLoading(false)
    }
  }

  const getModeDescription = (mode: SystemMode): string => {
    switch (mode) {
      case 'off':
        return 'System is completely disabled. No heating, cooling, or circulation.'
      case 'heating':
        return 'System will heat zones as needed to reach target temperatures.'
      case 'cooling':
        return 'System will cool zones as needed to reach target temperatures.'
      case 'circulate':
        return 'System will circulate air without heating or cooling.'
      default:
        return ''
    }
  }

  const getModeIcon = (mode: SystemMode) => {
    switch (mode) {
      case 'off':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9" />
          </svg>
        )
      case 'heating':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      case 'cooling':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        )
      case 'circulate':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      default:
        return null
    }
  }

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
        
        <h1 className="text-2xl font-bold text-gray-900">System Control</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">System Mode</span>
              <div className="mt-2">
                <ModeDisplay mode={system.mode} size="lg" />
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Buffer Tank Temperature</span>
              <p className="text-2xl font-bold text-gray-900">
                {system.buffer_temp ? `${system.buffer_temp.toFixed(1)}°F` : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        {/* Mode Selection */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select System Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allModes.map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                disabled={loading}
                className={`p-6 rounded-lg border-2 transition-colors text-left ${
                  selectedMode === mode
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${selectedMode === mode ? 'bg-primary-100' : 'bg-gray-100'}`}>
                    {getModeIcon(mode)}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <ModeDisplay mode={mode} />
                    </div>
                    <p className="text-sm text-gray-600">
                      {getModeDescription(mode)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {loading && (
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">Updating system mode...</span>
            </div>
          )}
        </Card>

        {/* System Information */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Zone Controls:</strong> Individual zones can be set to Off or Circulate modes regardless of system mode. 
              Heating and Cooling modes are only available when the system is in the respective mode.
            </p>
            <p>
              <strong>Buffer Tank:</strong> The buffer tank temperature helps the system determine when to activate heating or cooling sources.
            </p>
            <p>
              <strong>Safety:</strong> The system includes built-in safety controls and will automatically shut down if unsafe conditions are detected.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}