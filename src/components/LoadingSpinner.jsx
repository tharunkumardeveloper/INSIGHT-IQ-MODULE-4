import React from 'react'

const LoadingSpinner = ({ size = 'large', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{text}</p>
    </div>
  )
}

export default LoadingSpinner