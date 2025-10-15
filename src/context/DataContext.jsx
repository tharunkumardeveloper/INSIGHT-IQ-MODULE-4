import React, { createContext, useContext, useState, useCallback } from 'react'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [cache, setCache] = useState({})
  const [loading, setLoading] = useState({})

  const fetchData = useCallback(async (url, cacheKey) => {
    if (cache[cacheKey]) {
      return cache[cacheKey]
    }

    if (loading[cacheKey]) {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!loading[cacheKey]) {
            resolve(cache[cacheKey])
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
      })
    }

    setLoading(prev => ({ ...prev, [cacheKey]: true }))

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      setCache(prev => ({ ...prev, [cacheKey]: data }))
      setLoading(prev => ({ ...prev, [cacheKey]: false }))
      
      return data
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      setLoading(prev => ({ ...prev, [cacheKey]: false }))
      throw error
    }
  }, [cache, loading])

  const invalidateCache = useCallback((pattern) => {
    setCache(prev => {
      const newCache = { ...prev }
      Object.keys(newCache).forEach(key => {
        if (pattern && key.includes(pattern)) {
          delete newCache[key]
        }
      })
      return pattern ? newCache : {}
    })
  }, [])

  const refreshData = useCallback((domainKey) => {
    console.log(`Refreshing data for domain: ${domainKey}`)
    invalidateCache(domainKey)
  }, [invalidateCache])

  const clearAllCache = useCallback(() => {
    console.log('Clearing all cached data')
    setCache({})
  }, [])

  return (
    <DataContext.Provider value={{ 
      fetchData, 
      invalidateCache, 
      refreshData,
      clearAllCache,
      isLoading: (key) => loading[key] || false
    }}>
      {children}
    </DataContext.Provider>
  )
}