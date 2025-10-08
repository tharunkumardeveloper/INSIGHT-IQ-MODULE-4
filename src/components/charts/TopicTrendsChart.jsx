import React, { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TopicTrendsChart = ({ newsData }) => {
  const chartData = useMemo(() => {
    if (!newsData?.data) return []

    // Extract keywords from titles and group by date
    const dateMap = new Map()
    const keywordCounts = new Map()

    newsData.data.forEach(item => {
      if (item.date && item.title) {
        const date = new Date(item.date).toISOString().split('T')[0]
        const words = item.title.toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 3 && !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'said', 'says', 'more', 'than', 'also', 'just', 'only', 'very', 'well', 'much', 'many', 'most', 'some', 'such', 'even', 'still', 'like', 'back', 'good', 'best', 'first', 'last', 'next', 'year', 'years', 'time', 'week', 'month', 'today'].includes(word))

        if (!dateMap.has(date)) {
          dateMap.set(date, new Map())
        }

        words.forEach(word => {
          keywordCounts.set(word, (keywordCounts.get(word) || 0) + 1)
          dateMap.get(date).set(word, (dateMap.get(date).get(word) || 0) + 1)
        })
      }
    })

    // Get top 5 keywords
    const topKeywords = Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword]) => keyword)

    if (topKeywords.length === 0) return []

    // Create time series data
    const result = Array.from(dateMap.entries())
      .map(([date, keywords]) => {
        const dataPoint = { date }
        topKeywords.forEach(keyword => {
          dataPoint[keyword] = keywords.get(keyword) || 0
        })
        return dataPoint
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30) // Last 30 days

    return result
  }, [newsData])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
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
        No topic data available
      </div>
    )
  }

  const topKeywords = Object.keys(chartData[0] || {}).filter(key => key !== 'date')

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          {topKeywords.map((keyword, index) => (
            <Area
              key={keyword}
              type="monotone"
              dataKey={keyword}
              stackId="1"
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TopicTrendsChart