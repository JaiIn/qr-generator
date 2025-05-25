interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const TextInput = ({ value, onChange, placeholder }: TextInputProps) => {
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
    </div>
  )
}
