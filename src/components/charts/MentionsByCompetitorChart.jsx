import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'

const MentionsByCompetitorChart = ({ newsData, socialData, competitors }) => {
  const chartData = useMemo(() => {
    const mentionCounts = new Map()
    const allData = [...(newsData?.data || []), ...(socialData?.data || [])]
    
    // Initialize with competitors
    competitors?.forEach(competitor => {
      mentionCounts.set(competitor.name, {
        company: competitor.name,
        mentions: 0,
        newsMentions: 0,
        socialMentions: 0,
        totalMentionCount: 0,
        avgSentiment: 0,
        sentimentSum: 0,
        sentimentCount: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0
      })
    })
    
    // Count mentions and calculate sentiment
    allData.forEach(item => {
      if (item.company) {
        const company = item.company
        if (mentionCounts.has(company)) {
          const data = mentionCounts.get(company)
          data.mentions += 1
          data.totalMentionCount += parseInt(item.mention_count || 1)
          
          // Track news vs social
          if (item.source === 'news') {
            data.newsMentions += 1
          } else {
            data.socialMentions += 1
          }
          
          if (item.sentiment_score !== undefined) {
            const sentiment = parseFloat(item.sentiment_score)
            data.sentimentSum += sentiment
            data.sentimentCount += 1
            
            // Count sentiment categories
            if (sentiment > 0.1) data.positiveCount += 1
            else if (sentiment < -0.1) data.negativeCount += 1
            else data.neutralCount += 1
          }
        }
      }
    })
    
    // Calculate averages and format for chart
    const result = Array.from(mentionCounts.values()).map(data => ({
      company: data.company.length > 12 ? data.company.substring(0, 12) + '...' : data.company,
      fullName: data.company,
      mentions: data.totalMentionCount || data.mentions,
      newsMentions: data.newsMentions,
      socialMentions: data.socialMentions,
      avgSentiment: data.sentimentCount > 0 ? data.sentimentSum / data.sentimentCount : 0,
      positiveCount: data.positiveCount,
      negativeCount: data.negativeCount,
      neutralCount: data.neutralCount,
      sentimentCount: data.sentimentCount
    }))
    
    return result.sort((a, b) => b.mentions - a.mentions)
  }, [newsData, socialData, competitors])

  const getBarColor = (sentiment) => {
    if (sentiment > 0.3) return '#059669' // Dark green for very positive
    if (sentiment > 0.1) return '#10B981' // Green for positive
    if (sentiment > -0.1) return '#6B7280' // Gray for neutral
    if (sentiment > -0.3) return '#F59E0B' // Orange for negative
    return '#EF4444' // Red for very negative
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const sentimentText = data.avgSentiment > 0.1 ? 'Positive' : 
                           data.avgSentiment < -0.1 ? 'Negative' : 'Neutral'
      
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-48">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">{data.fullName}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Total Mentions:</span>
              <span className="text-sm font-semibold text-blue-600">{data.mentions.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">News:</span>
              <span className="text-sm font-medium text-purple-600">{data.newsMentions}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Social:</span>
              <span className="text-sm font-medium text-cyan-600">{data.socialMentions}</span>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-600" />
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Sentiment:</span>
              <span className={`text-sm font-semibold ${
                data.avgSentiment > 0.1 ? 'text-green-600' : 
                data.avgSentiment < -0.1 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {sentimentText} ({data.avgSentiment.toFixed(2)})
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-green-600 font-medium">{data.positiveCount}</div>
                <div className="text-gray-500">Positive</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 font-medium">{data.neutralCount}</div>
                <div className="text-gray-500">Neutral</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-medium">{data.negativeCount}</div>
                <div className="text-gray-500">Negative</div>
              </div>
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
        No mention data available
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis 
            dataKey="company" 
            stroke="#6B7280" 
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={11}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="newsMentions" 
            stackId="a" 
            fill="#3B82F6" 
            name="News Mentions"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="socialMentions" 
            stackId="a" 
            fill="#10B981" 
            name="Social Mentions"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MentionsByCompetitorChart