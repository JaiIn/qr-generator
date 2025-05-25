import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { QRCodeOptions } from '../types/qr.types'

export const useQRCode = (text: string, options?: Partial<QRCodeOptions>) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultOptions: QRCodeOptions = {
    width: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  }

  const generateQRCode = async (inputText: string) => {
    if (!inputText.trim()) {
      setQrCodeUrl('')
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const url = await QRCode.toDataURL(inputText, {
        ...defaultOptions,
        ...options
      })
      setQrCodeUrl(url)
    } catch (err) {
      console.error('QR 코드 생성 실패:', err)
      setError('QR 코드 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateQRCode(text)
  }, [text, options])

  return {
    qrCodeUrl,
    isLoading,
    error,
    regenerate: () => generateQRCode(text)
  }
}
