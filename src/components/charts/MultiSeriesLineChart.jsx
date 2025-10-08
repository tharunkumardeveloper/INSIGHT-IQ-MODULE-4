import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const MultiSeriesLineChart = ({ competitors, newsData, socialData }) => {
  const chartData = useMemo(() => {
    const dateMap = new Map()

    // Process data for each competitor
    competitors.forEach(competitor => {
      const competitorName = competitor.name

      // Process news data
      if (newsData?.data) {
        newsData.data.forEach(item => {
          if (item.date && item.title?.toLowerCase().includes(competitorName.toLowerCase())) {
            const date = new Date(item.date).toISOString().split('T')[0]
            if (!dateMap.has(date)) {
              dateMap.set(date, { date })
            }
            const current = dateMap.get(date)
            current[`${competitorName}_news`] = (current[`${competitorName}_news`] || 0) + 1
          }
        })
      }

      // Process social data
      if (socialData?.data) {
        socialData.data.forEach(item => {
          if (item.date && item.text?.toLowerCase().includes(competitorName.toLowerCase())) {
            const date = new Date(item.date).toISOString().split('T')[0]
            if (!dateMap.has(date)) {
              dateMap.set(date, { date })
            }
            const current = dateMap.get(date)
            current[`${competitorName}_social`] = (current[`${competitorName}_social`] || 0) + 1
          }
        })
      }
    })

    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30) // Last 30 days
  }, [competitors, newsData, socialData])

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
              {entry.dataKey.replace('_', ' ')}: {entry.value || 0}
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
        No competitor trend data available
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
          <Legend />
          {competitors.slice(0, 3).map((competitor, index) => (
            <Line
              key={`${competitor.name}_news`}
              type="monotone"
              dataKey={`${competitor.name}_news`}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              name={`${competitor.name} News`}
              connectNulls={false}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MultiSeriesLineChart