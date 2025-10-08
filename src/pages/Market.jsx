import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import LoadingSpinner from '../components/LoadingSpinner'
import MultiSeriesLineChart from '../components/charts/MultiSeriesLineChart'
import HorizontalBarChart from '../components/charts/HorizontalBarChart'
import TreemapChart from '../components/charts/TreemapChart'
import ScatterChart from '../components/charts/ScatterChart'
import InsightsPanel from '../components/InsightsPanel'
import { AlertCircle, RefreshCw } from 'lucide-react'

const Market = () => {
  const { domainKey } = useParams()
  const { fetchData, isLoading, refreshData } = useData()
  const [dashboardData, setDashboardData] = useState(null)
  const [newsData, setNewsData] = useState(null)
  const [socialData, setSocialData] = useState(null)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true)
      refreshData(domainKey)
    }
    
    setError(null)
    
    try {
      // Load data with better error handling
      const dashboardPromise = fetchData(`http://localhost:8000/api/dashboard/${domainKey}`, `dashboard_${domainKey}`)
        .catch(err => {
          console.warn('Dashboard data failed:', err)
          return null
        })
      
      const newsPromise = fetchData(`http://localhost:8000/api/data/${domainKey}/news`, `news_${domainKey}`)
        .catch(err => {
          console.warn('News data failed:', err)
          return { data: [], metrics: {} }
        })
      
      const socialPromise = fetchData(`http://localhost:8000/api/data/${domainKey}/social`, `social_${domainKey}`)
        .catch(err => {
          console.warn('Social data failed:', err)
          return { data: [], metrics: {} }
        })
      
      const [dashboard, news, social] = await Promise.all([
        dashboardPromise,
        newsPromise,
        socialPromise
      ])
      
      setDashboardData(dashboard)
      setNewsData(news)
      setSocialData(social)
      
      // If all data failed to load, show error
      if (!dashboard && (!news || !news.data.length) && (!social || !social.data.length)) {
        throw new Error('No data could be loaded for this domain')
      }
      
    } catch (error) {
      console.error('Error loading market data:', error)
      setError(error.message)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (domainKey) {
      loadData()
    }
  }, [domainKey])

  const handleRefresh = () => {
    loadData(true)
  }

  // Show loading spinner while any data is loading
  if (isLoading(`dashboard_${domainKey}`) || isLoading(`news_${domainKey}`) || isLoading(`social_${domainKey}`)) {
    return <LoadingSpinner text="Loading market data..." />
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Failed to Load Market Data
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show message if no data loaded
  if (!dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Loading Market Data
          </h3>
          <p className="text-yellow-600 dark:text-yellow-300 mb-4">
            Preparing market analysis for this domain...
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>
    )
  }

  const { domain, competitors } = dashboardData

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{domain.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Market Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Detailed competitor and market trends for {domain.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="mb-8">
        <InsightsPanel newsData={newsData} socialData={socialData} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Multi-Series Competitor Trends
          </h3>
          <MultiSeriesLineChart 
            competitors={competitors || []} 
            newsData={newsData || { data: [], metrics: {} }} 
            socialData={socialData || { data: [], metrics: {} }} 
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Market Share Analysis
          </h3>
          <HorizontalBarChart competitors={competitors || []} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Topic Distribution
          </h3>
          <TreemapChart newsData={newsData || { data: [], metrics: {} }} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sentiment vs Engagement
          </h3>
          <ScatterChart 
            competitors={competitors || []} 
            socialData={socialData || { data: [], metrics: {} }} 
          />
        </div>
      </div>

      {/* Market Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Market Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Top Performers</h4>
            <div className="space-y-2">
              {competitors && competitors.length > 0 ? (
                competitors
                  .sort((a, b) => (b.news_count + b.social_mentions) - (a.news_count + a.social_mentions))
                  .slice(0, 3)
                  .map((competitor, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{competitor.name}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {(competitor.news_count || 0) + (competitor.social_mentions || 0)} mentions
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading competitor data...</div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sentiment Leaders</h4>
            <div className="space-y-2">
              {competitors && competitors.length > 0 ? (
                competitors
                  .sort((a, b) => (b.sentiment || 0) - (a.sentiment || 0))
                  .slice(0, 3)
                  .map((competitor, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{competitor.name}</span>
                      <span className={`text-sm font-medium ${
                        (competitor.sentiment || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {(competitor.sentiment || 0).toFixed(2)}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading sentiment data...</div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Market Activity</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total News</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {newsData?.data?.length || dashboardData?.total_news || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Social</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {socialData?.data?.length || dashboardData?.total_social || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Avg Sentiment</span>
                <span className={`text-sm font-medium ${
                  (dashboardData?.overall_sentiment || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {(dashboardData?.overall_sentiment || 
                    ((newsData?.metrics?.avg_sentiment || 0) + (socialData?.metrics?.avg_sentiment || 0)) / 2 || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Market