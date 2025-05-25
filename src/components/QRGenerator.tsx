import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQRCode } from '../hooks/useQRCode'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useToast } from '../hooks/useToast'
import { useHistory } from '../hooks/useHistory'
import { TextInput } from './TextInput'
import { QRDisplay } from './QRDisplay'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { ToastContainer } from './ToastContainer'
import { HistoryPanel } from './HistoryPanel'
import { formatDataType } from '../utils/dataTypeUtils'
import { downloadPNG, downloadSVG, copyToClipboard } from '../utils/downloadUtils'
import type { FormatResult, HistoryItem } from '../types/qr.types'

export const QRGenerator = () => {
  const [text, setText] = useState('')
  const [formatResult, setFormatResult] = useState<FormatResult | null>(null)
  
  const qrText = useMemo(() => formatResult?.formatted || text, [formatResult, text])
  const { qrCodeUrl, qrSvgString, isLoading, error, regenerate } = useQRCode(qrText)
  const { toasts, success, error: showError, info, removeToast } = useToast()
  const { history, addToHistory, removeFromHistory, toggleFavorite, clearHistory, favorites } = useHistory()

  const handleDataFormatting = useCallback((inputText: string) => {
    if (!inputText.trim()) {
      setFormatResult(null)
      return
    }

    const result = formatDataType(inputText)
    setFormatResult(result)
    
    if (result.type !== 'text') {
      info(`${result.description} 🔍`, 2000)
    }
  }, [info])

  const saveToHistory = useCallback(() => {
    if (qrCodeUrl && text.trim() && formatResult) {
      addToHistory({
        original: formatResult.original,
        formatted: formatResult.formatted,
        type: formatResult.type,
        description: formatResult.description
      })
    }
  }, [qrCodeUrl, text, formatResult, addToHistory])

  const handlePngDownload = useCallback(async () => {
    if (!qrCodeUrl) return
    
    try {
      downloadPNG(qrCodeUrl)
      success('PNG 파일이 다운로드되었습니다! 🖼️')
    } catch (err) {
      showError('다운로드 중 오류가 발생했습니다.')
    }
  }, [qrCodeUrl, success, showError])

  const handleSvgDownload = useCallback(async () => {
    if (!qrSvgString) return
    
    try {
      downloadSVG(qrSvgString)
      success('SVG 파일이 다운로드되었습니다! ✨')
    } catch (err) {
      showError('SVG 다운로드 중 오류가 발생했습니다.')
    }
  }, [qrSvgString, success, showError])

  const handleClipboardCopy = useCallback(async () => {
    if (!qrCodeUrl) return
    
    const fallbackText = formatResult?.formatted || text
    
    try {
      await copyToClipboard(qrCodeUrl, fallbackText)
      success('QR 코드가 클립보드에 복사되었습니다! 📋')
    } catch (err) {
      const message = err instanceof Error ? err.message : '클립보드 복사에 실패했습니다.'
      
      if (message.includes('텍스트 복사 성공') || message.includes('대체 텍스트 복사 성공')) {
        info(message.replace('성공', '') + ' 📋')
      } else {
        showError('클립보드 복사가 지원되지 않습니다. PNG 파일로 다운로드합니다.')
        handlePngDownload()
      }
    }
  }, [qrCodeUrl, formatResult, text, success, info, showError, handlePngDownload])

  const handleRefresh = useCallback(() => {
    regenerate()
    info('QR 코드를 새로고침했습니다! 🔄')
  }, [regenerate, info])

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setText(item.original)
    success('히스토리에서 불러왔습니다! 📚')
  }, [setText, success])

  const handleHistoryRemove = useCallback((id: string) => {
    removeFromHistory(id)
    info('히스토리에서 삭제되었습니다.')
  }, [removeFromHistory, info])

  const handleHistoryClear = useCallback(() => {
    clearHistory()
    success('모든 히스토리가 삭제되었습니다.')
  }, [clearHistory, success])

  useEffect(() => {
    handleDataFormatting(text)
  }, [text, handleDataFormatting])

  useEffect(() => {
    saveToHistory()
  }, [saveToHistory])

  useKeyboardShortcuts({
    onRefresh: handleRefresh,
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
      
      <KeyboardShortcutsHelp />
      
      <HistoryPanel
        history={history}
        favorites={favorites}
        onSelect={handleHistorySelect}
        onRemove={handleHistoryRemove}
        onToggleFavorite={toggleFavorite}
        onClear={handleHistoryClear}
      />
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
