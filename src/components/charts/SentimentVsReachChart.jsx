import React, { useMemo } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'

const SentimentVsReachChart = ({ newsData, socialData, competitors }) => {
  const chartData = useMemo(() => {
    const companyData = new Map()
    const allData = [...(newsData?.data || []), ...(socialData?.data || [])]
    
    // Initialize with competitors
    competitors?.forEach(competitor => {
      companyData.set(competitor.name, {
        company: competitor.name,
        sentimentSum: 0,
        sentimentCount: 0,
        totalMentions: 0,
        totalEngagement: 0,
        articleCount: 0,
        newsCount: 0,
        socialCount: 0,
        positiveCount: 0,
        negativeCount: 0,
        highEngagementPosts: 0
      })
    })
    
    // Process data
    allData.forEach(item => {
      if (item.company && companyData.has(item.company)) {
        const data = companyData.get(item.company)
        
        if (item.sentiment_score !== undefined) {
          const sentiment = parseFloat(item.sentiment_score)
          data.sentimentSum += sentiment
          data.sentimentCount += 1
          
          if (sentiment > 0.2) data.positiveCount += 1
          if (sentiment < -0.2) data.negativeCount += 1
        }
        
        data.totalMentions += parseInt(item.mention_count || 1)
        data.articleCount += 1
        
        // Track news vs social
        if (item.source === 'news') {
          data.newsCount += 1
        } else {
          data.socialCount += 1
        }
        
        // Extract engagement from raw_json if available
        try {
          if (item.raw_json) {
            const rawData = typeof item.raw_json === 'string' ? JSON.parse(item.raw_json) : item.raw_json
            if (rawData.engagement_metrics) {
              const engagement = rawData.engagement_metrics
              const totalEng = (engagement.likes || 0) + (engagement.shares || 0) + (engagement.comments || 0)
              data.totalEngagement += totalEng
              
              // Count high engagement posts (>100 total engagement)
              if (totalEng > 100) data.highEngagementPosts += 1
            }
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      }
    })
    
    // Format for chart
    return Array.from(companyData.values())
      .filter(data => data.sentimentCount > 0)
      .map(data => ({
        company: data.company,
        shortName: data.company.length > 10 ? data.company.substring(0, 10) + '...' : data.company,
        sentiment: data.sentimentSum / data.sentimentCount,
        reach: data.totalEngagement || data.totalMentions,
        size: Math.max(60, Math.min(300, data.articleCount * 12 + 60)), // Larger, more visible bubble size
        articles: data.articleCount,
        newsCount: data.newsCount,
        socialCount: data.socialCount,
        positiveCount: data.positiveCount,
        negativeCount: data.negativeCount,
        highEngagementPosts: data.highEngagementPosts,
        avgEngagementPerPost: data.articleCount > 0 ? Math.round(data.totalEngagement / data.articleCount) : 0
      }))
  }, [newsData, socialData, competitors])

  const getCompanyColor = (sentiment, reach, avgReach) => {
    // Color based on quadrant using dynamic average
    const reachThreshold = avgReach || 1000
    if (sentiment > 0 && reach > reachThreshold) return '#059669' // High sentiment, high reach - dark green
    if (sentiment > 0 && reach <= reachThreshold) return '#10B981' // High sentiment, low reach - green
    if (sentiment <= 0 && reach > reachThreshold) return '#F59E0B' // Low sentiment, high reach - orange
    return '#EF4444' // Low sentiment, low reach - red
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const avgReach = chartData.reduce((sum, item) => sum + item.reach, 0) / chartData.length
      const quadrant = data.sentiment > 0 && data.reach > avgReach ? 'Star Performer' :
                     data.sentiment > 0 && data.reach <= avgReach ? 'Hidden Gem' :
                     data.sentiment <= 0 && data.reach > avgReach ? 'High Risk' : 'Needs Attention'
      
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl min-w-64 max-w-80">
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-bold text-gray-900 dark:text-white truncate pr-2">{data.company}</p>
            <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
              quadrant === 'Star Performer' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              quadrant === 'Hidden Gem' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              quadrant === 'High Risk' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {quadrant}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <div className="text-gray-600 dark:text-gray-300 text-xs">Sentiment Score</div>
              <div className={`font-bold text-lg ${
                data.sentiment > 0.2 ? 'text-green-600 dark:text-green-400' : 
                data.sentiment < -0.2 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {data.sentiment.toFixed(3)}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <div className="text-gray-600 dark:text-gray-300 text-xs">Total Reach</div>
              <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                {data.reach > 1000 ? `${(data.reach/1000).toFixed(1)}K` : data.reach.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div>
              <div className="text-gray-600 dark:text-gray-300 text-xs">Total Articles</div>
              <div className="font-semibold text-purple-600 dark:text-purple-400">{data.articles}</div>
            </div>
            
            <div>
              <div className="text-gray-600 dark:text-gray-300 text-xs">Avg Engagement</div>
              <div className="font-semibold text-cyan-600 dark:text-cyan-400">{data.avgEngagementPerPost}</div>
            </div>
          </div>
          
          <hr className="my-3 border-gray-200 dark:border-gray-600" />
          
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <div className="text-green-600 dark:text-green-400 font-bold text-sm">{data.positiveCount}</div>
              <div className="text-gray-500 dark:text-gray-400">Positive</div>
            </div>
            <div className="text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
              <div className="text-red-600 dark:text-red-400 font-bold text-sm">{data.negativeCount}</div>
              <div className="text-gray-500 dark:text-gray-400">Negative</div>
            </div>
            <div className="text-center bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
              <div className="text-orange-600 dark:text-orange-400 font-bold text-sm">{data.highEngagementPosts}</div>
              <div className="text-gray-500 dark:text-gray-400">Viral</div>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Bubble size represents article volume • Hover for details
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No sentiment vs reach data available
      </div>
    )
  }

  // Calculate averages for reference lines
  const avgSentiment = chartData.reduce((sum, item) => sum + item.sentiment, 0) / chartData.length
  const avgReach = chartData.reduce((sum, item) => sum + item.reach, 0) / chartData.length

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 40, bottom: 60, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} />
          
          {/* Reference lines for quadrants */}
          <ReferenceLine x={0} stroke="#9CA3AF" strokeDasharray="5 5" opacity={0.7} />
          <ReferenceLine y={avgReach} stroke="#9CA3AF" strokeDasharray="5 5" opacity={0.7} />
          
          <XAxis 
            type="number" 
            dataKey="sentiment" 
            name="Sentiment"
            domain={[-1, 1]}
            stroke="#6B7280"
            fontSize={12}
            tickCount={9}
            label={{ value: 'Sentiment Score', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: '13px', fill: '#6B7280', fontWeight: '500' } }}
          />
          <YAxis 
            type="number" 
            dataKey="reach" 
            name="Reach"
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => value > 1000 ? `${(value/1000).toFixed(1)}K` : value}
            label={{ value: 'Total Reach', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '13px', fill: '#6B7280', fontWeight: '500' } }}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: '3 3' }}
            wrapperStyle={{ outline: 'none' }}
          />
          
          <Scatter 
            data={chartData}
            fill="#8884d8"
          >
            {chartData.map((entry, index) => {
              const avgReach = chartData.reduce((sum, item) => sum + item.reach, 0) / chartData.length
              const radius = Math.max(8, Math.min(25, Math.sqrt(entry.size / Math.PI) * 0.6)) // Better size scaling with min/max limits
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getCompanyColor(entry.sentiment, entry.reach, avgReach)}
                  fillOpacity={0.8}
                  stroke={getCompanyColor(entry.sentiment, entry.reach, avgReach)}
                  strokeWidth={2}
                  r={radius}
                  style={{ 
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
              )
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="mt-2 flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-700 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-300">Star Performer</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-300">Hidden Gem</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-300">High Risk</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-300">Needs Attention</span>
        </div>
      </div>
    </div>
  )
}

export default SentimentVsReachChart