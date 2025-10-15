import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const SentimentByPlatformChart = ({ socialData }) => {
  const chartData = useMemo(() => {
    const platformData = new Map()
    const data = socialData?.data || []
    
    // Process data by platform and sentiment
    data.forEach(item => {
      if (item.source) {
        const platform = item.source.toLowerCase()
        
        // Determine sentiment from score if label is missing
        let sentiment = 'neutral'
        if (item.sentiment_label) {
          sentiment = item.sentiment_label.toLowerCase()
        } else if (item.sentiment_score !== undefined) {
          const score = parseFloat(item.sentiment_score)
          if (score > 0.1) sentiment = 'positive'
          else if (score < -0.1) sentiment = 'negative'
          else sentiment = 'neutral'
        }
        
        if (!platformData.has(platform)) {
          platformData.set(platform, {
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            positive: 0,
            neutral: 0,
            negative: 0,
            total: 0
          })
        }
        
        const data = platformData.get(platform)
        data[sentiment] = (data[sentiment] || 0) + 1
        data.total += 1
      }
    })
    
    // Convert to percentages
    return Array.from(platformData.values()).map(data => ({
      platform: data.platform,
      positive: ((data.positive / data.total) * 100).toFixed(1),
      neutral: ((data.neutral / data.total) * 100).toFixed(1),
      negative: ((data.negative / data.total) * 100).toFixed(1),
      positiveCount: data.positive,
      neutralCount: data.neutral,
      negativeCount: data.negative,
      total: data.total
    }))
  }, [socialData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          <p className="text-sm text-green-600">Positive: {data.positiveCount} ({data.positive}%)</p>
          <p className="text-sm text-gray-600">Neutral: {data.neutralCount} ({data.neutral}%)</p>
          <p className="text-sm text-red-600">Negative: {data.negativeCount} ({data.negative}%)</p>
          <p className="text-sm text-gray-500">Total: {data.total}</p>
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No platform sentiment data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="platform" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="positive" stackId="a" fill="#10B981" name="Positive" />
          <Bar dataKey="neutral" stackId="a" fill="#6B7280" name="Neutral" />
          <Bar dataKey="negative" stackId="a" fill="#EF4444" name="Negative" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SentimentByPlatformChart