import { useState, useEffect, useCallback } from 'react'
import { HistoryItem } from '../utils/dataTypeUtils'

const HISTORY_KEY = 'qr-generator-history'
const MAX_HISTORY_ITEMS = 20

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY)
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('히스토리 로드 실패:', error)
        setHistory([])
      }
    }
  }, [])

  const saveToStorage = useCallback((newHistory: HistoryItem[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    setHistory(newHistory)
  }, [])

  const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    }

    setHistory(prev => {
      const filtered = prev.filter(h => h.formatted !== newItem.formatted)
      const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      saveToStorage(newHistory)
      return newHistory
    })

    return newItem.id
  }, [saveToStorage])

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id)
      saveToStorage(newHistory)
      return newHistory
    })
  }, [saveToStorage])

  const toggleFavorite = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
      saveToStorage(newHistory)
      return newHistory
    })
  }, [saveToStorage])

  const clearHistory = useCallback(() => {
    saveToStorage([])
  }, [saveToStorage])

  const getHistoryItem = useCallback((id: string) => {
    return history.find(item => item.id === id)
  }, [history])

  return {
    history,
    addToHistory,
    removeFromHistory,
    toggleFavorite,
    clearHistory,
    getHistoryItem,
    favorites: history.filter(item => item.isFavorite),
    recent: history.slice(0, 10)
  }
}
