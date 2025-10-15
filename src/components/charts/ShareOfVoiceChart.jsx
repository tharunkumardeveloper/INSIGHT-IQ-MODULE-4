import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const ShareOfVoiceChart = ({ socialData, competitors }) => {
  const chartData = useMemo(() => {
    const data = socialData?.data || []
    const weeklyData = new Map()
    
    // Group data by week and company
    data.forEach(item => {
      if (item.published_at && item.company) {
        const date = new Date(item.published_at)
        const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay())
        const weekKey = weekStart.toISOString().split('T')[0]
        
        if (!weeklyData.has(weekKey)) {
          weeklyData.set(weekKey, {
            week: weekKey,
            total: 0,
            companies: new Map()
          })
        }
        
        const weekData = weeklyData.get(weekKey)
        const company = item.company
        
        weekData.total += parseInt(item.mention_count || 1)
        weekData.companies.set(company, (weekData.companies.get(company) || 0) + parseInt(item.mention_count || 1))
      }
    })
    
    // Convert to percentage share format
    const result = Array.from(weeklyData.values()).map(weekData => {
      const row = {
        week: new Date(weekData.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekDate: weekData.week
      }
      
      // Calculate percentage for each competitor
      competitors?.forEach(competitor => {
        const mentions = weekData.companies.get(competitor.name) || 0
        const percentage = weekData.total > 0 ? (mentions / weekData.total) * 100 : 0
        row[competitor.name] = parseFloat(percentage.toFixed(1))
        row[`${competitor.name}_count`] = mentions
      })
      
      return row
    })
    
    return result.sort((a, b) => new Date(a.weekDate) - new Date(b.weekDate)).slice(-8) // Last 8 weeks
  }, [socialData, competitors])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Week of {label}</p>
          {payload.map((entry, index) => {
            const companyName = entry.dataKey
            const countKey = `${companyName}_count`
            const count = entry.payload[countKey] || 0
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {companyName}: {entry.value}% ({count} mentions)
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No share of voice data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="week" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {competitors?.slice(0, 5).map((competitor, index) => (
            <Bar
              key={competitor.name}
              dataKey={competitor.name}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ShareOfVoiceChart