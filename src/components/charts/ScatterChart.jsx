import React from 'react'
import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ScatterChart = ({ competitors, socialData }) => {
  const chartData = competitors.map(competitor => {
    // Calculate engagement for this competitor
    const competitorPosts = socialData?.data?.filter(post => 
      post.text?.toLowerCase().includes(competitor.name.toLowerCase())
    ) || []

    const totalEngagement = competitorPosts.reduce((sum, post) => 
      sum + (post.likes || 0) + (post.shares || post.retweets || 0) + (post.comments || 0), 0
    )

    return {
      name: competitor.name,
      sentiment: competitor.sentiment,
      engagement: totalEngagement,
      mentions: competitor.social_mentions
    }
  })

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Sentiment: {data.sentiment.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Engagement: {data.engagement.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Mentions: {data.mentions}
          </p>
        </div>
      )
    }
    return null
  }

  const CustomDot = (props) => {
    const { cx, cy, payload } = props
    const size = Math.max(4, Math.min(20, payload.mentions / 2))
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill="#3B82F6"
        fillOpacity={0.7}
        stroke="#1E40AF"
        strokeWidth={2}
      />
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No sentiment vs engagement data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          data={chartData}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            type="number" 
            dataKey="sentiment" 
            name="Sentiment"
            stroke="#6B7280"
            fontSize={12}
            domain={[-1, 1]}
          />
          <YAxis 
            type="number" 
            dataKey="engagement" 
            name="Engagement"
            stroke="#6B7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter 
            name="Competitors" 
            data={chartData} 
            fill="#3B82F6"
            shape={<CustomDot />}
          />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ScatterChart