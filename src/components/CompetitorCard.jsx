import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Activity, FileText, MessageSquare } from 'lucide-react'

const LogoWithFallback = ({ logoPaths, name, initials }) => {
  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  const [showFallback, setShowFallback] = useState(false)

  const handleImageError = () => {
    if (currentPathIndex < logoPaths.length - 1) {
      setCurrentPathIndex(currentPathIndex + 1)
    } else {
      setShowFallback(true)
    }
  }

  if (showFallback) {
    // Enhanced fallback with better styling
    const getCompanyColor = (name) => {
      const colors = [
        'bg-blue-500 text-white',
        'bg-green-500 text-white', 
        'bg-purple-500 text-white',
        'bg-red-500 text-white',
        'bg-indigo-500 text-white',
        'bg-pink-500 text-white',
        'bg-yellow-500 text-black',
        'bg-teal-500 text-white',
        'bg-orange-500 text-white',
        'bg-cyan-500 text-white'
      ]
      
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      const colorIndex = Math.abs(hash) % colors.length
      return colors[colorIndex]
    }

    return (
      <div className={`w-full h-full flex items-center justify-center text-xs font-bold rounded ${getCompanyColor(name)}`}>
        {initials}
      </div>
    )
  }

  return (
    <img
      src={logoPaths[currentPathIndex]}
      alt={`${name} logo`}
      className="w-full h-full object-contain rounded"
      onError={handleImageError}
    />
  )
}

const CompetitorCard = ({ competitor, domainKey }) => {
  const { name, news_count, social_mentions, sentiment } = competitor

  const getSentimentColor = (score) => {
    if (score > 0.1) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (score < -0.1) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }

  const getSentimentIcon = (score) => {
    if (score > 0.1) return <TrendingUp size={14} />
    if (score < -0.1) return <TrendingDown size={14} />
    return <Activity size={14} />
  }

  // Generate initials for logo fallback
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  // Map company names to their actual logo file names
  const getLogoFileName = (name, domainKey) => {
    const lowerName = name.toLowerCase()
    
    // Create comprehensive mapping for actual file names based on what exists in logos directory
    const logoMappings = {
      // AI/ML domain
      'openai': 'openai',
      'anthropic': 'anthropic', 
      'deepmind': 'deepmind',
      'hugging face': 'huggingface',
      'stability ai': 'stability ai',
      
      // Cloud domain
      'aws': 'AWS',
      'microsoft azure': 'azure',
      'google cloud': 'google cloud',
      'salesforce': 'salesforce',
      'oracle': 'oracle',
      
      // Cybersecurity domain
      'palo alto networks': 'palo alto',
      'crowdstrike': 'crowdstrike',
      'fortinet': 'fortinet',
      'cloudflare': 'cloudflare',
      'check point': 'check point',
      
      // Web3 domain
      'coinbase': 'coinbase',
      'binance': 'binance',
      'consensys': 'consensys',
      'chainalysis': 'chainalysis',
      'polygon labs': 'polygon labs',
      
      // AR/VR domain
      'meta': 'meta',
      'htc vive': 'htc vive',
      'niantic': 'niantic',
      'magic leap': 'magic leap',
      'varjo': 'varjo',
      
      // Robotics domain
      'boston dynamics': 'Boston Dynamics',
      'abb robotics': 'abb robotics',
      'irobot': 'irobot',
      'fanuc': 'fanuc',
      'uipath': 'ui path',
      
      // Quantum domain
      'ibm quantum': 'IBM Quantum',
      'rigetti': 'rigetti',
      'ionq': 'ionq',
      'd-wave systems': 'd-wave systems',
      'xanadu': 'xanadu',
      
      // Consumer domain
      'apple': 'Apple',
      'samsung': 'samsung electronics',
      'sony': 'sony',
      'lg': 'LG electronics',
      'xiaomi': 'xiaomi',
      
      // Green Tech domain
      'tesla energy': 'Tesla',
      'enphase': 'enphase energy',
      'siemens energy': 'siemens energy',
      'ørsted': 'orsted',
      'first solar': 'first solar',
      
      // Semiconductors domain
      'intel': 'Intel',
      'amd': 'AMD',
      'nvidia': 'nvidia',
      'tsmc': 'tsmc',
      'qualcomm': 'qualcomm'
    }
    
    // Get the mapped filename or fallback to processed name
    const mappedName = logoMappings[lowerName] || name.toLowerCase().replace(/\s+/g, ' ')
    return mappedName
  }

  // Try multiple file extensions for logos
  const getLogoPath = (name, domainKey) => {
    const fileName = getLogoFileName(name, domainKey)
    const extensions = ['png', 'jpg', 'jpeg', 'webp', 'svg']
    return extensions.map(ext => `/logos/${domainKey}/${fileName}.${ext}`)
  }

  const logoPaths = getLogoPath(name, domainKey)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 rounded bg-white dark:bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
          <LogoWithFallback 
            logoPaths={logoPaths}
            name={name}
            initials={getInitials(name)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {name}
          </h3>
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(sentiment)}`}>
            {getSentimentIcon(sentiment)}
            <span>{sentiment.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
            <FileText size={14} />
            <span>News</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{news_count}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
            <MessageSquare size={14} />
            <span>Social</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{social_mentions}</span>
        </div>
      </div>

      {/* Simple sparkline placeholder */}
      <div className="mt-3 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-end justify-center space-x-1 px-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-blue-500 rounded-sm"
            style={{
              height: `${Math.random() * 20 + 10}px`,
              width: '3px'
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default CompetitorCard