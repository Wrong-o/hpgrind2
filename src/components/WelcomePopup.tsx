import React from 'react'

interface WelcomePopupProps {
  onStart: () => void
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          Välkommen!
        </h2>
        <p className="text-gray-600 mb-6">
          Dina framsteg sparas nu
        </p>
        <button
          onClick={onStart}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 transition-colors font-bold"
        >
          Börja grinda
        </button>
      </div>
    </div>
  )
} 