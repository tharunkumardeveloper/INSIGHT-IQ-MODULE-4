import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const SentimentChart = ({ newsData, socialData }) => {
  const chartData = useMemo(() => {
    const dataMap = new Map()

    // Process news data
    if (newsData?.data) {
      newsData.data.forEach(item => {
        if (item.date && item.sentiment_score !== undefined) {
          const date = new Date(item.date).toISOString().split('T')[0]
          if (!dataMap.has(date)) {
            dataMap.set(date, { date, news: [], social: [] })
          }
          dataMap.get(date).news.push(item.sentiment_score)
        }
      })
    }

    // Process social data
    if (socialData?.data) {
      socialData.data.forEach(item => {
        if (item.date && item.sentiment_score !== undefined) {
          const date = new Date(item.date).toISOString().split('T')[0]
          if (!dataMap.has(date)) {
            dataMap.set(date, { date, news: [], social: [] })
          }
          dataMap.get(date).social.push(item.sentiment_score)
        }
      })
    }

    // Calculate averages and format for chart
    const result = Array.from(dataMap.values())
      .map(item => ({
        date: item.date,
        news: item.news.length > 0 ? item.news.reduce((a, b) => a + b, 0) / item.news.length : null,
        social: item.social.length > 0 ? item.social.reduce((a, b) => a + b, 0) / item.social.length : null,
        combined: [...item.news, ...item.social].length > 0 
          ? [...item.news, ...item.social].reduce((a, b) => a + b, 0) / [...item.news, ...item.social].length 
          : null
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30) // Last 30 days

    return result
  }, [newsData, socialData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toFixed(3)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No sentiment data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            domain={[-1, 1]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="news" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="News Sentiment"
            connectNulls={false}
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="social" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Social Sentiment"
            connectNulls={false}
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="combined" 
            stroke="#F59E0B" 
            strokeWidth={2}
            name="Combined"
            connectNulls={false}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SentimentChart