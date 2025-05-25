import { useState } from 'react'
import { useQRCode } from '../hooks/useQRCode'
import { TextInput } from './TextInput'
import { QRDisplay } from './QRDisplay'

export const QRGenerator = () => {
  const [text, setText] = useState('')
  const { qrCodeUrl, isLoading, error } = useQRCode(text)

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = qrCodeUrl
      link.click()
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
        onDownload={handleDownload}
      />
    </div>
  )
}
