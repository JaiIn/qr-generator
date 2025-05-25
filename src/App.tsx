import { QRGenerator } from './components/QRGenerator'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          QR Code Generator
        </h1>
        
        <QRGenerator />
      </div>
    </div>
  )
}

export default App
