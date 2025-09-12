import { Zone, SystemStatus, SetSystemModeRequest, SetZoneModeRequest, SetZoneSetpointRequest } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error or server unavailable', 0)
  }
}

export const api = {
  // System endpoints
  async getSystemMode(): Promise<SystemStatus> {
    return fetchApi<SystemStatus>('/api/system/mode')
  },

  async setSystemMode(mode: SetSystemModeRequest): Promise<void> {
    await fetchApi<void>('/api/system/mode', {
      method: 'PUT',
      body: JSON.stringify(mode),
    })
  },

  // Zone endpoints  
  async getZones(): Promise<Zone[]> {
    return fetchApi<Zone[]>('/api/zones')
  },

  async getZone(id: string): Promise<Zone> {
    return fetchApi<Zone>(`/api/zones/${id}`)
  },

  async setZoneMode(id: string, request: SetZoneModeRequest): Promise<void> {
    await fetchApi<void>(`/api/zones/${id}/mode`, {
      method: 'PUT', 
      body: JSON.stringify(request),
    })
  },

  async setZoneSetpoint(id: string, request: SetZoneSetpointRequest): Promise<void> {
    await fetchApi<void>(`/api/zones/${id}/setpoint`, {
      method: 'PUT',
      body: JSON.stringify(request),
    })
  },
}