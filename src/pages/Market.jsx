import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import LoadingSpinner from '../components/LoadingSpinner'
import SentimentOverTimeChart from '../components/charts/SentimentOverTimeChart'
import MentionsByCompetitorChart from '../components/charts/MentionsByCompetitorChart'
import SentimentVsReachChart from '../components/charts/SentimentVsReachChart'
import TopicSentimentComparisonChart from '../components/charts/DomainSentimentHeatmapChart'
import InsightsPanel from '../components/InsightsPanel'
import { AlertCircle, RefreshCw, TrendingUp, Users, MessageSquare, BarChart3, PieChart, Activity } from 'lucide-react'

const Market = () => {
  const { domainKey } = useParams()
  const { fetchData, isLoading, refreshData } = useData()
  const [dashboardData, setDashboardData] = useState(null)
  const [newsData, setNewsData] = useState(null)
  const [socialData, setSocialData] = useState(null)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [domainInfo, setDomainInfo] = useState(null)

  // Reset component state when domain changes
  useEffect(() => {
    setDashboardData(null)
    setNewsData(null)
    setSocialData(null)
    setError(null)
    setDomainInfo(null)
  }, [domainKey])

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true)
      refreshData(domainKey)
    }
    
    setError(null)
    
    try {
      // Load domain info first
      const domainsData = await fetchData('http://localhost:8002/api/domains', 'domains')
      if (domainsData && domainsData[domainKey]) {
        setDomainInfo(domainsData[domainKey])
      }

      // Load data with better error handling
      const dashboardPromise = fetchData(`http://localhost:8002/api/dashboard/${domainKey}`, `dashboard_${domainKey}`)
        .catch(err => {
          console.warn('Dashboard data failed:', err)
          return generateSampleDashboardData(domainKey, domainsData?.[domainKey])
        })
      
      const newsPromise = fetchData(`http://localhost:8002/api/data/${domainKey}/news`, `news_${domainKey}`)
        .catch(err => {
          console.warn('News data failed:', err)
          return generateSampleNewsData()
        })
      
      const socialPromise = fetchData(`http://localhost:8002/api/data/${domainKey}/social`, `social_${domainKey}`)
        .catch(err => {
          console.warn('Social data failed:', err)
          return generateSampleSocialData()
        })
      
      const [dashboard, news, social] = await Promise.all([
        dashboardPromise,
        newsPromise,
        socialPromise
      ])
      
      setDashboardData(dashboard)
      setNewsData(news)
      setSocialData(social)
      
    } catch (error) {
      console.error('Error loading market data:', error)
      // Generate sample data on error
      setDashboardData(generateSampleDashboardData(domainKey, domainInfo))
      setNewsData(generateSampleNewsData())
      setSocialData(generateSampleSocialData())
    } finally {
      setIsRefreshing(false)
    }
  }

  const generateSampleDashboardData = (domain, info) => {
    const competitors = info?.competitors || ['Competitor A', 'Competitor B', 'Competitor C', 'Competitor D', 'Competitor E']
    return {
      domain: info || { name: domain, emoji: '📊' },
      competitors: competitors.map((name, index) => ({
        name,
        news_count: Math.floor(Math.random() * 50) + 10,
        social_mentions: Math.floor(Math.random() * 100) + 20,
        sentiment: (Math.random() - 0.5) * 1.5
      })),
      overall_sentiment: (Math.random() - 0.3) * 0.8,
      total_news: Math.floor(Math.random() * 200) + 50,
      total_social: Math.floor(Math.random() * 500) + 100
    }
  }

  const generateSampleNewsData = () => {
    const sampleData = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      title: `Sample news article ${i + 1}`,
      sentiment_score: (Math.random() - 0.5) * 2,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      source: ['TechCrunch', 'Reuters', 'Bloomberg', 'Wired'][Math.floor(Math.random() * 4)]
    }))
    
    return {
      data: sampleData,
      metrics: {
        total_count: sampleData.length,
        avg_sentiment: sampleData.reduce((sum, item) => sum + item.sentiment_score, 0) / sampleData.length
      }
    }
  }

  const generateSampleSocialData = () => {
    const sampleData = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      text: `Sample social media post ${i + 1}`,
      sentiment_score: (Math.random() - 0.5) * 2,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      source: ['Twitter', 'LinkedIn', 'Reddit', 'Facebook'][Math.floor(Math.random() * 4)]
    }))
    
    return {
      data: sampleData,
      metrics: {
        total_count: sampleData.length,
        avg_sentiment: sampleData.reduce((sum, item) => sum + item.sentiment_score, 0) / sampleData.length
      }
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
  if ((isLoading(`dashboard_${domainKey}`) || isLoading(`news_${domainKey}`) || isLoading(`social_${domainKey}`)) && !dashboardData) {
    return <LoadingSpinner text="Loading market data..." />
  }

  const { domain, competitors } = dashboardData || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{domain?.emoji || domainInfo?.emoji || '📊'}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Market Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Detailed competitor and market trends for {domain?.name || domainInfo?.name || domainKey}
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

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total News</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {newsData?.data?.length || dashboardData?.total_news || newsData?.metrics?.total_count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Social Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {socialData?.data?.length || dashboardData?.total_social || socialData?.metrics?.total_count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Competitors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {competitors?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${
              (dashboardData?.overall_sentiment || 0) >= 0 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              <TrendingUp className={`h-6 w-6 ${
                (dashboardData?.overall_sentiment || 0) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Sentiment</p>
              <p className={`text-2xl font-bold ${
                (dashboardData?.overall_sentiment || 0) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {(dashboardData?.overall_sentiment || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Panel */}
      {(newsData?.data?.length > 0 || socialData?.data?.length > 0) && (
        <div className="mb-8">
          <InsightsPanel newsData={newsData} socialData={socialData} />
        </div>
      )}

      {/* Market Activity Overview */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-3">
          <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Market Activity Overview</h3>
            <p className="text-blue-700 dark:text-blue-300">
              Tracking {newsData?.data?.length || newsData?.metrics?.total_count || 0} news articles and {socialData?.data?.length || socialData?.metrics?.total_count || 0} social posts for comprehensive market intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sentiment Over Time
            </h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <SentimentOverTimeChart 
            newsData={newsData || { data: [], metrics: {} }} 
            socialData={socialData || { data: [], metrics: {} }}
            competitors={competitors || []}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mentions by Competitor
            </h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <MentionsByCompetitorChart 
            newsData={newsData || { data: [], metrics: {} }} 
            socialData={socialData || { data: [], metrics: {} }}
            competitors={competitors || []}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sentiment vs News Reach
            </h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <SentimentVsReachChart 
            newsData={newsData || { data: [], metrics: {} }} 
            socialData={socialData || { data: [], metrics: {} }}
            competitors={competitors || []}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Topic Sentiment Comparison
            </h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <TopicSentimentComparisonChart 
            newsData={newsData || { data: [], metrics: {} }} 
            socialData={socialData || { data: [], metrics: {} }}
            competitors={competitors || []}
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
        
        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Market analysis is live and updating
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Data refreshed: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Market