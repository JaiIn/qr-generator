export interface QRCodeOptions {
  width: number
  margin: number
  color: {
    dark: string
    light: string
  }
}

export interface QRCodeData {
  text: string
  url: string
  timestamp: number
}
