export type SystemMode = 'off' | 'heating' | 'cooling' | 'circulate'

export interface Zone {
  id: string
  label: string
  setpoint: number
  mode: SystemMode
  current_temp: number
}

export interface SystemStatus {
  mode: SystemMode
  buffer_temp?: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface SetSystemModeRequest {
  mode: SystemMode
}

export interface SetZoneModeRequest {
  mode: SystemMode
}

export interface SetZoneSetpointRequest {
  setpoint: number
}