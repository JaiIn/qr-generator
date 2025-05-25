export const downloadPNG = (qrCodeUrl: string, filename = 'qrcode.png'): void => {
  if (!qrCodeUrl) throw new Error('QR 코드 URL이 없습니다.')
  
  const link = document.createElement('a')
  link.download = filename
  link.href = qrCodeUrl
  link.click()
}

export const downloadSVG = (svgString: string, filename = 'qrcode.svg'): void => {
  if (!svgString) throw new Error('SVG 데이터가 없습니다.')
  
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  try {
    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.click()
  } finally {
    URL.revokeObjectURL(url)
  }
}

export const copyToClipboard = async (qrCodeUrl: string, fallbackText?: string): Promise<void> => {
  if (!qrCodeUrl) throw new Error('QR 코드 URL이 없습니다.')

  if (!navigator.clipboard) {
    throw new Error('클립보드 API가 지원되지 않습니다.')
  }

  try {
    const response = await fetch(qrCodeUrl)
    if (!response.ok) throw new Error('이미지 데이터 로드 실패')
    
    const blob = await response.blob()
    
    if (!window.ClipboardItem) {
      throw new Error('ClipboardItem이 지원되지 않습니다.')
    }
    
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ])
  } catch (imageError) {
    if (fallbackText && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(fallbackText)
      throw new Error('텍스트 복사 성공')
    }
    
    if (fallbackText) {
      const textArea = document.createElement('textarea')
      textArea.value = fallbackText
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      
      try {
        document.execCommand('copy')
        throw new Error('대체 텍스트 복사 성공')
      } finally {
        document.body.removeChild(textArea)
      }
    }
    
    throw imageError
  }
}
