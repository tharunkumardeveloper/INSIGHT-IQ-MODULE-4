import React, { useMemo } from 'react'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const SocialBuzzTrendChart = ({ socialData, competitors }) => {
  const chartData = useMemo(() => {
    const dateMap = new Map()
    const data = socialData?.data || []
    
    // Process data by date
    data.forEach(item => {
      const dateField = item.published_at || item.date || item.timestamp
      if (dateField && item.sentiment_score !== undefined) {
        const date = new Date(dateField).toISOString().split('T')[0]
        
        if (!dateMap.has(date)) {
          dateMap.set(date, {
            date,
            postCount: 0,
            sentimentSum: 0,
            sentimentCount: 0
          })
        }
        
        const dayData = dateMap.get(date)
        dayData.postCount += 1
        dayData.sentimentSum += parseFloat(item.sentiment_score)
        dayData.sentimentCount += 1
      }
    })
    
    // Calculate averages and format for chart
    const result = Array.from(dateMap.values()).map(dayData => ({
      date: dayData.date,
      postCount: dayData.postCount,
      avgSentiment: dayData.sentimentCount > 0 ? dayData.sentimentSum / dayData.sentimentCount : 0
    }))
    
    return result.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30)
  }, [socialData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'postCount' ? 'Posts' : 'Avg Sentiment'}: {
                entry.dataKey === 'avgSentiment' ? entry.value.toFixed(2) : entry.value
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No social buzz data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} domain={[-1, 1]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="postCount" fill="#3B82F6" name="Post Count" />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="avgSentiment" 
            stroke="#10B981" 
            strokeWidth={3}
            name="Avg Sentiment"
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SocialBuzzTrendChart