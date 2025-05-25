import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { QRCodeOptions } from '../types/qr.types'

export const useQRCode = (text: string, options?: Partial<QRCodeOptions>) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [qrSvgString, setQrSvgString] = useState('')
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
      setQrSvgString('')
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // PNG 생성
      const url = await QRCode.toDataURL(inputText, {
        ...defaultOptions,
        ...options
      })
      setQrCodeUrl(url)

      // SVG 생성
      const svg = await QRCode.toString(inputText, {
        type: 'svg',
        ...defaultOptions,
        ...options
      })
      setQrSvgString(svg)
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
    qrSvgString,
    isLoading,
    error,
    regenerate: () => generateQRCode(text)
  }
}
