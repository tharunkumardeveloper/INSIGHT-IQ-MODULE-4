import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const TopicSentimentComparisonChart = ({ newsData, socialData, competitors }) => {
  const viewMode = 'articles' // Only show article count

  const chartData = useMemo(() => {
    const topicCompanyMap = new Map()
    const allData = [...(newsData?.data || []), ...(socialData?.data || [])]
    const topics = new Set()

    // Process data to extract topics from raw_json and calculate metrics
    allData.forEach(item => {
      if (item.company && (item.sentiment_score !== undefined || viewMode === 'articles')) {
        let topic = 'General'

        // Extract topic/domain from raw_json
        try {
          if (item.raw_json) {
            const rawData = typeof item.raw_json === 'string' ? JSON.parse(item.raw_json) : item.raw_json
            if (rawData.domain) {
              // Convert domain keys to readable topics
              const domainMap = {
                'ai_ml': 'AI & ML',
                'cloud': 'Cloud',
                'cybersecurity': 'Security',
                'web3': 'Web3',
                'arvr': 'AR/VR',
                'robotics': 'Robotics',
                'semiconductors': 'Hardware',
                'quantum': 'Quantum',
                'consumer': 'Consumer',
                'greentech': 'GreenTech'
              }
              topic = domainMap[rawData.domain] || rawData.domain || 'General'
            }
          }
        } catch (e) {
          // If parsing fails, try to infer topic from title/text
          const text = (item.title || item.text || '').toLowerCase()
          if (text.includes('ai') || text.includes('artificial intelligence')) topic = 'AI & ML'
          else if (text.includes('cloud') || text.includes('aws') || text.includes('azure')) topic = 'Cloud'
          else if (text.includes('security') || text.includes('cyber')) topic = 'Security'
          else if (text.includes('blockchain') || text.includes('crypto')) topic = 'Web3'
          else if (text.includes('vr') || text.includes('ar') || text.includes('metaverse')) topic = 'AR/VR'
          else if (text.includes('robot') || text.includes('automation')) topic = 'Robotics'
          else if (text.includes('chip') || text.includes('semiconductor')) topic = 'Hardware'
          else if (text.includes('quantum')) topic = 'Quantum'
          else if (text.includes('green') || text.includes('sustainable')) topic = 'GreenTech'
        }

        topics.add(topic)
        const key = `${item.company}-${topic}`

        if (!topicCompanyMap.has(key)) {
          topicCompanyMap.set(key, {
            company: item.company,
            topic: topic,
            sentimentSum: 0,
            sentimentCount: 0,
            articleCount: 0
          })
        }

        const data = topicCompanyMap.get(key)
        data.articleCount += 1

        if (item.sentiment_score !== undefined) {
          data.sentimentSum += parseFloat(item.sentiment_score)
          data.sentimentCount += 1
        }
      }
    })

    // Convert to chart format grouped by topic
    const topicArray = Array.from(topics).sort()
    const chartData = topicArray.map(topic => {
      const dataPoint = { topic }

      competitors?.forEach(competitor => {
        const key = `${competitor.name}-${topic}`
        const data = topicCompanyMap.get(key)

        if (data) {
          if (viewMode === 'sentiment') {
            dataPoint[competitor.name] = data.sentimentCount > 0
              ? (data.sentimentSum / data.sentimentCount)
              : null
          } else {
            dataPoint[competitor.name] = data.articleCount
          }
        } else {
          dataPoint[competitor.name] = viewMode === 'sentiment' ? null : 0
        }
      })

      return dataPoint
    })

    return chartData.filter(item =>
      competitors?.some(comp => item[comp.name] !== null && item[comp.name] !== 0)
    )
  }, [newsData, socialData, competitors, viewMode])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-48">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">{label}</p>

          <div className="space-y-2">
            {payload
              .filter(entry => entry.value !== null && entry.value !== 0)
              .sort((a, b) => (b.value || 0) - (a.value || 0))
              .map((entry, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {entry.dataKey}:
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${viewMode === 'sentiment'
                    ? entry.value > 0.1 ? 'text-green-600' :
                      entry.value < -0.1 ? 'text-red-600' : 'text-gray-600'
                    : 'text-blue-600'
                    }`}>
                    {viewMode === 'sentiment'
                      ? entry.value.toFixed(2)
                      : `${entry.value} articles`
                    }
                  </span>
                </div>
              ))}
          </div>

          {viewMode === 'sentiment' && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Higher values indicate more positive sentiment
              </p>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No topic sentiment data available
      </div>
    )
  }

  return (
    <div className="h-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Article Coverage by Topic
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Total Articles per Topic Area
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis
            dataKey="topic"
            stroke="#6B7280"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={11}
            domain={[0, 'dataMax']}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="rect"
          />



          {competitors?.slice(0, 8).map((competitor, index) => (
            <Bar
              key={competitor.name}
              dataKey={competitor.name}
              fill={COLORS[index % COLORS.length]}
              name={competitor.name.length > 12 ? competitor.name.substring(0, 12) + '...' : competitor.name}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Insights */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Insight:</strong> See which companies have the most coverage in each topic area. Higher bars indicate more articles and stronger market presence.
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopicSentimentComparisonChart