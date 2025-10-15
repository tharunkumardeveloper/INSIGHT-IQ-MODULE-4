import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Filter, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import { useData } from '../context/DataContext'
import LoadingSpinner from '../components/LoadingSpinner'
import NewsVolumeChart from '../components/charts/NewsVolumeChart'
import SentimentDistributionChart from '../components/charts/SentimentDistributionChart'
import TopicTrendsChart from '../components/charts/TopicTrendsChart'
import NewsCard from '../components/NewsCard'
import NewsFilters from '../components/NewsFilters'

const News = () => {
  const { domainKey } = useParams()
  const { fetchData, isLoading } = useData()
  const [newsData, setNewsData] = useState(null)
  const [filteredNews, setFilteredNews] = useState([])
  const [filters, setFilters] = useState({
    dateRange: 'all',
    sentiment: 'all',
    source: 'all',
    keywords: ''
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const news = await fetchData(`http://localhost:8002/api/data/${domainKey}/news`, `news_${domainKey}`)
        setNewsData(news)
        setFilteredNews(news.data || [])
      } catch (error) {
        console.error('Error loading news data:', error)
      }
    }

    if (domainKey) {
      loadData()
    }
  }, [domainKey, fetchData])

  useEffect(() => {
    if (!newsData?.data) return

    let filtered = [...newsData.data]

    // Apply filters
    if (filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange)
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      filtered = filtered.filter(item => new Date(item.date) >= cutoff)
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

    if (filters.source !== 'all') {
      filtered = filtered.filter(item => item.source === filters.source)
    }

    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase()
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(keywords) ||
        item.summary?.toLowerCase().includes(keywords) ||
        item.content?.toLowerCase().includes(keywords)
      )
    }

    setFilteredNews(filtered)
  }, [newsData, filters])

  if (isLoading(`news_${domainKey}`) || !newsData) {
    return <LoadingSpinner />
  }

  const getSentimentBadge = (score) => {
    if (score > 0.1) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <TrendingUp size={12} className="mr-1" />
          Positive
        </span>
      )
    } else if (score < -0.1) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <TrendingDown size={12} className="mr-1" />
          Negative
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          Neutral
        </span>
      )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          News Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Latest news coverage and sentiment analysis
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <NewsFilters filters={filters} onFiltersChange={setFilters} newsData={newsData} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">News Volume</h3>
          <NewsVolumeChart newsData={newsData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sentiment Distribution</h3>
          <SentimentDistributionChart newsData={newsData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trending Topics</h3>
          <TopicTrendsChart newsData={newsData} />
        </div>
      </div>

      {/* News Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent News ({filteredNews.length})
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredNews.length} of {newsData.data?.length || 0} articles
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredNews.slice(0, 50).map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
          
          {filteredNews.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No news articles match your current filters.
              </p>
            </div>
          )}
        </div>

        {filteredNews.length > 50 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing first 50 results. Use filters to narrow down your search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default News