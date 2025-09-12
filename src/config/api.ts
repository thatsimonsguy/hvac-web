// API Configuration
// This file contains the default API configuration that can be committed to the repo.
// For local development or production deployment, these values can be overridden
// using environment variables.

const API_CONFIG = {
  // Default to the Pi's typical network address
  // In production, this should be set to the actual HVAC controller's IP/hostname
  DEFAULT_API_URL: 'http://192.168.1.48:8080',
  
  // Allow override via environment variable for different deployments
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.48:8080',
  
  // API timeout settings
  TIMEOUT_MS: 10000, // 10 seconds
  
  // Auto-refresh interval for dashboard data
  REFRESH_INTERVAL_MS: 30000, // 30 seconds
}

export const apiConfig = {
  baseUrl: API_CONFIG.API_URL,
  timeout: API_CONFIG.TIMEOUT_MS,
  refreshInterval: API_CONFIG.REFRESH_INTERVAL_MS,
}

// Helper function to get the full API URL for an endpoint
export function getApiUrl(endpoint: string): string {
  return `${apiConfig.baseUrl}${endpoint}`
}

// Export individual config values for convenience
export const { baseUrl: API_BASE_URL, timeout: API_TIMEOUT, refreshInterval: REFRESH_INTERVAL } = apiConfig