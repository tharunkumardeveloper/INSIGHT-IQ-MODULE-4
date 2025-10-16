import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TrendingUp, TrendingDown, Users, FileText, MessageSquare, Activity, RefreshCw, AlertCircle } from 'lucide-react'
import { useData } from '../context/DataContext'
import CompetitorCard from '../components/CompetitorCard'
import SentimentChart from '../components/charts/SentimentChart'
import MentionsChart from '../components/charts/MentionsChart'
import NewsVolumeChart from '../components/charts/NewsVolumeChart'
import SentimentDistributionChart from '../components/charts/SentimentDistributionChart'
import CSVViewer from '../components/CSVViewer'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { domainKey } = useParams()
  const { fetchData, isLoading, refreshData } = useData()
  const [dashboardData, setDashboardData] = useState(null)
  const [newsData, setNewsData] = useState(null)
  const [socialData, setSocialData] = useState(null)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Reset component state when domain changes
  useEffect(() => {
    setDashboardData(null)
    setNewsData(null)
    setSocialData(null)
    setError(null)
  }, [domainKey])

  const generateSampleData = (domainKey) => {
    const now = new Date()
    const companies = ['OpenAI', 'Anthropic', 'DeepMind', 'Hugging Face', 'Stability AI']
    
    const sampleNews = Array.from({ length: 30 }, (_, i) => ({
      company: companies[i % companies.length],
      title: `Sample news article ${i + 1}`,
      published_at: new Date(now - i * 24 * 60 * 60 * 1000).toISOString(),
      sentiment_score: (Math.random() - 0.5) * 1.5,
      mention_count: Math.floor(Math.random() * 50) + 10
    }))
    
    const sampleSocial = Array.from({ length: 50 }, (_, i) => ({
      company: companies[i % companies.length],
      text: `Sample social post ${i + 1}`,
      published_at: new Date(now - i * 12 * 60 * 60 * 1000).toISOString(),
      sentiment_score: (Math.random() - 0.5) * 1.5,
      source: ['twitter', 'reddit', 'linkedin'][i % 3],
      mention_count: Math.floor(Math.random() * 20) + 5
    }))
    
    return {
      news: { data: sampleNews, metrics: { total_count: sampleNews.length, avg_sentiment: 0.3 } },
      social: { data: sampleSocial, metrics: { total_count: sampleSocial.length, avg_sentiment: 0.2 } }
    }
  }

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true)
      refreshData(domainKey)
    }
    
    setError(null)
    
    try {
      const [dashboard, news, social] = await Promise.all([
        fetchData(`http://localhost:8002/api/dashboard/${domainKey}`, `dashboard_${domainKey}`),
        fetchData(`http://localhost:8002/api/data/${domainKey}/news`, `news_${domainKey}`),
        fetchData(`http://localhost:8002/api/data/${domainKey}/social`, `social_${domainKey}`)
      ])
      
      setDashboardData(dashboard)
      
      // If no data from API, use sample data for charts
      if (!news?.data?.length || !social?.data?.length) {
        const sampleData = generateSampleData(domainKey)
        setNewsData(news?.data?.length ? news : sampleData.news)
        setSocialData(social?.data?.length ? social : sampleData.social)
      } else {
        setNewsData(news)
        setSocialData(social)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Use sample data on error
      const sampleData = generateSampleData(domainKey)
      setNewsData(sampleData.news)
      setSocialData(sampleData.social)
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

  if (isLoading(`dashboard_${domainKey}`) || isLoading(`news_${domainKey}`) || isLoading(`social_${domainKey}`)) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Failed to Load Dashboard
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

  if (!dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            No Dashboard Data Available
          </h3>
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

  const { domain, competitors, overall_sentiment, total_news, total_social } = dashboardData

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.1) return 'text-green-600 dark:text-green-400'
    if (sentiment < -0.1) return 'text-red-600 dark:text-red-400'
    return 'text-yellow-600 dark:text-yellow-400'
  }

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.1) return <TrendingUp size={20} />
    if (sentiment < -0.1) return <TrendingDown size={20} />
    return <Activity size={20} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-4xl">{domain.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {domain.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {competitors.length} competitors tracked
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Sentiment</p>
                <p className={`text-2xl font-bold ${getSentimentColor(overall_sentiment)}`}>
                  {overall_sentiment.toFixed(2)}
                </p>
              </div>
              <div className={getSentimentColor(overall_sentiment)}>
                {getSentimentIcon(overall_sentiment)}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">News Articles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{total_news}</p>
              </div>
              <FileText className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Social Mentions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{total_social}</p>
              </div>
              <MessageSquare className="text-green-600 dark:text-green-400" size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Competitors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{competitors.length}</p>
              </div>
              <Users className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Competitors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {competitors.map((competitor, index) => (
            <CompetitorCard
              key={index}
              competitor={competitor}
              domainKey={domainKey}
            />
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sentiment Over Time</h3>
          <SentimentChart newsData={newsData} socialData={socialData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mentions by Competitor</h3>
          <MentionsChart competitors={competitors} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">News Volume Over Time</h3>
          <NewsVolumeChart newsData={newsData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sentiment Distribution</h3>
          <SentimentDistributionChart newsData={newsData} socialData={socialData} />
        </div>
      </div>

      {/* CSV Data Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent News</h3>
          <CSVViewer data={newsData?.data || []} type="news" limit={10} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Social Posts</h3>
          <CSVViewer data={socialData?.data || []} type="social" limit={10} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard