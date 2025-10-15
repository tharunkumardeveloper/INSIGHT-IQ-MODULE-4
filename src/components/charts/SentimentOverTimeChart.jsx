import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const SentimentOverTimeChart = ({ newsData, socialData, competitors }) => {
  const chartData = useMemo(() => {
    const dateMap = new Map()
    const allData = [...(newsData?.data || []), ...(socialData?.data || [])]
    
    // Process data by date and company
    allData.forEach(item => {
      const dateField = item.published_at || item.date || item.timestamp
      const company = item.company || item.source || 'Unknown'
      
      if (dateField && company && item.sentiment_score !== undefined) {
        const date = new Date(dateField).toISOString().split('T')[0]
        
        if (!dateMap.has(date)) {
          dateMap.set(date, { date })
        }
        
        const dayData = dateMap.get(date)
        if (!dayData[company]) {
          dayData[company] = { total: 0, count: 0 }
        }
        
        dayData[company].total += parseFloat(item.sentiment_score)
        dayData[company].count += 1
      }
    })
    
    // Calculate averages and format for chart
    const chartData = Array.from(dateMap.values()).map(dayData => {
      const result = { date: dayData.date }
      
      competitors?.forEach(competitor => {
        const companyData = dayData[competitor.name]
        if (companyData && companyData.count > 0) {
          result[competitor.name] = (companyData.total / companyData.count).toFixed(3)
        }
      })
      
      return result
    })
    
    return chartData.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30)
  }, [newsData, socialData, competitors])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

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

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No sentiment data available over time
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
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {competitors?.slice(0, 5).map((competitor, index) => (
            <Line
              key={competitor.name}
              type="monotone"
              dataKey={competitor.name}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SentimentOverTimeChart