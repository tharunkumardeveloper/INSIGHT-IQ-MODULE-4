import React from 'react'
import { Heart, MessageCircle, Share, Calendar, TrendingUp, TrendingDown, Activity, Award } from 'lucide-react'

const SocialCard = ({ post, rank }) => {
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

  const totalEngagement = (post.likes || 0) + (post.shares || post.retweets || 0) + (post.comments || 0)

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-start space-x-3">
        {rank && (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            {rank <= 3 ? (
              <Award size={16} className={`${
                rank === 1 ? 'text-yellow-600' : 
                rank === 2 ? 'text-gray-600' : 
                'text-orange-600'
              }`} />
            ) : (
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {rank}
              </span>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {post.handle && post.handle !== 'Unknown' && (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {post.handle}
                </span>
              )}
              {post.platform && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                  {post.platform}
                </span>
              )}
            </div>
            {getSentimentBadge(post.sentiment_score)}
          </div>

          <p className="text-gray-900 dark:text-white text-sm mb-3 line-clamp-4">
            {post.text || 'No content available'}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formatDate(post.date)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              {post.likes !== undefined && (
                <div className="flex items-center space-x-1 text-red-500">
                  <Heart size={14} />
                  <span>{post.likes.toLocaleString()}</span>
                </div>
              )}
              
              {(post.shares !== undefined || post.retweets !== undefined) && (
                <div className="flex items-center space-x-1 text-green-500">
                  <Share size={14} />
                  <span>{(post.shares || post.retweets || 0).toLocaleString()}</span>
                </div>
              )}
              
              {post.comments !== undefined && (
                <div className="flex items-center space-x-1 text-blue-500">
                  <MessageCircle size={14} />
                  <span>{post.comments.toLocaleString()}</span>
                </div>
              )}

              {totalEngagement > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  Total: {totalEngagement.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialCard