import { useState } from 'react'
import { useQRCode } from '../hooks/useQRCode'
import { TextInput } from './TextInput'
import { QRDisplay } from './QRDisplay'

export const QRGenerator = () => {
  const [text, setText] = useState('')
  const { qrCodeUrl, qrSvgString, isLoading, error } = useQRCode(text)

  const handlePngDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = qrCodeUrl
      link.click()
    }
  }

  const handleSvgDownload = () => {
    if (qrSvgString) {
      const blob = new Blob([qrSvgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = 'qrcode.svg'
      link.href = url
      link.click()
      URL.revokeObjectURL(url) // 메모리 정리
    }
  }

  return (
    <div>
      <TextInput 
        value={text}
        onChange={setText}
      />
      
      <QRDisplay
        qrCodeUrl={qrCodeUrl}
        isLoading={isLoading}
        error={error}
        onPngDownload={handlePngDownload}
        onSvgDownload={handleSvgDownload}
      />
    </div>
  )
}
