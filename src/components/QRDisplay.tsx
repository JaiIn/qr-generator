interface QRDisplayProps {
  qrCodeUrl: string
  isLoading: boolean
  error: string | null
  onPngDownload: () => void
  onSvgDownload: () => void
  onClipboardCopy: () => void
}

export const QRDisplay = ({ qrCodeUrl, isLoading, error, onPngDownload, onSvgDownload, onClipboardCopy }: QRDisplayProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-500 py-12">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p>QR 코드 생성 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-red-500 py-12">
          <div className="text-4xl mb-4">❌</div>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!qrCodeUrl) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-500 py-12">
          <div className="text-6xl mb-4">📱</div>
          <p>위에 텍스트를 입력하면 QR 코드가 생성됩니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">생성된 QR 코드</h2>
      <div className="flex justify-center mb-4">
        <img 
          src={qrCodeUrl} 
          alt="Generated QR Code" 
          className="border border-gray-200 rounded-lg"
        />
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={onPngDownload}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          PNG 다운로드
        </button>
        <button
          onClick={onSvgDownload}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          SVG 다운로드
        </button>
        <button
          onClick={onClipboardCopy}
          className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          클립보드 복사
        </button>
      </div>
    </div>
  )
}
