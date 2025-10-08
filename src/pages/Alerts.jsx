import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AlertTriangle, TrendingUp, Bell, Clock, CheckCircle, Timer, RefreshCw, AlertCircle } from 'lucide-react'
import { useData } from '../context/DataContext'
import LoadingSpinner from '../components/LoadingSpinner'

const Alerts = () => {
  const { domainKey } = useParams()
  const { fetchData, isLoading, refreshData } = useData()
  const [alerts, setAlerts] = useState([])
  const [filteredAlerts, setFilteredAlerts] = useState([])
  const [filter, setFilter] = useState('all') // all, unread, high, medium, low
  const [sortBy, setSortBy] = useState('timestamp') // timestamp, severity, type
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadAlerts = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true)
      refreshData(domainKey)
    }
    
    setError(null)
    
    try {
      const alertsData = await fetchData(`http://localhost:8000/api/alerts/${domainKey}`, `alerts_${domainKey}`)
      if (alertsData && alertsData.alerts) {
        const alertsWithStatus = alertsData.alerts.map(alert => ({
          ...alert,
          status: 'unread',
          snoozedUntil: null
        }))
        setAlerts(alertsWithStatus)
      } else {
        setAlerts([])
      }
    } catch (error) {
      console.error('Error loading alerts:', error)
      setError(error.message)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (domainKey) {
      loadAlerts()
    }
  }, [domainKey])

  const handleRefresh = () => {
    loadAlerts(true)
  }

  useEffect(() => {
    let filtered = [...alerts]

    // Apply status filter
    if (filter === 'unread') {
      filtered = filtered.filter(alert => alert.status === 'unread')
    } else if (filter === 'read') {
      filtered = filtered.filter(alert => alert.status === 'read')
    } else if (['high', 'medium', 'low'].includes(filter)) {
      filtered = filtered.filter(alert => alert.severity === filter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(term) ||
        alert.description.toLowerCase().includes(term) ||
        alert.type.toLowerCase().includes(term)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp) - new Date(a.timestamp)
      } else if (sortBy === 'severity') {
        const severityOrder = { high: 3, medium: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      } else if (sortBy === 'type') {
        return a.type.localeCompare(b.type)
      }
      return 0
    })

    setFilteredAlerts(filtered)
  }, [alerts, filter, sortBy, searchTerm])

  const markAsRead = (alertId) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, status: 'read' } : alert
    ))
  }

  const snoozeAlert = (alertId, hours = 24) => {
    const snoozedUntil = new Date()
    snoozedUntil.setHours(snoozedUntil.getHours() + hours)
    
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, status: 'snoozed', snoozedUntil } : alert
    ))
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="text-red-500" size={20} />
      case 'medium':
        return <TrendingUp className="text-yellow-500" size={20} />
      case 'low':
        return <Bell className="text-blue-500" size={20} />
      default:
        return <Bell className="text-gray-500" size={20} />
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (isLoading(`alerts_${domainKey}`)) {
    return <LoadingSpinner text="Loading alerts..." />
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Failed to Load Alerts
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const unreadCount = alerts.filter(alert => alert.status === 'unread').length
  const highPriorityCount = alerts.filter(alert => alert.severity === 'high').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Alerts Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Automated alerts and notifications for market intelligence
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{unreadCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{highPriorityCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">High Priority</div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Alerts</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="timestamp">Sort by Time</option>
              <option value="severity">Sort by Severity</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>

          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${getSeverityColor(alert.severity)} ${
              alert.status === 'unread' ? 'ring-2 ring-blue-500 ring-opacity-20' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getSeverityIcon(alert.severity)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {alert.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {alert.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {alert.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{formatTimestamp(alert.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Source: {alert.source}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {alert.status === 'unread' && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    <CheckCircle size={14} />
                    <span>Mark Read</span>
                  </button>
                )}
                
                <button
                  onClick={() => snoozeAlert(alert.id)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Timer size={14} />
                  <span>Snooze</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No alerts</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || filter !== 'all' 
                ? 'No alerts match your current filters.' 
                : 'No alerts have been generated yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Alert Types Info */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alert Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Mention Spikes</h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              Alerts when social mentions increase by more than 2x the weekly average
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Sentiment Drops</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Notifications when overall domain sentiment falls below -0.4
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Trending Topics</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Identifies emerging keywords and trending discussion topics
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts