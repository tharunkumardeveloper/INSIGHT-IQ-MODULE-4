import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TopSourcesChart = ({ newsData }) => {
  const chartData = useMemo(() => {
    if (!newsData?.data) return []

    const sourceMap = new Map()

    newsData.data.forEach(item => {
      const source = item.source || 'Unknown'
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1)
    })

    return Array.from(sourceMap.entries())
      .map(([name, count]) => ({ 
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        fullName: name,
        count 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // Top 8 sources
  }, [newsData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {data.fullName}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Articles: {data.count}
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No source data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="horizontal"
          data={chartData}
          margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis type="number" stroke="#6B7280" fontSize={12} />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#6B7280" 
            fontSize={12}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TopSourcesChart