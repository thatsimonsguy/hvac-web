import { Zone, SystemStatus, SetSystemModeRequest, SetZoneModeRequest, SetZoneSetpointRequest } from '@/types/api'
import { apiConfig } from '@/config/api'

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`
  
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

    // Mutation endpoints (PUT) reply with 200 and an empty body. Parsing an
    // empty body as JSON throws, so only parse when there's actually content.
    const text = await response.text()
    return (text ? JSON.parse(text) : undefined) as T
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