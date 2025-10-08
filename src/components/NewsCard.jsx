import React from 'react'
import { ExternalLink, Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react'

const NewsCard = ({ article }) => {
  const getSentimentBadge = (score) => {
    if (!score && score !== 0) return null
    
    const numScore = parseFloat(score)
    if (numScore > 0.1) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <TrendingUp size={12} className="mr-1" />
          Positive
        </span>
      )
    } else if (numScore < -0.1) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <TrendingDown size={12} className="mr-1" />
          Negative
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          <Activity size={12} className="mr-1" />
          Neutral
        </span>
      )
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = (now - date) / (1000 * 60 * 60)

      if (diffInHours < 1) {
        return 'Just now'
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hours ago`
      } else if (diffInHours < 48) {
        return 'Yesterday'
      } else {
        return date.toLocaleDateString()
      }
    } catch {
      return dateString
    }
  }

  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2 pr-4">
              {article.title || 'No title available'}
            </h4>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                title="Read full article"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
            {article.summary || article.content || 'No summary available'}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formatDate(article.date)}</span>
              </div>
              
              <span className="text-gray-400">•</span>
              
              <span>{article.source || 'Unknown source'}</span>
              
              {article.category && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {article.category}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {getSentimentBadge(article.sentiment_score)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsCard