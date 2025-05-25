import { memo } from 'react'
import type { FormatResult } from '../types/qr.types'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  formatResult?: FormatResult | null
}

export const TextInput = memo(({ value, onChange, placeholder, formatResult }: TextInputProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
        텍스트 또는 URL을 입력하세요
      </label>
      <textarea
        id="text-input"
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder={placeholder || "예: https://www.example.com 또는 Hello World!"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      {/* 자동 포맷 결과 표시 */}
      {formatResult && formatResult.type !== 'text' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">🔍 자동 감지:</span>
            <span className="text-blue-800 text-sm">{formatResult.description}</span>
          </div>
          {formatResult.formatted !== formatResult.original && (
            <div className="mt-2 text-xs text-blue-600 font-mono bg-blue-100 p-2 rounded">
              {formatResult.formatted}
            </div>
          )}
        </div>
      )}
    </div>
  )
})
