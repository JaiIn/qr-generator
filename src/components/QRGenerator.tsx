import { useState, useEffect } from 'react'
import { useQRCode } from '../hooks/useQRCode'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useToast } from '../hooks/useToast'
import { useHistory } from '../hooks/useHistory'
import { TextInput } from './TextInput'
import { QRDisplay } from './QRDisplay'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { ToastContainer } from './ToastContainer'
import { HistoryPanel } from './HistoryPanel'
import { formatDataType, FormatResult, HistoryItem } from '../utils/dataTypeUtils'

export const QRGenerator = () => {
  const [text, setText] = useState('')
  const [formatResult, setFormatResult] = useState<FormatResult | null>(null)
  const { qrCodeUrl, qrSvgString, isLoading, error, regenerate } = useQRCode(formatResult?.formatted || text)
  const { toasts, success, error: showError, info, removeToast } = useToast()
  const { 
    history, 
    addToHistory, 
    removeFromHistory, 
    toggleFavorite, 
    clearHistory, 
    favorites 
  } = useHistory()

  // 텍스트 변경시 자동 포맷 적용
  useEffect(() => {
    if (text.trim()) {
      const result = formatDataType(text)
      setFormatResult(result)
      
      if (result.type !== 'text') {
        info(`${result.description} 🔍`, 2000)
      }
    } else {
      setFormatResult(null)
    }
  }, [text, info])

  useEffect(() => {
    if (qrCodeUrl && text.trim() && formatResult) {
      addToHistory({
        original: formatResult.original,
        formatted: formatResult.formatted,
        type: formatResult.type,
        description: formatResult.description
      })
    }
  }, [qrCodeUrl, text, formatResult, addToHistory])

  const handleHistorySelect = (item: HistoryItem) => {
    setText(item.original)
    success('히스토리에서 불러왔습니다! 📚')
  }

  const handleHistoryRemove = (id: string) => {
    removeFromHistory(id)
    info('히스토리에서 삭제되었습니다.')
  }

  const handleHistoryClear = () => {
    clearHistory()
    success('모든 히스토리가 삭제되었습니다.')
  }

  const handlePngDownload = () => {
    if (qrCodeUrl) {
      try {
        const link = document.createElement('a')
        link.download = 'qrcode.png'
        link.href = qrCodeUrl
        link.click()
        success('PNG 파일이 다운로드되었습니다! 🖼️')
      } catch (err) {
        showError('다운로드 중 오류가 발생했습니다.')
      }
    }
  }

  const handleSvgDownload = () => {
    if (qrSvgString) {
      try {
        const blob = new Blob([qrSvgString], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'qrcode.svg'
        link.href = url
        link.click()
        URL.revokeObjectURL(url) // 메모리 정리
        success('SVG 파일이 다운로드되었습니다! ✨')
      } catch (err) {
        showError('SVG 다운로드 중 오류가 발생했습니다.')
      }
    }
  }

  const handleClipboardCopy = async () => {
    if (!qrCodeUrl) return

    try {
      // 방법 1: 디퍼 호환성을 위해 먼저 권한 체크
      if (!navigator.clipboard) {
        throw new Error('클립보드 API가 지원되지 않습니다.')
      }

      // Base64 URL에서 데이터 추출
      const response = await fetch(qrCodeUrl)
      if (!response.ok) {
        throw new Error('이미지 데이터를 가져오는데 실패했습니다.')
      }
      
      const blob = await response.blob()
      
      // ClipboardItem 지원 체크
      if (!window.ClipboardItem) {
        throw new Error('ClipboardItem이 지원되지 않습니다.')
      }
      
      // 클립보드에 이미지 복사
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      
      success('QR 코드가 클립보드에 복사되었습니다! 📋')
    } catch (err) {
      console.error('클립보드 복사 실패:', err)
      
      // 폴백 1: 텍스트로 복사 시도 (URL만)
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          const textToCopy = formatResult?.formatted || text || qrCodeUrl
          await navigator.clipboard.writeText(textToCopy)
          info('텍스트가 클립보드에 복사되었습니다! 📋')
          return
        }
      } catch (textErr) {
        console.error('텍스트 복사도 실패:', textErr)
      }
      
      // 폴백 2: 오래된 방식으로 텍스트 복사
      try {
        const textArea = document.createElement('textarea')
        const textToCopy = formatResult?.formatted || text
        textArea.value = textToCopy
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        info('텍스트가 복사되었습니다! (대체 방법) 📋')
        return
      } catch (fallbackErr) {
        console.error('폴백 복사도 실패:', fallbackErr)
      }
      
      // 모든 방법 실패 시 다운로드로 폴백
      showError('클립보드 복사가 지원되지 않습니다. PNG 파일로 다운로드합니다.')
      handlePngDownload()
    }
  }

  // 키보드 단축키 설정
  useKeyboardShortcuts({
    onRefresh: () => {
      regenerate()
      info('QR 코드를 새로고침했습니다! 🔄')
    },
    onPngDownload: handlePngDownload,
    onSvgDownload: handleSvgDownload,
    onClipboardCopy: handleClipboardCopy
  })

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
      
      {/* 키보드 단축키 도움말 */}
      <KeyboardShortcutsHelp />
      
      {/* 히스토리 패널 */}
      <HistoryPanel
        history={history}
        favorites={favorites}
        onSelect={handleHistorySelect}
        onRemove={handleHistoryRemove}
        onToggleFavorite={toggleFavorite}
        onClear={handleHistoryClear}
      />
      
      {/* 토스트 알림 */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
