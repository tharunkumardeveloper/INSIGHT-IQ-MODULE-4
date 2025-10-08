import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const SentimentDistributionChart = ({ newsData }) => {
  const chartData = useMemo(() => {
    if (!newsData?.data) return []

    let positive = 0, negative = 0, neutral = 0

    newsData.data.forEach(item => {
      if (item.sentiment_score !== undefined) {
        if (item.sentiment_score > 0.1) {
          positive++
        } else if (item.sentiment_score < -0.1) {
          negative++
        } else {
          neutral++
        }
      }
    })

    return [
      { name: 'Positive', value: positive, color: '#10B981' },
      { name: 'Neutral', value: neutral, color: '#6B7280' },
      { name: 'Negative', value: negative, color: '#EF4444' }
    ].filter(item => item.value > 0)
  }, [newsData])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const total = chartData.reduce((sum, item) => sum + item.value, 0)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {data.value} articles ({((data.value / total) * 100).toFixed(1)}%)
          </p>
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
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontSize: '12px' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SentimentDistributionChart