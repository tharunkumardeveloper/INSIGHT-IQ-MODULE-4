import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const EngagementTrendsChart = ({ socialData }) => {
  const chartData = useMemo(() => {
    if (!socialData?.data) return []

    const dateMap = new Map()

    socialData.data.forEach(item => {
      if (item.date) {
        const date = new Date(item.date).toISOString().split('T')[0]
        const engagement = (item.likes || 0) + (item.shares || item.retweets || 0) + (item.comments || 0)
        
        if (!dateMap.has(date)) {
          dateMap.set(date, { total: 0, count: 0 })
        }
        
        const current = dateMap.get(date)
        current.total += engagement
        current.count += 1
      }
    })

    return Array.from(dateMap.entries())
      .map(([date, data]) => ({ 
        date, 
        avgEngagement: data.count > 0 ? data.total / data.count : 0,
        totalEngagement: data.total,
        posts: data.count
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30) // Last 30 days
  }, [socialData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Avg Engagement: {data.avgEngagement.toFixed(1)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Total Engagement: {data.totalEngagement}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Posts: {data.posts}
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No engagement data available
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
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="avgEngagement" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Avg Engagement"
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="totalEngagement" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Total Engagement"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EngagementTrendsChart