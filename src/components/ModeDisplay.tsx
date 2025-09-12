import { SystemMode } from '@/types/api'

interface ModeDisplayProps {
  mode: SystemMode
  size?: 'sm' | 'md' | 'lg'
}

export function ModeDisplay({ mode, size = 'md' }: ModeDisplayProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  const modeClass = `mode-${mode}`
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${modeClass}`}>
      {mode.charAt(0).toUpperCase() + mode.slice(1)}
    </span>
  )
}