import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const InfluencerLeaderboardChart = ({ socialData }) => {
  const chartData = useMemo(() => {
    if (!socialData?.data) return []

    const influencerMap = new Map()

    socialData.data.forEach(item => {
      const handle = item.handle || 'Unknown'
      const engagement = (item.likes || 0) + (item.shares || item.retweets || 0) + (item.comments || 0)
      
      if (!influencerMap.has(handle)) {
        influencerMap.set(handle, { posts: 0, totalEngagement: 0 })
      }
      
      const current = influencerMap.get(handle)
      current.posts += 1
      current.totalEngagement += engagement
    })

    return Array.from(influencerMap.entries())
      .map(([handle, data]) => ({
        handle: handle.length > 15 ? handle.substring(0, 15) + '...' : handle,
        fullHandle: handle,
        avgEngagement: data.posts > 0 ? data.totalEngagement / data.posts : 0,
        totalEngagement: data.totalEngagement,
        posts: data.posts
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 8) // Top 8 influencers
  }, [socialData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {data.fullHandle}
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
        No influencer data available
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
            dataKey="handle" 
            stroke="#6B7280" 
            fontSize={12}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avgEngagement" fill="#8B5CF6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default InfluencerLeaderboardChart