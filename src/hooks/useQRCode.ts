import { useState, useEffect, useCallback, useMemo } from 'react'
import QRCode from 'qrcode'
import type { QRCodeOptions } from '../types/qr.types'

export const useQRCode = (text: string, options?: Partial<QRCodeOptions>) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [qrSvgString, setQrSvgString] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const qrOptions = useMemo((): QRCodeOptions => ({
    width: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    ...options
  }), [options])

  const generateQRCode = useCallback(async (inputText: string) => {
    if (!inputText.trim()) {
      setQrCodeUrl('')
      setQrSvgString('')
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [pngUrl, svgString] = await Promise.all([
        QRCode.toDataURL(inputText, qrOptions),
        QRCode.toString(inputText, { type: 'svg', ...qrOptions })
      ])
      
      setQrCodeUrl(pngUrl)
      setQrSvgString(svgString)
    } catch (err) {
      console.error('QR 코드 생성 실패:', err)
      setError('QR 코드 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [qrOptions])

  useEffect(() => {
    generateQRCode(text)
  }, [text, generateQRCode])

  const regenerate = useCallback(() => {
    generateQRCode(text)
  }, [generateQRCode, text])

  return {
    qrCodeUrl,
    qrSvgString,
    isLoading,
    error,
    regenerate
  }
}
