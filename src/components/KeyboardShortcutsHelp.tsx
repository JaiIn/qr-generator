import { useState } from 'react'

export const KeyboardShortcutsHelp = () => {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { key: 'Ctrl + Enter', description: 'QR 코드 새로고침' },
    { key: 'Ctrl + S', description: 'PNG 형식으로 다운로드' },
    { key: 'Ctrl + D', description: 'SVG 형식으로 다운로드' },
    { key: 'Ctrl + C', description: '클립보드로 복사' }
  ]

  return (
    <div className="relative">
      {/* 도움말 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-colors z-10"
        title="키보드 단축키 도움말"
      >
        <span className="text-lg">⌨️</span>
      </button>

      {/* 도움말 패널 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 도움말 내용 */}
          <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-xl p-6 z-30 min-w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">키보드 단축키</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{shortcut.description}</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 텍스트 입력 중에는 일부 단축키가 비활성화됩니다.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
