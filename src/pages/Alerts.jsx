import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AlertTriangle, TrendingUp, Bell, Clock, Users, Activity, RefreshCw, Zap, Target, Lightbulb, Calendar, Briefcase } from 'lucide-react'
import { useData } from '../context/DataContext'
import LoadingSpinner from '../components/LoadingSpinner'

const Alerts = () => {
  const { domainKey } = useParams()
  const { fetchData, isLoading } = useData()
  const [domainInfo, setDomainInfo] = useState(null)

  // Reset component state when domain changes
  useEffect(() => {
    setDomainInfo(null)
  }, [domainKey])

  // Domain-specific alert data
  const getDomainAlerts = (domain) => {
    const alertsData = {
      ai_ml: {
        title: "Artificial Intelligence & Machine Learning",
        emoji: "🧠",
        competitors: ["OpenAI", "Anthropic", "DeepMind", "Hugging Face", "Stability AI"],
        alerts: [
          {
            id: 1,
            company: "OpenAI",
            title: "OpenAI launches \"Omni-3\" multimodal engine",
            date: "Sept 25, 2025",
            description: "Adds persistent conversational memory and fine-tuned coding agent for enterprise developers.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 2,
            company: "Anthropic",
            title: "Anthropic unveils \"Claude Next\" with offline inference mode",
            date: "Sept 28, 2025",
            description: "Designed for regulated sectors — key push toward local LLM deployment.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 3,
            company: "DeepMind",
            title: "DeepMind introduces \"AlphaResearch\" autonomous science model",
            date: "Oct 2, 2025",
            description: "AI that designs experiments and generates hypotheses — focus on pharmaceutical discovery.",
            type: "innovation",
            severity: "high"
          },
          {
            id: 4,
            company: "Hugging Face",
            title: "Hugging Face partners with Snowflake",
            date: "Sept 30, 2025",
            description: "Enables direct model hosting and versioning inside enterprise data warehouses.",
            type: "partnership",
            severity: "medium"
          },
          {
            id: 5,
            company: "Stability AI",
            title: "Stability AI pivots toward \"Stable Agent\" platform",
            date: "Oct 1, 2025",
            description: "Move from image generation to multi-modal agents for marketing and creative automation.",
            type: "strategy_shift",
            severity: "medium"
          }
        ],
        customerTrend: {
          title: "Customer Demand Trend",
          date: "Late Sept 2025",
          description: "B2B clients asking for auditable AI models, long-term context memory, and energy-efficient inference."
        },
        marketResponse: {
          title: "Market Response",
          date: "Oct 4, 2025",
          description: "Anthropic and OpenAI both announced responsible fine-tuning dashboards post EU AI Act update."
        }
      },
      cloud: {
        title: "Cloud Computing & SaaS",
        emoji: "☁️",
        competitors: ["AWS", "Microsoft Azure", "Google Cloud", "Salesforce", "Oracle"],
        alerts: [
          {
            id: 1,
            company: "AWS",
            title: "AWS launches CostGuard AI for real-time spend anomaly detection",
            date: "Sept 20, 2025",
            description: "Advanced AI-powered cost monitoring system that detects spending anomalies in real-time and provides automated recommendations.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 2,
            company: "Microsoft Azure",
            title: "Microsoft Azure introduces Confidential Containers for secure AI workloads",
            date: "Sept 24, 2025",
            description: "Hardware-encrypted containers that protect sensitive AI models and data during processing with enhanced security features.",
            type: "security_feature",
            severity: "high"
          },
          {
            id: 3,
            company: "Google Cloud",
            title: "Google Cloud adds Vertex AI Agent Builder for internal knowledge-based chatbots",
            date: "Sept 29, 2025",
            description: "New platform for building enterprise chatbots that can access and utilize internal company knowledge bases.",
            type: "platform_launch",
            severity: "high"
          },
          {
            id: 4,
            company: "Salesforce",
            title: "Salesforce rolls out Data Cloud GPT for AI-driven marketing campaigns",
            date: "Oct 1, 2025",
            description: "Generative AI platform that creates personalized marketing campaigns using customer data insights.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 5,
            company: "Oracle",
            title: "Oracle announces CloudOS 5, a unified infrastructure console",
            date: "Oct 3, 2025",
            description: "Comprehensive cloud infrastructure management platform that unifies multi-cloud operations and monitoring.",
            type: "product_launch",
            severity: "medium"
          }
        ],
        customerTrend: {
          title: "Customer Trends",
          date: "Late Sept 2025",
          description: "Enterprises demand multi-cloud cost visibility and AI workload governance."
        },
        marketResponse: {
          title: "Competitive Signal",
          date: "Oct 2025",
          description: "AWS and Azure accelerating edge AI inference services."
        }
      },
      cybersecurity: {
        title: "Cybersecurity & Data Privacy",
        emoji: "🔐",
        competitors: ["Palo Alto Networks", "CrowdStrike", "Fortinet", "Cloudflare", "Check Point"],
        alerts: [
          {
            id: 1,
            company: "Palo Alto Networks",
            title: "Palo Alto Networks launches Prisma Cloud Zero Trust 2.0 with AI threat detection",
            date: "Oct 4, 2025",
            description: "Advanced Zero Trust architecture featuring AI-powered threat detection and automated response capabilities.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 2,
            company: "CrowdStrike",
            title: "CrowdStrike introduces Falcon Sentinel for automated insider threat prevention",
            date: "Oct 2, 2025",
            description: "Behavioral analytics platform that automatically detects and prevents insider threats using machine learning.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 3,
            company: "Fortinet",
            title: "Fortinet upgrades FortiAI Firewall with adaptive anomaly detection",
            date: "Oct 1, 2025",
            description: "Enhanced firewall system with machine learning-based adaptive anomaly detection and response.",
            type: "product_upgrade",
            severity: "high"
          },
          {
            id: 4,
            company: "Cloudflare",
            title: "Cloudflare rolls out R2 AI Bot Management to prevent malicious automation",
            date: "Sept 30, 2025",
            description: "AI-powered bot management system that identifies and blocks malicious automated traffic in real-time.",
            type: "feature_launch",
            severity: "medium"
          },
          {
            id: 5,
            company: "Check Point",
            title: "Check Point releases Infinity AI Guard for real-time ransomware monitoring",
            date: "Sept 28, 2025",
            description: "Real-time ransomware detection and prevention system using advanced AI algorithms and behavioral analysis.",
            type: "product_launch",
            severity: "high"
          }
        ],
        customerTrend: {
          title: "Customer Trends",
          date: "Late Sept 2025",
          description: "Enterprises seeking proactive cloud security and automated compliance reporting."
        },
        marketResponse: {
          title: "Competitive Signal",
          date: "Oct 2025",
          description: "AI-driven cybersecurity solutions are rapidly replacing rule-based tools."
        }
      },
      web3: {
        title: "Web3, Blockchain & Crypto",
        emoji: "🌐",
        competitors: ["Coinbase", "Binance", "ConsenSys", "Chainalysis", "Polygon Labs"],
        alerts: [
          {
            id: 1,
            company: "Coinbase",
            title: "Coinbase launches NFT Wallet 2.0 with AI-based fraud detection",
            date: "Oct 6, 2025",
            description: "Enhanced NFT wallet featuring AI-powered fraud detection and prevention systems for secure digital asset management.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 2,
            company: "Binance",
            title: "Binance integrates Layer-2 staking solutions for DeFi projects",
            date: "Oct 4, 2025",
            description: "New Layer-2 staking infrastructure to support decentralized finance applications with improved scalability.",
            type: "integration",
            severity: "medium"
          },
          {
            id: 3,
            company: "ConsenSys",
            title: "ConsenSys introduces Quorum AI, a private blockchain management tool",
            date: "Oct 2, 2025",
            description: "AI-powered management platform for private blockchain networks and enterprise applications with enhanced governance.",
            type: "product_launch",
            severity: "medium"
          },
          {
            id: 4,
            company: "Chainalysis",
            title: "Chainalysis adds CryptoSentinel, AI-powered transaction monitoring for compliance",
            date: "Sept 30, 2025",
            description: "Advanced AI system for compliance-focused cryptocurrency transaction monitoring and regulatory reporting.",
            type: "feature_launch",
            severity: "high"
          },
          {
            id: 5,
            company: "Polygon Labs",
            title: "Polygon Labs releases Polygon zkEVM 2.0, improving scaling for enterprise dApps",
            date: "Sept 28, 2025",
            description: "Enhanced zero-knowledge Ethereum Virtual Machine for enterprise decentralized applications with improved performance.",
            type: "product_upgrade",
            severity: "high"
          }
        ],
        customerTrend: {
          title: "Customer Trends",
          date: "Late Sept 2025",
          description: "Demand for AI-driven blockchain insights and regulatory-compliant DeFi solutions."
        },
        marketResponse: {
          title: "Competitive Signal",
          date: "Oct 2025",
          description: "Adoption of zero-knowledge proofs accelerating across institutional clients."
        }
      },
      arvr: {
        title: "Augmented & Virtual Reality",
        emoji: "🕶️",
        competitors: ["Meta", "HTC Vive", "Niantic", "Magic Leap", "Varjo"],
        alerts: [
          {
            id: 1,
            company: "Meta",
            title: "Meta unveils Meta Vision Pro AR with real-time object recognition",
            date: "Oct 1, 2025",
            description: "Advanced AR headset featuring real-time object recognition and spatial computing capabilities for immersive experiences.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 2,
            company: "HTC Vive",
            title: "HTC Vive launches Vive XR Enterprise headset for remote collaboration",
            date: "Sept 29, 2025",
            description: "Enterprise-focused XR headset designed for remote work and virtual collaboration with enhanced productivity features.",
            type: "product_launch",
            severity: "medium"
          },
          {
            id: 3,
            company: "Niantic",
            title: "Niantic releases AR Map Builder for immersive location-based games",
            date: "Sept 27, 2025",
            description: "Development platform for creating immersive augmented reality location-based experiences and interactive games.",
            type: "platform_launch",
            severity: "medium"
          },
          {
            id: 4,
            company: "Magic Leap",
            title: "Magic Leap introduces Magic Leap AR SDK 3.0 with AI spatial understanding",
            date: "Sept 25, 2025",
            description: "Enhanced SDK featuring AI-powered spatial understanding and advanced object recognition capabilities.",
            type: "sdk_release",
            severity: "medium"
          },
          {
            id: 5,
            company: "Varjo",
            title: "Varjo unveils XR-2 AI, for photorealistic enterprise VR training",
            date: "Sept 23, 2025",
            description: "High-fidelity VR headset designed for enterprise training with photorealistic rendering and AI-enhanced simulations.",
            type: "product_launch",
            severity: "medium"
          }
        ],
        customerTrend: {
          title: "Customer Trends",
          date: "Late Sept 2025",
          description: "Companies investing in hybrid work AR/VR solutions."
        },
        marketResponse: {
          title: "Competitive Signal",
          date: "Oct 2025",
          description: "AR adoption accelerating in industrial and training sectors."
        }
      },
      robotics: {
        title: "Robotics & Automation",
        emoji: "🤖",
        competitors: ["Boston Dynamics", "ABB Robotics", "iRobot", "Fanuc", "UiPath"],
        alerts: [
          {
            id: 1,
            company: "Boston Dynamics",
            title: "Boston Dynamics launches Atlas 2.0 with advanced AI navigation",
            date: "Oct 3, 2025",
            description: "Next-generation humanoid robot featuring advanced AI-powered navigation and manipulation capabilities for complex environments.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 2,
            company: "ABB Robotics",
            title: "ABB Robotics releases YuMi AI, collaborative robots with deep learning vision",
            date: "Oct 1, 2025",
            description: "Collaborative robots equipped with deep learning-based computer vision systems for enhanced human-robot interaction.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 3,
            company: "iRobot",
            title: "iRobot introduces Roomba X AI, self-learning home cleaning robots",
            date: "Sept 29, 2025",
            description: "Advanced home cleaning robots with self-learning capabilities and adaptive cleaning patterns for optimal efficiency.",
            type: "product_launch",
            severity: "medium"
          },
          {
            id: 4,
            company: "Fanuc",
            title: "Fanuc unveils Robotics Edge AI, adaptive assembly line automation",
            date: "Sept 27, 2025",
            description: "Edge AI-powered robotics system for adaptive manufacturing and assembly line automation with real-time optimization.",
            type: "product_launch",
            severity: "medium"
          },
          {
            id: 5,
            company: "UiPath",
            title: "UiPath releases RPA AI 5.0, automating complex business workflows",
            date: "Sept 25, 2025",
            description: "Advanced robotic process automation platform for complex business workflow automation with intelligent decision-making.",
            type: "product_upgrade",
            severity: "medium"
          }
        ],
        customerTrend: {
          title: "Customer Trends",
          date: "Late Sept 2025",
          description: "Increased demand for autonomous logistics and intelligent factory robots."
        },
        marketResponse: {
          title: "Competitive Signal",
          date: "Oct 2025",
          description: "AI-powered automation is replacing rule-based industrial robots."
        }
      },
      semiconductors: {
        title: "Semiconductors & Hardware",
        emoji: "⚙️",
        competitors: ["Intel", "AMD", "NVIDIA", "TSMC", "Qualcomm"],
        alerts: [
          {
            id: 1,
            company: "Intel",
            title: "Intel announces Meteor Lake 14nm AI Chip for edge devices",
            date: "Oct 5, 2025",
            description: "New 14nm AI-optimized processor designed for edge computing and IoT applications with enhanced power efficiency.",
            type: "product_announcement",
            severity: "high"
          },
          {
            id: 2,
            company: "AMD",
            title: "AMD releases Ryzen AI Series 9000, optimized for generative workloads",
            date: "Oct 3, 2025",
            description: "High-performance processors specifically optimized for generative AI workloads with advanced neural processing units.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 3,
            company: "NVIDIA",
            title: "NVIDIA unveils H100X GPU for enterprise AI training",
            date: "Oct 1, 2025",
            description: "Next-generation GPU designed for large-scale enterprise AI model training with unprecedented computational power.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 4,
            company: "TSMC",
            title: "TSMC announces 3nm AI wafer production, enabling next-gen chip scaling",
            date: "Sept 29, 2025",
            description: "Advanced 3nm manufacturing process for next-generation AI chip production with improved performance and efficiency.",
            type: "manufacturing_milestone",
            severity: "high"
          },
          {
            id: 5,
            company: "Qualcomm",
            title: "Qualcomm launches Snapdragon AI Gen 3 for AR/VR devices",
            date: "Sept 27, 2025",
            description: "Specialized processor designed for augmented and virtual reality applications with enhanced AI processing capabilities.",
            type: "product_launch",
            severity: "medium"
          }
        ],
        customerTrend: {
          title: "Customer Trends",
          date: "Late Sept 2025",
          description: "Rising interest in AI accelerators for edge computing."
        },
        marketResponse: {
          title: "Competitive Signal",
          date: "Oct 2025",
          description: "Semiconductor R&D focused on energy-efficient AI hardware."
        }
      },
      quantum: {
        title: "Quantum Computing",
        emoji: "⚛️",
        competitors: ["IBM Quantum", "Rigetti", "IonQ", "D-Wave Systems", "Xanadu"],
        alerts: [
          {
            id: 1,
            company: "IBM Quantum",
            title: "IBM Quantum unveils Eagle Quantum Processor 2.0 with 2,000 qubits",
            date: "Oct 4, 2025",
            description: "Advanced quantum processor featuring 2,000 qubits for enhanced computational capability and improved error correction.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 2,
            company: "Rigetti",
            title: "Rigetti launches Forest AI, hybrid quantum-classical algorithm platform",
            date: "Oct 2, 2025",
            description: "Platform combining quantum and classical computing for hybrid algorithm development and optimization.",
            type: "platform_launch",
            severity: "medium"
          },
          {
            id: 3,
            company: "IonQ",
            title: "IonQ announces NextGen Ion Traps for error-corrected computation",
            date: "Sept 30, 2025",
            description: "Advanced ion trap technology for improved quantum error correction and enhanced computational stability.",
            type: "technology_announcement",
            severity: "medium"
          },
          {
            id: 4,
            company: "D-Wave Systems",
            title: "D-Wave Systems releases Advantage2, enhanced for optimization problems",
            date: "Sept 28, 2025",
            description: "Enhanced quantum annealing system optimized for complex optimization challenges and real-world applications.",
            type: "product_upgrade",
            severity: "medium"
          },
          {
            id: 5,
            company: "Xanadu",
            title: "Xanadu introduces PennyLane 2.0, integrating photonic quantum computing",
            date: "Sept 26, 2025",
            description: "Advanced quantum machine learning platform with photonic quantum computing integration and enhanced algorithms.",
            type: "platform_upgrade",
            severity: "medium"
          }
        ],
        customerTrend: {
          title: "Customer Trends",
          date: "Late Sept 2025",
          description: "Enterprises exploring quantum simulations for material design."
        },
        marketResponse: {
          title: "Competitive Signal",
          date: "Oct 2025",
          description: "Increased focus on quantum-classical hybrid AI solutions."
        }
      },
      consumer: {
        title: "Consumer Electronics",
        emoji: "📱",
        competitors: ["Apple", "Samsung", "Sony", "LG", "Xiaomi"],
        alerts: [
          {
            id: 1,
            company: "Apple",
            title: "Apple launches Vision Pro AR Glasses with spatial computing AI",
            date: "Sept 30, 2025",
            description: "Revolutionary AR glasses featuring advanced spatial computing and AI integration for immersive user experiences.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 2,
            company: "Samsung",
            title: "Samsung introduces Galaxy Z AI Fold with AI battery optimization",
            date: "Sept 28, 2025",
            description: "Foldable smartphone with AI-powered battery optimization and performance management for enhanced user experience.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 3,
            company: "Sony",
            title: "Sony releases PlayStation AI VR Kit for next-gen immersive gaming",
            date: "Sept 26, 2025",
            description: "Advanced VR gaming system with AI-enhanced immersive experiences and intelligent gameplay adaptation.",
            type: "product_launch",
            severity: "medium"
          },
          {
            id: 4,
            company: "LG",
            title: "LG unveils AI OLED TV 8K with real-time content enhancement",
            date: "Sept 24, 2025",
            description: "8K OLED television with AI-powered real-time content upscaling and enhancement for superior viewing quality.",
            type: "product_launch",
            severity: "medium"
          },
          {
            id: 5,
            company: "Xiaomi",
            title: "Xiaomi launches Smart AI Home Hub 5, integrating IoT appliances",
            date: "Sept 22, 2025",
            description: "Comprehensive smart home hub with AI-powered IoT device integration and intelligent automation capabilities.",
            type: "product_launch",
            severity: "medium"
          }
        ],
        customerTrend: {
          title: "Customer Trends",
          date: "Late Sept 2025",
          description: "High demand for AI-driven smart home integration."
        },
        marketResponse: {
          title: "Competitive Signal",
          date: "Oct 2025",
          description: "Companies rapidly merging consumer electronics + AI services."
        }
      },
      greentech: {
        title: "Green Tech & Energy Innovation",
        emoji: "🌱",
        competitors: ["Tesla Energy", "Enphase", "Siemens Energy", "Ørsted", "First Solar"],
        alerts: [
          {
            id: 1,
            company: "Tesla Energy",
            title: "Tesla Energy launches Autobidder AI v3, optimizing real-time energy trading",
            date: "Oct 5, 2025",
            description: "Advanced AI system for real-time energy trading optimization and intelligent grid management with predictive analytics.",
            type: "product_launch",
            severity: "high"
          },
          {
            id: 2,
            company: "Enphase",
            title: "Enphase releases IQ Envoy AI, predictive solar panel efficiency management",
            date: "Oct 3, 2025",
            description: "AI-powered system for predictive solar panel performance optimization and proactive maintenance scheduling.",
            type: "product_launch",
            severity: "medium"
          },
          {
            id: 3,
            company: "Siemens Energy",
            title: "Siemens Energy announces Smart Grid AI, for demand-response optimization",
            date: "Oct 1, 2025",
            description: "Intelligent grid management system with AI-driven demand-response optimization and energy distribution efficiency.",
            type: "product_announcement",
            severity: "medium"
          },
          {
            id: 4,
            company: "Ørsted",
            title: "Ørsted unveils Offshore Wind AI Monitoring, predictive maintenance platform",
            date: "Sept 29, 2025",
            description: "AI-powered predictive maintenance platform for offshore wind energy systems with advanced monitoring capabilities.",
            type: "platform_launch",
            severity: "medium"
          },
          {
            id: 5,
            company: "First Solar",
            title: "First Solar launches NextGen Thin-Film AI Panels with 22% efficiency",
            date: "Sept 27, 2025",
            description: "Advanced thin-film solar panels with AI optimization achieving 22% efficiency rating and enhanced durability.",
            type: "product_launch",
            severity: "high"
          }
        ],
        customerTrend: {
          title: "Customer Trends",
          date: "Late Sept 2025",
          description: "Increasing adoption of AI-driven renewable energy management."
        },
        marketResponse: {
          title: "Competitive Signal",
          date: "Oct 2025",
          description: "Green tech companies focusing on data-driven energy optimization."
        }
      }
    }
    
    return alertsData[domain] || alertsData.ai_ml
  }

  const loadDomainInfo = async () => {
    try {
      const domainsData = await fetchData('http://localhost:8002/api/domains', 'domains')
      if (domainsData && domainsData[domainKey]) {
        setDomainInfo(domainsData[domainKey])
      }
    } catch (error) {
      console.error('Error loading domain info:', error)
    }
  }

  useEffect(() => {
    if (domainKey) {
      loadDomainInfo()
    }
  }, [domainKey])

  const currentDomainAlerts = getDomainAlerts(domainKey)

  const getTypeIcon = (type) => {
    switch (type) {
      case 'product_launch':
        return <Zap className="text-blue-500" size={16} />
      case 'innovation':
        return <Lightbulb className="text-yellow-500" size={16} />
      case 'partnership':
        return <Users className="text-green-500" size={16} />
      case 'strategy_shift':
        return <Target className="text-purple-500" size={16} />
      case 'feature_launch':
        return <Activity className="text-cyan-500" size={16} />
      case 'security_feature':
        return <AlertTriangle className="text-red-500" size={16} />
      case 'api_launch':
        return <Activity className="text-indigo-500" size={16} />
      case 'open_source':
        return <Users className="text-emerald-500" size={16} />
      case 'integration':
        return <Target className="text-orange-500" size={16} />
      default:
        return <Bell className="text-gray-500" size={16} />
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

  if (isLoading('domains')) {
    return <LoadingSpinner text="Loading alerts..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-5xl">{currentDomainAlerts.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentDomainAlerts.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
              Tech Intelligence Feed • October 2025
            </p>
          </div>
        </div>

        {/* Competitors Tracked */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-blue-900 dark:text-blue-100">Competitors Tracked:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentDomainAlerts.competitors.map((competitor, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
              >
                {competitor}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Alerts</h2>
        </div>

        <div className="space-y-4">
          {currentDomainAlerts.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {alert.title}
                      </h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {alert.company}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{alert.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="capitalize">{alert.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Customer Trend */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              {currentDomainAlerts.customerTrend.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <Clock size={14} className="text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              {currentDomainAlerts.customerTrend.date}
            </span>
          </div>
          <p className="text-green-800 dark:text-green-200">
            {currentDomainAlerts.customerTrend.description}
          </p>
        </div>

        {/* Market Response */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              {currentDomainAlerts.marketResponse.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <Clock size={14} className="text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              {currentDomainAlerts.marketResponse.date}
            </span>
          </div>
          <p className="text-purple-800 dark:text-purple-200">
            {currentDomainAlerts.marketResponse.description}
          </p>
        </div>
      </div>

      {/* Status Footer */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Intelligence feed is live and monitoring
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts