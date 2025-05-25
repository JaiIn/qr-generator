import { useState } from 'react'
import { HistoryItem } from '../utils/dataTypeUtils'

interface HistoryPanelProps {
  history: HistoryItem[]
  favorites: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onRemove: (id: string) => void
  onToggleFavorite: (id: string) => void
  onClear: () => void
}

export const HistoryPanel = ({ 
  history, 
  favorites, 
  onSelect, 
  onRemove, 
  onToggleFavorite, 
  onClear 
}: HistoryPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent')

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 7) return `${diffDays}일 전`
    return date.toLocaleDateString()
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      phone: '📞',
      email: '📧',
      url: '🌐',
      sms: '💬',
      wifi: '📶',
      geo: '📍',
      text: '📝'
    }
    return icons[type as keyof typeof icons] || '📝'
  }

  const currentItems = activeTab === 'recent' ? history : favorites

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-colors z-10"
        title="히스토리"
      >
        <span className="text-lg">📚</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed bottom-20 left-4 bg-white rounded-lg shadow-xl z-30 w-80 max-h-96 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">히스토리</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'recent' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  최근 ({history.length})
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'favorites' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  즐겨찾기 ({favorites.length})
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {currentItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {activeTab === 'recent' ? '아직 히스토리가 없습니다' : '즐겨찾기가 없습니다'}
                </div>
              ) : (
                <div className="space-y-2">
                  {currentItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
                      onClick={() => {
                        onSelect(item)
                        setIsOpen(false)
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-lg">{getTypeIcon(item.type)}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {item.original}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {item.description}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {formatDate(item.timestamp)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onToggleFavorite(item.id)
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                            title={item.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                          >
                            {item.isFavorite ? '⭐' : '☆'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onRemove(item.id)
                            }}
                            className="p-1 hover:bg-gray-200 rounded text-red-500"
                            title="삭제"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    onClear()
                    setIsOpen(false)
                  }}
                  className="w-full text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  전체 삭제
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
