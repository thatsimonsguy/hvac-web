import { Zone } from '@/types/api'
import { Card } from './Card'
import { ModeDisplay } from './ModeDisplay'

interface ZoneCardProps {
  zone: Zone
  onClick: (zone: Zone) => void
}

export function ZoneCard({ zone, onClick }: ZoneCardProps) {
  const tempDiff = zone.current_temp - zone.setpoint
  const tempDiffColor = Math.abs(tempDiff) > 2 ? 'text-red-600' : 'text-green-600'

  return (
    <Card onClick={() => onClick(zone)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{zone.label}</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Current:</span>
              <span className="text-lg font-bold text-gray-900">
                {zone.current_temp > 0 ? `${zone.current_temp.toFixed(1)}°F` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Target:</span>
              <span className="text-sm font-medium">
                {zone.setpoint.toFixed(1)}°F
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Mode:</span>
              <ModeDisplay mode={zone.mode} size="sm" />
            </div>
          </div>
        </div>
        <div className="text-right ml-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {zone.current_temp > 0 && (
              <span className={`text-sm font-bold ${tempDiffColor}`}>
                {tempDiff > 0 ? '+' : ''}{tempDiff.toFixed(1)}°
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}