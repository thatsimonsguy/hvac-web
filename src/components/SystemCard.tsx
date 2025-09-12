import { SystemStatus } from '@/types/api'
import { Card } from './Card'
import { ModeDisplay } from './ModeDisplay'

interface SystemCardProps {
  system: SystemStatus
  onClick: () => void
}

export function SystemCard({ system, onClick }: SystemCardProps) {
  return (
    <Card onClick={onClick} className="col-span-full lg:col-span-1">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">System</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Mode:</span>
              <ModeDisplay mode={system.mode} />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Buffer Tank:</span>
              <span className="text-sm font-medium">
                {system.buffer_temp ? `${system.buffer_temp.toFixed(1)}°F` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  )
}