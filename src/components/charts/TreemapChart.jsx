import React, { useMemo } from 'react'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'

const TreemapChart = ({ newsData }) => {
  const chartData = useMemo(() => {
    if (!newsData?.data) return []

    // Extract and count categories/topics
    const categoryMap = new Map()

    newsData.data.forEach(item => {
      const category = item.category || 'General'
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
    })

    // If no categories, extract topics from titles
    if (categoryMap.size <= 1) {
      categoryMap.clear()
      
      newsData.data.forEach(item => {
        if (item.title) {
          const words = item.title.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 4 && !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'said', 'says', 'more', 'than', 'also', 'just', 'only', 'very', 'well', 'much', 'many', 'most', 'some', 'such', 'even', 'still', 'like', 'back', 'good', 'best', 'first', 'last', 'next', 'year', 'years', 'time', 'week', 'month', 'today', 'company', 'companies', 'business', 'market', 'industry'].includes(word))

          words.forEach(word => {
            categoryMap.set(word, (categoryMap.get(word) || 0) + 1)
          })
        }
      })
    }

    return Array.from(categoryMap.entries())
      .map(([name, size]) => ({ name, size }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 12) // Top 12 topics
  }, [newsData])

  const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316',
    '#06B6D4', '#84CC16', '#EC4899', '#6366F1', '#14B8A6', '#F472B6'
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {data.size} mentions
          </p>
        </div>
      )
    }
    return null
  }

  const CustomContent = ({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
    if (depth === 1) {
      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: COLORS[index % COLORS.length],
              stroke: '#fff',
              strokeWidth: 2,
              fillOpacity: 0.8,
            }}
          />
          {width > 60 && height > 30 && (
            <text
              x={x + width / 2}
              y={y + height / 2}
              textAnchor="middle"
              fill="#fff"
              fontSize={Math.min(width / 8, height / 4, 14)}
              fontWeight="bold"
            >
              {name}
            </text>
          )}
          {width > 60 && height > 50 && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 16}
              textAnchor="middle"
              fill="#fff"
              fontSize={Math.min(width / 12, height / 6, 12)}
            >
              {payload.size}
            </text>
          )}
        </g>
      )
    }
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No topic distribution data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={chartData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
          content={<CustomContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}

export default TreemapChart