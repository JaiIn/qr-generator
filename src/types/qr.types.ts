export type DataType = 'phone' | 'email' | 'url' | 'sms' | 'wifi' | 'geo' | 'text'

export interface QRCodeOptions {
  width: number
  margin: number
  color: {
    dark: string
    light: string
  }
}

export interface FormatResult {
  type: DataType
  original: string
  formatted: string
  description: string
}

export interface HistoryItem {
  id: string
  original: string
  formatted: string
  type: DataType
  description: string
  timestamp: number
  isFavorite?: boolean
}

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}
