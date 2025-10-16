import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, MessageCircle, Share, TrendingUp, TrendingDown } from 'lucide-react'
import { useData } from '../context/DataContext'
import LoadingSpinner from '../components/LoadingSpinner'
import SocialBuzzTrendChart from '../components/charts/SocialBuzzTrendChart'
import SentimentByPlatformChart from '../components/charts/SentimentByPlatformChart'
import EngagementVsSentimentChart from '../components/charts/EngagementVsSentimentChart'
import ShareOfVoiceChart from '../components/charts/ShareOfVoiceChart'
import SocialCard from '../components/SocialCard'
import SocialFilters from '../components/SocialFilters'

const Social = () => {
  const { domainKey } = useParams()
  const { fetchData, isLoading } = useData()
  const [socialData, setSocialData] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [filteredSocial, setFilteredSocial] = useState([])
  const [filters, setFilters] = useState({
    platform: 'all',
    sentiment: 'all',
    dateRange: 'all',
    competitor: 'all'
  })

  // Reset component state when domain changes
  useEffect(() => {
    setSocialData(null)
    setDashboardData(null)
    setFilteredSocial([])
  }, [domainKey])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [social, dashboard] = await Promise.all([
          fetchData(`http://localhost:8002/api/data/${domainKey}/social`, `social_${domainKey}`),
          fetchData(`http://localhost:8002/api/dashboard/${domainKey}`, `dashboard_${domainKey}`)
        ])
        setSocialData(social)
        setDashboardData(dashboard)
        setFilteredSocial(social.data || [])
      } catch (error) {
        console.error('Error loading social data:', error)
      }
    }

    if (domainKey) {
      loadData()
    }
  }, [domainKey, fetchData])

  useEffect(() => {
    if (!socialData?.data) return

    let filtered = [...socialData.data]

    // Apply filters
    if (filters.platform !== 'all') {
      filtered = filtered.filter(item => item.platform?.toLowerCase() === filters.platform.toLowerCase())
    }

    if (filters.sentiment !== 'all') {
      if (filters.sentiment === 'positive') {
        filtered = filtered.filter(item => item.sentiment_score > 0.1)
      } else if (filters.sentiment === 'negative') {
        filtered = filtered.filter(item => item.sentiment_score < -0.1)
      } else if (filters.sentiment === 'neutral') {
        filtered = filtered.filter(item => item.sentiment_score >= -0.1 && item.sentiment_score <= 0.1)
      }
    }

    if (filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange)
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      filtered = filtered.filter(item => new Date(item.date) >= cutoff)
    }

    if (filters.competitor !== 'all') {
      filtered = filtered.filter(item => 
        item.text?.toLowerCase().includes(filters.competitor.toLowerCase())
      )
    }

    // Sort by engagement (likes + shares + comments)
    filtered.sort((a, b) => {
      const engagementA = (a.likes || 0) + (a.shares || 0) + (a.retweets || 0) + (a.comments || 0)
      const engagementB = (b.likes || 0) + (b.shares || 0) + (b.retweets || 0) + (b.comments || 0)
      return engagementB - engagementA
    })

    setFilteredSocial(filtered)
  }, [socialData, filters])

  if (isLoading(`social_${domainKey}`) || !socialData) {
    return <LoadingSpinner />
  }

  const topPosts = filteredSocial.slice(0, 10)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Social Media Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Social media mentions, engagement trends, and influencer insights
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <SocialFilters 
          filters={filters} 
          onFiltersChange={setFilters} 
          socialData={socialData}
          competitors={dashboardData?.competitors || []}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Buzz & Sentiment Trend</h3>
          <SocialBuzzTrendChart socialData={socialData} competitors={dashboardData?.competitors || []} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sentiment by Platform</h3>
          <SentimentByPlatformChart socialData={socialData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engagement vs Sentiment</h3>
          <EngagementVsSentimentChart socialData={socialData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share of Voice</h3>
          <ShareOfVoiceChart socialData={socialData} competitors={dashboardData?.competitors || []} />
        </div>
      </div>

      {/* Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Engaging Posts
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {topPosts.map((post, index) => (
              <SocialCard key={index} post={post} rank={index + 1} />
            ))}
            {topPosts.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No posts match your current filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Engagement Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Engagement Summary
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Posts</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {filteredSocial.length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Likes</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {filteredSocial.reduce((sum, post) => sum + (post.likes || 0), 0).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Shares</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {filteredSocial.reduce((sum, post) => sum + (post.shares || post.retweets || 0), 0).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Comments</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {filteredSocial.reduce((sum, post) => sum + (post.comments || 0), 0).toLocaleString()}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Avg Sentiment</span>
                  <span className={`text-lg font-semibold ${
                    socialData.metrics?.avg_sentiment > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {socialData.metrics?.avg_sentiment?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Posts Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Posts ({filteredSocial.length})
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Sorted by engagement
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
          {filteredSocial.slice(0, 100).map((post, index) => (
            <SocialCard key={index} post={post} />
          ))}
          
          {filteredSocial.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No social posts match your current filters.
              </p>
            </div>
          )}
        </div>

        {filteredSocial.length > 100 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing first 100 results. Use filters to narrow down your search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Social