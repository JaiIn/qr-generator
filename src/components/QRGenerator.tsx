import { useState, useEffect } from 'react'
import { useQRCode } from '../hooks/useQRCode'
import { TextInput } from './TextInput'
import { QRDisplay } from './QRDisplay'
import { formatDataType, FormatResult } from '../utils/dataTypeUtils'

export const QRGenerator = () => {
  const [text, setText] = useState('')
  const [formatResult, setFormatResult] = useState<FormatResult | null>(null)
  const { qrCodeUrl, qrSvgString, isLoading, error } = useQRCode(formatResult?.formatted || text)

  // 텍스트 변경시 자동 포맷 적용
  useEffect(() => {
    if (text.trim()) {
      const result = formatDataType(text)
      setFormatResult(result)
    } else {
      setFormatResult(null)
    }
  }, [text])

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

  const handleClipboardCopy = async () => {
    if (!qrCodeUrl) return

    try {
      // Base64 URL에서 데이터 추출
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      
      // 클립보드에 이미지 복사
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      
      // 성공 피드백 (옵션)
      console.log('QR 코드가 클립보드에 복사되었습니다!')
    } catch (err) {
      console.error('클립보드 복사 실패:', err)
      // 폴백: 오래된 브라우저에서는 다운로드로 폴백
      handlePngDownload()
    }
  }

  return (
    <div>
      <TextInput 
        value={text}
        onChange={setText}
        formatResult={formatResult}
      />
      
      <QRDisplay
        qrCodeUrl={qrCodeUrl}
        isLoading={isLoading}
        error={error}
        onPngDownload={handlePngDownload}
        onSvgDownload={handleSvgDownload}
        onClipboardCopy={handleClipboardCopy}
      />
    </div>
  )
}
