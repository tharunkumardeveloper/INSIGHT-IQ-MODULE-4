import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MentionsChart = ({ competitors }) => {
  const chartData = competitors.map(competitor => ({
    name: competitor.name.length > 15 ? competitor.name.substring(0, 15) + '...' : competitor.name,
    fullName: competitor.name,
    news: competitor.news_count,
    social: competitor.social_mentions,
    total: competitor.news_count + competitor.social_mentions
  })).sort((a, b) => b.total - a.total)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {data.fullName}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Total: {data.total}
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No competitor data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#6B7280"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="news" stackId="a" fill="#3B82F6" name="News" />
          <Bar dataKey="social" stackId="a" fill="#10B981" name="Social" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MentionsChart