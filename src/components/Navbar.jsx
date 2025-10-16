import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, RefreshCw, Globe, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useData } from '../context/DataContext'

const Navbar = ({ selectedDomain, domains, onChangeDomain }) => {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const { refreshData } = useData()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const currentDomain = domains[selectedDomain]
  
  const menuItems = [
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'market', label: 'Market' },
    { path: 'news', label: 'News' },
    { path: 'social', label: 'Social' },
    { path: 'competitors', label: 'Competitors' },
    { path: 'alerts', label: 'Alerts' }
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Clear all cache for the current domain
      refreshData(selectedDomain)
      // Wait a moment for cache to clear, then let components reload their data
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsRefreshing(false)
    }
  }

  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Domain */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                INSIGHTIQ
              </h1>
              {currentDomain && (
                <span className="text-2xl">{currentDomain.emoji}</span>
              )}
            </div>
            
            {currentDomain && (
              <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
                {currentDomain.name}
              </div>
            )}
          </div>

          {/* Center - Navigation Menu */}
          <div className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={`/domain/${selectedDomain}/${item.path}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={onChangeDomain}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Change Domain"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">Change Domain</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to={`/domain/${selectedDomain}/alerts`}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              title="Alerts"
            >
              <Bell size={20} />
              {/* Alert badge - you can add logic to show actual alert count */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 pt-2 pb-2">
          <div className="flex space-x-1 overflow-x-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={`/domain/${selectedDomain}/${item.path}`}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar