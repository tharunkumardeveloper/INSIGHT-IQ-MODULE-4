import React, { useMemo } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const EngagementVsSentimentChart = ({ socialData }) => {
  const chartData = useMemo(() => {
    const data = socialData?.data || []
    
    return data
      .map(item => {
        if (item.sentiment_score === undefined) return null
        
        let engagement = 0
        let platform = item.source || 'unknown'
        
        // Extract engagement from raw_json
        try {
          if (item.raw_json) {
            const rawData = typeof item.raw_json === 'string' ? JSON.parse(item.raw_json) : item.raw_json
            if (rawData.engagement_metrics) {
              const metrics = rawData.engagement_metrics
              engagement = (metrics.likes || 0) + (metrics.shares || 0) + (metrics.comments || 0)
            }
          }
        } catch (e) {
          // Fallback to mention_count if available
          engagement = parseInt(item.mention_count || 0)
        }
        
        return {
          sentiment: parseFloat(item.sentiment_score),
          engagement: engagement,
          platform: platform.toLowerCase(),
          text: item.text || item.title || '',
          url: item.url || '',
          mentions: parseInt(item.mention_count || 1)
        }
      })
      .filter(item => item !== null && item.engagement > 0)
      .slice(0, 100) // Limit to 100 points for performance
  }, [socialData])

  const getPlatformColor = (platform) => {
    const colors = {
      twitter: '#1DA1F2',
      reddit: '#FF4500',
      linkedin: '#0077B5',
      facebook: '#1877F2',
      instagram: '#E4405F'
    }
    return colors[platform] || '#6B7280'
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-w-xs">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2 capitalize">{data.platform}</p>
          <p className="text-sm text-blue-600">Sentiment: {data.sentiment.toFixed(2)}</p>
          <p className="text-sm text-green-600">Engagement: {data.engagement.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Mentions: {data.mentions}</p>
          {data.text && (
            <p className="text-xs text-gray-500 mt-2 truncate">
              {data.text.substring(0, 100)}...
            </p>
          )}
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No engagement vs sentiment data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            type="number" 
            dataKey="sentiment" 
            name="Sentiment"
            domain={[-1, 1]}
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            type="number" 
            dataKey="engagement" 
            name="Engagement"
            stroke="#6B7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={chartData}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getPlatformColor(entry.platform)}
                r={Math.max(3, Math.min(8, entry.mentions / 10))}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EngagementVsSentimentChart