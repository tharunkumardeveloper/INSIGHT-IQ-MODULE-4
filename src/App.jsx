import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import DomainModal from './components/DomainModal'
import Dashboard from './pages/Dashboard'
import Market from './pages/Market'
import News from './pages/News'
import Social from './pages/Social'
import Competitors from './pages/Competitors'
import Alerts from './pages/Alerts'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider, useData } from './context/DataContext'

// Inner App component that has access to DataContext
const AppContent = () => {
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [showDomainModal, setShowDomainModal] = useState(true)
  const [domains, setDomains] = useState({})
  const [isDomainChanging, setIsDomainChanging] = useState(false)
  const { refreshData } = useData()
  const navigate = useNavigate()
  const location = useLocation()

  // Check URL for domain parameter and sync state
  useEffect(() => {
    const pathParts = location.pathname.split('/')
    if (pathParts[1] === 'domain' && pathParts[2]) {
      const urlDomain = pathParts[2]
      if (urlDomain !== selectedDomain) {
        console.log(`Syncing domain from URL: ${urlDomain}`)
        setSelectedDomain(urlDomain)
        setShowDomainModal(false)
      }
    }
  }, [location.pathname, selectedDomain])

  useEffect(() => {
    // Load domains from API
    console.log('Fetching domains from API...')
    fetch('http://localhost:8002/api/domains')
      .then(res => {
        console.log('Domains API response status:', res.status)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log('Domains loaded:', data)
        setDomains(data)

        // If we have a domain from URL but no domains loaded yet, wait for domains
        const pathParts = location.pathname.split('/')
        if (pathParts[1] === 'domain' && pathParts[2]) {
          const urlDomain = pathParts[2]
          if (data[urlDomain]) {
            setSelectedDomain(urlDomain)
            setShowDomainModal(false)
          } else {
            // Invalid domain in URL, show domain modal
            console.warn(`Invalid domain in URL: ${urlDomain}`)
            setShowDomainModal(true)
          }
        }
      })
      .catch(err => {
        console.error('Failed to load domains:', err)
        // Fallback to show at least something if API fails
        setDomains({
          error: {
            name: "API Connection Error",
            emoji: "⚠️",
            competitors: ["Please check if backend is running"]
          }
        })
      })
  }, [])

  const handleDomainSelect = async (domainKey) => {
    setIsDomainChanging(true)

    try {
      // Navigate to new domain URL immediately
      navigate(`/domain/${domainKey}/dashboard`, { replace: true })

      // Clear cache for previous domain if it exists
      if (selectedDomain) {
        refreshData(selectedDomain)
      }

      // Set new domain
      setSelectedDomain(domainKey)
      setShowDomainModal(false)

      // Clear cache for new domain to force fresh data load
      refreshData(domainKey)

      console.log(`Domain changed to: ${domainKey} - URL updated and cache cleared for fresh data`)

      // Small delay to allow cache clearing and show loading state
      setTimeout(() => {
        setIsDomainChanging(false)
      }, 500)
    } catch (error) {
      console.error('Error during domain switch:', error)
      setIsDomainChanging(false)
    }
  }

  const handleChangeDomain = () => {
    setShowDomainModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {selectedDomain && (
        <Navbar
          selectedDomain={selectedDomain}
          domains={domains}
          onChangeDomain={handleChangeDomain}
        />
      )}

      {showDomainModal && (
        <DomainModal
          domains={domains}
          onDomainSelect={handleDomainSelect}
        />
      )}

      {selectedDomain && !showDomainModal && (
        <main className="pt-16">
          {isDomainChanging && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-900 dark:text-white">Switching domain...</span>
              </div>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Navigate to={`/domain/${selectedDomain}/dashboard`} replace />} />
            <Route path="/domain/:domainKey/dashboard" element={<Dashboard />} />
            <Route path="/domain/:domainKey/market" element={<Market />} />
            <Route path="/domain/:domainKey/news" element={<News />} />
            <Route path="/domain/:domainKey/social" element={<Social />} />
            <Route path="/domain/:domainKey/competitors" element={<Competitors />} />
            <Route path="/domain/:domainKey/alerts" element={<Alerts />} />
            <Route path="*" element={<Navigate to={`/domain/${selectedDomain}/dashboard`} replace />} />
          </Routes>
        </main>
      )}
    </div>
  )
}

// Main App component that provides context
function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </ThemeProvider>
  )
}

export default App