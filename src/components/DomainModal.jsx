import React from 'react'
import { X } from 'lucide-react'

const DomainModal = ({ domains, onDomainSelect }) => {
  const domainEntries = Object.entries(domains || {})

  // Show loading state if no domains are loaded yet
  if (domainEntries.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Domains...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we load the available domains
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              INSIGHTIQ
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose a domain to explore
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainEntries.map(([key, domain]) => (
              <button
                key={key}
                onClick={() => onDomainSelect(key)}
                className="group p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    {domain.emoji || '🔧'}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {domain.name}
                    </h3>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p className="mb-2">Key Players:</p>
                  <div className="flex flex-wrap gap-1">
                    {domain.competitors.slice(0, 3).map((competitor, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs"
                      >
                        {competitor}
                      </span>
                    ))}
                    {domain.competitors.length > 3 && (
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                        +{domain.competitors.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a domain to start analyzing market intelligence and trends
          </p>
        </div>
      </div>
    </div>
  )
}

export default DomainModal