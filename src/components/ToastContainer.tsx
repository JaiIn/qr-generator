import { useEffect, useState } from 'react'
import { Toast } from '../hooks/useToast'

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // 토스트 등장 애니메이션
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => onRemove(toast.id), 300) // 애니메이션 완료 후 제거
  }

  // 타입별 스타일
  const getToastStyles = () => {
    const baseStyles = "flex items-center gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 transform"
    
    if (isLeaving) {
      return `${baseStyles} translate-x-full opacity-0`
    }
    
    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`
    }

    const typeStyles = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800", 
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800"
    }

    return `${baseStyles} translate-x-0 opacity-100 ${typeStyles[toast.type]}`
  }

  // 타입별 아이콘
  const getIcon = () => {
    const icons = {
      success: "✅",
      error: "❌", 
      warning: "⚠️",
      info: "ℹ️"
    }
    return icons[toast.type]
  }

  return (
    <div className={getToastStyles()}>
      <span className="text-xl">{getIcon()}</span>
      <span className="flex-1 font-medium">{toast.message}</span>
      <button
        onClick={handleClose}
        className="text-gray-500 hover:text-gray-700 text-xl leading-none"
        title="닫기"
      >
        ×
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
