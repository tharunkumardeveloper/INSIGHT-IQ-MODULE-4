import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
    
    // Clear cache for previous domain if it exists
    if (selectedDomain) {
      refreshData(selectedDomain)
    }
    
    // Set new domain
    setSelectedDomain(domainKey)
    setShowDomainModal(false)
    
    // Clear cache for new domain to force fresh data load
    refreshData(domainKey)
    
    console.log(`Domain changed to: ${domainKey} - Cache cleared for fresh data`)
    
    // Small delay to allow cache clearing and show loading state
    setTimeout(() => {
      setIsDomainChanging(false)
    }, 500)
  }

  const handleChangeDomain = () => {
    setShowDomainModal(true)
  }

  return (
    <Router>
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
    </Router>
  )
}

// Main App component that provides context
function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  )
}

export default App