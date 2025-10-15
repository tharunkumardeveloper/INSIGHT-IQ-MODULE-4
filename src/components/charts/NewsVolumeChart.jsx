import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const NewsVolumeChart = ({ newsData }) => {
  const chartData = useMemo(() => {
    if (!newsData?.data || newsData.data.length === 0) {
      // Generate sample data if no real data available
      const sampleData = []
      const now = new Date()
      
      for (let i = 14; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        // Create realistic volume patterns
        const baseVolume = Math.floor(Math.random() * 8) + 2 // 2-10 articles
        const weekdayMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.5 : 1 // Lower on weekends
        const volume = Math.floor(baseVolume * weekdayMultiplier)
        
        sampleData.push({
          date: dateStr,
          count: volume,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
        })
      }
      return sampleData
    }

    // Process real data - dynamically determine date range from actual data
    const dateMap = new Map()
    const validDates = []
    
    // First pass: collect all valid dates from the data
    newsData.data.forEach(item => {
      const dateField = item.published_at || item.date || item.timestamp
      if (dateField) {
        try {
          const itemDate = new Date(dateField)
          if (!isNaN(itemDate.getTime())) {
            const dateStr = itemDate.toISOString().split('T')[0]
            validDates.push(new Date(dateStr))
          }
        } catch (e) {
          console.warn('Invalid date format:', dateField)
        }
      }
    })

    if (validDates.length === 0) {
      return []
    }

    // Find the date range from actual data
    const minDate = new Date(Math.min(...validDates))
    const maxDate = new Date(Math.max(...validDates))
    
    // Create a complete date range from min to max date
    const currentDate = new Date(minDate)
    while (currentDate <= maxDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      dateMap.set(dateStr, {
        count: 0,
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' })
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Second pass: count actual articles per day
    newsData.data.forEach(item => {
      const dateField = item.published_at || item.date || item.timestamp
      if (dateField) {
        try {
          const itemDate = new Date(dateField)
          if (!isNaN(itemDate.getTime())) {
            const dateStr = itemDate.toISOString().split('T')[0]
            
            if (dateMap.has(dateStr)) {
              const existing = dateMap.get(dateStr)
              dateMap.set(dateStr, {
                ...existing,
                count: existing.count + 1
              })
            }
          }
        } catch (e) {
          console.warn('Invalid date format:', dateField)
        }
      }
    })

    return Array.from(dateMap.entries())
      .map(([date, data]) => ({ 
        date, 
        count: data.count,
        dayName: data.dayName
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [newsData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const date = new Date(label)
      const currentYear = new Date().getFullYear()
      const dateYear = date.getFullYear()
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: dateYear !== currentYear ? 'numeric' : undefined
            })}
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              {payload[0].value} {payload[0].value === 1 ? 'article' : 'articles'}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  const maxCount = Math.max(...chartData.map(d => d.count), 1)

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            fontSize={11}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tickFormatter={(value) => {
              const date = new Date(value)
              // Show month and day, and year if it's different from current year
              const currentYear = new Date().getFullYear()
              const dateYear = date.getFullYear()
              
              if (dateYear !== currentYear) {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
              } else {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }
            }}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={11}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={[0, maxCount + 1]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#volumeGradient)"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, fill: '#1D4ED8' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default NewsVolumeChart