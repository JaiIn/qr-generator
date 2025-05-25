import { useEffect } from 'react'

interface KeyboardShortcuts {
  onRefresh?: () => void
  onPngDownload?: () => void
  onSvgDownload?: () => void
  onClipboardCopy?: () => void
}

export const useKeyboardShortcuts = ({
  onRefresh,
  onPngDownload,
  onSvgDownload,
  onClipboardCopy
}: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl 키가 눌려져 있어야 함
      if (!event.ctrlKey) return
      
      // 텍스트 입력 중일 때는 일부 단축키 비활성화
      const isInputFocused = document.activeElement?.tagName === 'TEXTAREA' || 
                            document.activeElement?.tagName === 'INPUT'
      
      switch (event.key.toLowerCase()) {
        case 'enter':
          // Ctrl + Enter: QR 코드 새로고침
          event.preventDefault()
          onRefresh?.()
          break
          
        case 's':
          // Ctrl + S: PNG 다운로드 (기본 저장 동작 방지)
          if (!isInputFocused) {
            event.preventDefault()
            onPngDownload?.()
          }
          break
          
        case 'd':
          // Ctrl + D: SVG 다운로드 (기본 북마크 동작 방지)
          if (!isInputFocused) {
            event.preventDefault()
            onSvgDownload?.()
          }
          break
          
        case 'c':
          // Ctrl + C: 클립보드 복사 (텍스트 입력 중이 아닐 때만)
          if (!isInputFocused && event.target !== document.activeElement) {
            event.preventDefault()
            onClipboardCopy?.()
          }
          break
      }
    }

    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown)
    
    // 정리 함수
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onRefresh, onPngDownload, onSvgDownload, onClipboardCopy])
}
