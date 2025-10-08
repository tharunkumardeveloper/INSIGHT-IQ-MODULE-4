import React from 'react'
import { ExternalLink, Calendar, User, MessageSquare } from 'lucide-react'

const CSVViewer = ({ data, type, limit = 10 }) => {
  const displayData = data.slice(0, limit)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getSentimentBadge = (score) => {
    if (!score && score !== 0) return null
    
    const numScore = parseFloat(score)
    if (numScore > 0.1) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">Positive</span>
    } else if (numScore < -0.1) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs">Negative</span>
    } else {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-xs">Neutral</span>
    }
  }

  if (!displayData.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {displayData.map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {type === 'news' ? (
            <div>
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                  {item.title || 'No title'}
                </h4>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                {item.summary || item.content || 'No summary available'}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">{item.source || 'Unknown'}</span>
                </div>
                {getSentimentBadge(item.sentiment_score)}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-gray-900 dark:text-white line-clamp-3">
                  {item.text || 'No content'}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User size={12} />
                    <span>{item.handle || item.platform || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={12} />
                    <span>{(item.likes || 0) + (item.shares || item.retweets || 0) + (item.comments || 0)} eng.</span>
                  </div>
                </div>
                {getSentimentBadge(item.sentiment_score)}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {data.length > limit && (
        <div className="text-center py-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Showing {limit} of {data.length} items
          </span>
        </div>
      )}
    </div>
  )
}

export default CSVViewer