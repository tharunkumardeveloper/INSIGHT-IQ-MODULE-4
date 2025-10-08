import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import DomainModal from './components/DomainModal'
import Dashboard from './pages/Dashboard'
import Market from './pages/Market'
import News from './pages/News'
import Social from './pages/Social'
import Alerts from './pages/Alerts'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'

function App() {
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [showDomainModal, setShowDomainModal] = useState(true)
  const [domains, setDomains] = useState({})

  useEffect(() => {
    // Load domains from API
    console.log('Fetching domains from API...')
    fetch('http://localhost:8000/api/domains')
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

  const handleDomainSelect = (domainKey) => {
    setSelectedDomain(domainKey)
    setShowDomainModal(false)
  }

  const handleChangeDomain = () => {
    setShowDomainModal(true)
  }

  return (
    <ThemeProvider>
      <DataProvider>
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
                <Routes>
                  <Route path="/" element={<Navigate to={`/domain/${selectedDomain}/dashboard`} replace />} />
                  <Route path="/domain/:domainKey/dashboard" element={<Dashboard />} />
                  <Route path="/domain/:domainKey/market" element={<Market />} />
                  <Route path="/domain/:domainKey/news" element={<News />} />
                  <Route path="/domain/:domainKey/social" element={<Social />} />
                  <Route path="/domain/:domainKey/alerts" element={<Alerts />} />
                  <Route path="*" element={<Navigate to={`/domain/${selectedDomain}/dashboard`} replace />} />
                </Routes>
              </main>
            )}
          </div>
        </Router>
      </DataProvider>
    </ThemeProvider>
  )
}

export default App