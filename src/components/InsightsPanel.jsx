import React, { useMemo } from 'react'
import { TrendingUp, Eye, Calendar, Target, AlertCircle } from 'lucide-react'

const InsightsPanel = ({ newsData, socialData }) => {
  const insights = useMemo(() => {
    const results = []

    if (!newsData?.data && !socialData?.data) {
      return results
    }

    // Analyze trending keywords from last 30 days
    if (newsData?.data) {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const recentNews = newsData.data.filter(item => 
        item.date && new Date(item.date) >= thirtyDaysAgo
      )

      if (recentNews.length > 0) {
        const keywordMap = new Map()
        
        recentNews.forEach(item => {
          if (item.title) {
            const words = item.title.toLowerCase()
              .replace(/[^\w\s]/g, ' ')
              .split(/\s+/)
              .filter(word => word.length > 4 && !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'said', 'says', 'more', 'than', 'also', 'just', 'only', 'very', 'well', 'much', 'many', 'most', 'some', 'such', 'even', 'still', 'like', 'back', 'good', 'best', 'first', 'last', 'next', 'year', 'years', 'time', 'week', 'month', 'today', 'company', 'companies', 'business', 'market', 'industry'].includes(word))

            words.forEach(word => {
              keywordMap.set(word, (keywordMap.get(word) || 0) + 1)
            })
          }
        })

        const topKeywords = Array.from(keywordMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)

        if (topKeywords.length > 0) {
          results.push({
            id: 'trending_keywords',
            type: 'trending',
            title: 'Trending Keywords',
            description: `Top trending topics: ${topKeywords.map(([word, count]) => `${word} (${count})`).join(', ')}`,
            icon: TrendingUp,
            color: 'text-green-600 dark:text-green-400'
          })
        }
      }
    }

    // Analyze sentiment trends
    if (newsData?.data || socialData?.data) {
      const allData = [...(newsData?.data || []), ...(socialData?.data || [])]
      const recentData = allData.filter(item => {
        if (!item.date) return false
        const itemDate = new Date(item.date)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        return itemDate >= sevenDaysAgo
      })

      if (recentData.length > 0) {
        const avgSentiment = recentData.reduce((sum, item) => sum + (item.sentiment_score || 0), 0) / recentData.length
        
        if (avgSentiment > 0.2) {
          results.push({
            id: 'positive_sentiment',
            type: 'sentiment',
            title: 'Positive Sentiment Trend',
            description: `Overall sentiment is positive (${avgSentiment.toFixed(2)}) across ${recentData.length} recent mentions`,
            icon: TrendingUp,
            color: 'text-green-600 dark:text-green-400'
          })
        } else if (avgSentiment < -0.2) {
          results.push({
            id: 'negative_sentiment',
            type: 'sentiment',
            title: 'Negative Sentiment Alert',
            description: `Overall sentiment is negative (${avgSentiment.toFixed(2)}) across ${recentData.length} recent mentions`,
            icon: AlertCircle,
            color: 'text-red-600 dark:text-red-400'
          })
        }
      }
    }

    // Analyze engagement patterns
    if (socialData?.data) {
      const postsWithEngagement = socialData.data.filter(post => 
        (post.likes || 0) + (post.shares || post.retweets || 0) + (post.comments || 0) > 0
      )

      if (postsWithEngagement.length > 0) {
        const avgEngagement = postsWithEngagement.reduce((sum, post) => 
          sum + (post.likes || 0) + (post.shares || post.retweets || 0) + (post.comments || 0), 0
        ) / postsWithEngagement.length

        results.push({
          id: 'engagement_insight',
          type: 'engagement',
          title: 'Engagement Analysis',
          description: `Average engagement is ${avgEngagement.toFixed(1)} per post across ${postsWithEngagement.length} posts`,
          icon: Eye,
          color: 'text-blue-600 dark:text-blue-400'
        })
      }
    }

    // Volume analysis
    if (newsData?.data) {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const todayNews = newsData.data.filter(item => {
        if (!item.date) return false
        const itemDate = new Date(item.date)
        return itemDate.toDateString() === today.toDateString()
      })

      const yesterdayNews = newsData.data.filter(item => {
        if (!item.date) return false
        const itemDate = new Date(item.date)
        return itemDate.toDateString() === yesterday.toDateString()
      })

      if (todayNews.length > yesterdayNews.length * 1.5 && yesterdayNews.length > 0) {
        results.push({
          id: 'volume_spike',
          type: 'volume',
          title: 'News Volume Spike',
          description: `${todayNews.length} articles today vs ${yesterdayNews.length} yesterday (${((todayNews.length / yesterdayNews.length - 1) * 100).toFixed(0)}% increase)`,
          icon: Target,
          color: 'text-orange-600 dark:text-orange-400'
        })
      }
    }

    // Market activity insight
    const totalNews = newsData?.data?.length || 0
    const totalSocial = socialData?.data?.length || 0
    
    if (totalNews > 0 || totalSocial > 0) {
      results.push({
        id: 'market_activity',
        type: 'activity',
        title: 'Market Activity Overview',
        description: `Tracking ${totalNews} news articles and ${totalSocial} social posts for comprehensive market intelligence`,
        icon: Calendar,
        color: 'text-purple-600 dark:text-purple-400'
      })
    }

    return results.slice(0, 5) // Top 5 insights
  }, [newsData, socialData])

  if (insights.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Market Insights</h3>
        <p className="text-gray-500 dark:text-gray-400">
          No insights available. Data analysis will appear here as more information becomes available.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Market Insights</h3>
      <div className="space-y-4">
        {insights.map((insight) => {
          const IconComponent = insight.icon
          return (
            <div key={insight.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`flex-shrink-0 ${insight.color}`}>
                <IconComponent size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {insight.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InsightsPanel