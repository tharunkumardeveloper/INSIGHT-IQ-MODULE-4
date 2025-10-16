import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle, CheckCircle, XCircle, Building2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import LoadingSpinner from '../components/LoadingSpinner'

const LogoWithFallback = ({ name, className = "w-12 h-12", domainKey }) => {
  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  const [showFallback, setShowFallback] = useState(false)

  const handleImageError = () => {
    if (currentPathIndex < getLogoPath(name, domainKey).length - 1) {
      setCurrentPathIndex(currentPathIndex + 1)
    } else {
      setShowFallback(true)
    }
  }

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

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  // Map company names to their actual logo file names
  const getLogoFileName = (name, domainKey) => {
    const lowerName = name.toLowerCase()

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

    return logoMappings[lowerName] || name.toLowerCase().replace(/\s+/g, ' ')
  }

  // Try multiple file extensions for logos
  const getLogoPath = (name, domainKey) => {
    const fileName = getLogoFileName(name, domainKey)
    const extensions = ['png', 'jpg', 'jpeg', 'webp', 'svg']
    return extensions.map(ext => `/logos/${domainKey}/${fileName}.${ext}`)
  }

  const logoPaths = getLogoPath(name, domainKey)

  if (showFallback) {
    return (
      <div className={`${className} flex items-center justify-center text-sm font-bold rounded-lg ${getCompanyColor(name)}`}>
        {getInitials(name)}
      </div>
    )
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden bg-white dark:bg-gray-100 border border-gray-200 dark:border-gray-600 flex items-center justify-center`}>
      <img
        src={logoPaths[currentPathIndex]}
        alt={`${name} logo`}
        className="w-full h-full object-contain"
        onError={handleImageError}
      />
    </div>
  )
}

const SWOTAnalysis = ({ swot }) => {
  const categories = [
    { key: 'strengths', title: 'Strengths', icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { key: 'weaknesses', title: 'Weaknesses', icon: XCircle, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' },
    { key: 'opportunities', title: 'Opportunities', icon: Target, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { key: 'threats', title: 'Threats', icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map(({ key, title, icon: Icon, color, bgColor }) => (
        <div key={key} className={`p-4 rounded-lg ${bgColor}`}>
          <div className="flex items-center space-x-2 mb-3">
            <Icon className={`h-5 w-5 ${color}`} />
            <h4 className={`font-semibold ${color}`}>{title}</h4>
          </div>
          <ul className="space-y-2">
            {swot[key]?.map((item, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const CompetitorCard = ({ competitor, domainKey }) => {
  const [showSWOT, setShowSWOT] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <LogoWithFallback name={competitor.name} className="w-16 h-16" domainKey={domainKey} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{competitor.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold text-green-600">{competitor.revenue}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">({competitor.revenueNote})</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowSWOT(!showSWOT)}
          className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          {showSWOT ? 'Hide SWOT' : 'Show SWOT'}
        </button>
      </div>

      {/* Recent Developments */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
          Recent Developments
        </h4>
        <ul className="space-y-2">
          {competitor.recentDevelopments?.map((development, index) => (
            <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              {development}
            </li>
          ))}
        </ul>
      </div>

      {/* SWOT Analysis */}
      {showSWOT && competitor.swot && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">SWOT Analysis</h4>
          <SWOTAnalysis swot={competitor.swot} />
        </div>
      )}
    </div>
  )
}

const Competitors = () => {
  const { domainKey } = useParams()
  const { fetchData, isLoading } = useData()
  const [domainInfo, setDomainInfo] = useState(null)

  // Comprehensive competitor data for all domains
  const getCompetitorData = (domain) => {
    const competitorData = {
      ai_ml: {
        title: "Artificial Intelligence & Machine Learning",
        emoji: "🧠",
        competitors: [
          {
            name: "OpenAI",
            revenue: "~$12 billion",
            revenueNote: "2025, annualized",
            recentDevelopments: [
              "Released GPT-5 API Pro with multimodal reasoning + persistent memory features",
              "Partnered with Broadcom to co-develop custom AI chips",
              "Elevated valuation via $500B secondary share transaction"
            ],
            swot: {
              strengths: [
                "Market leadership in generative AI, strong brand equity",
                "Strong monetization through subscriptions, enterprise API contracts",
                "Ability to attract infrastructure partnerships (e.g. chip / cloud deals)"
              ],
              weaknesses: [
                "Extremely high compute and operational costs",
                "Still operating at net losses due to scaling expense burden",
                "Limited transparency (closed-source models)"
              ],
              opportunities: [
                "On-device / edge deployment of lightweight models",
                "Verticalization: AI assistants for specific industry domains",
                "AI safety, compliance, audit tools as selling points"
              ],
              threats: [
                "Open-source LLMs encroaching on performance gaps",
                "Regulatory regimes imposing stricter control over large models",
                "Chip / hardware supply constraints"
              ]
            }
          },
          {
            name: "Anthropic",
            revenue: "~$7 billion",
            revenueNote: "run-rate target, 2025",
            recentDevelopments: [
              "Launched \"Haiku 4.5,\" a lower-cost efficient model option",
              "Positioning goal to triple annualized revenue by end of 2025"
            ],
            swot: {
              strengths: [
                "Branding and trust around AI safety & alignment",
                "Strategic positioning in regulated / compliance-sensitive markets",
                "Agile innovation pipeline"
              ],
              weaknesses: [
                "Smaller resource base than top-tier AI firms",
                "Infrastructure dependency on larger cloud providers",
                "Possibly slower scaling outside core safety niche"
              ],
              opportunities: [
                "Regulatory and compliance-driven adoption",
                "Serving regulated sectors (finance, healthcare) that demand safe AI",
                "Licensing safety tooling to broader AI developers"
              ],
              threats: [
                "More aggressive competitors catching up",
                "Regulation limiting model access or usage",
                "Open-source solutions integrating safety features"
              ]
            }
          },
          {
            name: "DeepMind",
            revenue: "Not publicly separated",
            revenueNote: "embedded in Alphabet's AI business",
            recentDevelopments: [
              "Announced \"AlphaResearch\" for autonomous experimental design",
              "Working toward hybrid models combining robotics + language"
            ],
            swot: {
              strengths: [
                "Deep academic / research foundation",
                "Access to Alphabet's capital, infrastructure, data",
                "Leading breakthroughs in scientific domains (e.g. biology)"
              ],
              weaknesses: [
                "Less visible commercialization vs standalone AI firms",
                "Greater inertia due to bureaucratic scale",
                "Translating research into accessible products"
              ],
              opportunities: [
                "Licensing scientific AI for biotech, materials, pharma",
                "Integration of DeepMind's breakthroughs into Google's product stack",
                "Spin-outs of commercial ventures"
              ],
              threats: [
                "Rapid commercialization by newer AI firms",
                "Policy/regulation in sensitive scientific domains",
                "Escalating cost of compute and infrastructure"
              ]
            }
          },
          {
            name: "Hugging Face",
            revenue: "Private / not publicly disclosed",
            revenueNote: "2025 estimate",
            recentDevelopments: [
              "Partnered with Snowflake to host models in warehouse environments",
              "Launched AutoTrain 2.0 to simplify model fine-tuning workflows"
            ],
            swot: {
              strengths: [
                "Massive open-source community backbone",
                "Developer-friendly tooling and familiarity",
                "Transparent philosophy and strong ecosystem pull"
              ],
              weaknesses: [
                "Tighter monetization constraints vs closed systems",
                "Limited exclusivity or proprietary IP",
                "Reliance on external hosting / infrastructure partners"
              ],
              opportunities: [
                "Enterprise hosting & MLOps for open models",
                "Edge deployment and local inference support",
                "Tooling for governance, model explainability"
              ],
              threats: [
                "Commercial providers replicating open models",
                "Licensing / licensing conflicts in open-source AI",
                "Competition in infrastructure-heavy model serving"
              ]
            }
          },
          {
            name: "Stability AI",
            revenue: "Private / undisclosed",
            revenueNote: "2025 estimate",
            recentDevelopments: [
              "Released Stable Diffusion XL 2.0 targeting enterprise use",
              "Pivoting more heavily toward Stable Agents / multimodal AI"
            ],
            swot: {
              strengths: [
                "Recognized brand in generative visual AI",
                "Strength in creative / media verticals",
                "Flexibility and speed of innovation"
              ],
              weaknesses: [
                "Narrower domain (visual / generative) compared to full-stack AI",
                "Revenue exposure high to usage spikes / API demand",
                "Legal / IP risks around generated content"
              ],
              opportunities: [
                "Expand into video, 3D, animation generation",
                "Partnerships with creative suites, game engines",
                "Licensing generative pipelines to media houses"
              ],
              threats: [
                "Competition from broader AI firms entering visuals",
                "Regulation on AI-generated content",
                "Infrastructure cost scaling"
              ]
            }
          }
        ]
      },
      cloud: {
        title: "Cloud Computing & SaaS",
        emoji: "☁️",
        competitors: [
          {
            name: "AWS",
            revenue: "≈ $117 billion",
            revenueNote: "annualized run-rate, Q1 2025",
            recentDevelopments: [
              "AWS revenues rose ~17% YoY in Q1 2025",
              "Introduced more \"P5\" Instances (GPU-heavy compute) and its own Trainium2 chips",
              "Facing capacity constraints in some regions but demand remains high"
            ],
            swot: {
              strengths: [
                "Market leader in cloud (largest IaaS/PaaS share globally)",
                "Broadest service offering, strong track record, and robust partner ecosystem",
                "Deep experience in large scale, high availability cloud services"
              ],
              weaknesses: [
                "Growth rate slowing in some quarters relative to competitors",
                "Infrastructure cost and energy inefficiency could be issues",
                "Increasing competition from Azure & Google pushing into lower margin territory"
              ],
              opportunities: [
                "Expand offerings in GenAI infrastructure, specialized AI services",
                "More custom hardware (GPUs, TPUs, etc.) and chips to reduce dependency and costs",
                "Opportunities in regulated industries with high-security / compliance demands"
              ],
              threats: [
                "Regulatory scrutiny (monopoly, pricing, data privacy) especially in EU & US",
                "Global infrastructure supply chain disruptions",
                "Competitors with more AI-native features could erode AWS's lead"
              ]
            }
          },
          {
            name: "Microsoft Azure",
            revenue: "≈ $75 billion",
            revenueNote: "Azure Annual Revenue FY2025",
            recentDevelopments: [
              "Azure surpassed $75B annual revenue in FY2025, growing ~34% year-over-year",
              "Microsoft expanded its datacenter footprint: over 400 data centres in 70+ regions",
              "Investments in specialized AI infrastructure (custom AI accelerators, more efficient cooling)"
            ],
            swot: {
              strengths: [
                "Huge scale and strong cross-workload growth (not only AI)",
                "Deep capital investment in infrastructure, enabling geographic reach and performance",
                "Strong ecosystem integration (Microsoft 365, Copilot, Azure services)"
              ],
              weaknesses: [
                "Very high capital and operating expenditures",
                "Complexity in maintaining consistency across many regions and workloads",
                "Competition with AWS and Google puts pressure on margins"
              ],
              opportunities: [
                "Increased demand for hybrid / sovereign / confidential cloud solutions",
                "AI & cloud convergence: more enterprises shifting workloads to cloud + AI-native",
                "Efficiency improvements via infrastructure innovations (cooling, data center optimization)"
              ],
              threats: [
                "Customer concerns over cloud provider lock-in and data sovereignty",
                "Regulatory pressures (antitrust, data privacy, AI regulation)",
                "Global supply constraints for hardware, extended costs and logistic risk"
              ]
            }
          },
          {
            name: "Google Cloud",
            revenue: "≈ $13.6 billion",
            revenueNote: "Q2 2025 revenue",
            recentDevelopments: [
              "Google Cloud achieved ~13% global cloud market share in Q2 2025",
              "Growth boosted by its Vertex AI platform, demand for GenAI workloads",
              "Strong AI modelling and efficiency differentiators (TPUs, custom infrastructure)"
            ],
            swot: {
              strengths: [
                "Strong AI/ML infrastructure (custom chips, TPU, Vertex AI) gives technical edge",
                "Good growth dynamics, accelerating cloud adoption",
                "Deep technical credibility and integration with Google's ecosystem"
              ],
              weaknesses: [
                "Still trailing AWS and Azure in total market share and reach",
                "Perception of slower go-to-market for enterprise cloud vs competitors",
                "Complexity in meeting regulatory / compliance needs in some regions"
              ],
              opportunities: [
                "More aggressive expansion of GenAI services tailored for enterprise",
                "Capitalizing on AI infrastructure investment wave",
                "Vertical specialization and edge cloud, plus local cloud data regions"
              ],
              threats: [
                "Competitive pressure from AWS & Azure on pricing and features",
                "Global regulatory constraints, especially concerning data privacy and AI integrity",
                "Infrastructure scaling costs, supply chain issues with chips / power"
              ]
            }
          },
          {
            name: "Salesforce",
            revenue: "≈ $32.5-$33 billion",
            revenueNote: "Full-Year Revenue FY2025",
            recentDevelopments: [
              "Rolling out AgentForce AI or similar generative AI platforms",
              "Expanded integrations of Salesforce's cloud services with AI assistants",
              "Increasing investment in data management and unified customer data platforms"
            ],
            swot: {
              strengths: [
                "Strong position in CRM / sales automation / SaaS with large existing customer base",
                "Deep domain expertise and trust among enterprise customers",
                "Continuous innovation in integrating AI into sales, service, marketing tools"
              ],
              weaknesses: [
                "Heavier dependency on subscription-software model; less infrastructure control",
                "Slower margin expansion relative to infrastructure cloud players",
                "Possible overlap / competition with Microsoft & AWS in broader cloud AI services"
              ],
              opportunities: [
                "Further AI-driven product enhancements in CRM, service, marketing automation",
                "Grow into adjacent cloud services (analytics, identity, etc.)",
                "Strategic partnerships with infrastructure cloud providers"
              ],
              threats: [
                "Large cloud providers encroaching into SaaS verticals",
                "Customer demand increasing for unified platforms vs fragmented tools",
                "Regulatory and data privacy demands from customers"
              ]
            }
          },
          {
            name: "Oracle",
            revenue: "~$53-$60 billion",
            revenueNote: "Cloud + License + Services FY2025",
            recentDevelopments: [
              "Oracle investing in autonomous database cloud and AI-augmented infrastructure",
              "Emphasis on Oracle's OCI (Oracle Cloud Infrastructure) with better price/performance",
              "Increasing appeal in regulated industries (financials, health) due to compliance"
            ],
            swot: {
              strengths: [
                "Long history in enterprise software and databases; strong installed base",
                "Capability in delivering secure, compliant solutions",
                "Growing cloud infrastructure offerings (OCI) that leverage Oracle's stack"
              ],
              weaknesses: [
                "Historically slow to adapt compared to hyper-scalers in innovation pace",
                "Cloud infrastructure still less feature-rich or less global in reach compared to Azure/AWS/Google",
                "Perception lag in AI-first culture or tools"
              ],
              opportunities: [
                "Expand OCI in non-Western / regulated markets",
                "Leverage strengths in database and enterprise apps to deliver AI-augmented SaaS + cloud bundles",
                "Capitalize on enterprises needing hybrid / private cloud solutions"
              ],
              threats: [
                "Intense price competition from AWS, Azure, Google",
                "Infrastructure investment cost challenges",
                "Customer shift toward open AI platforms or hybrid / multi-cloud patterns bypassing Oracle"
              ]
            }
          }
        ]
      },
      cybersecurity: {
        title: "Cybersecurity & Data Privacy",
        emoji: "🔐",
        competitors: [
          {
            name: "Palo Alto Networks",
            revenue: "≈ $8.0 billion",
            revenueNote: "FY2025 guidance range",
            recentDevelopments: [
              "Announced AI-driven security platform Cortex XSIAM 3.0 with integrated threat hunting",
              "Strategic focus on consolidating security tools into unified platforms",
              "Increased partnerships with hyperscalers for cloud workload protection"
            ],
            swot: {
              strengths: [
                "Market leader in next-gen firewalls and extended detection/response (XDR)",
                "Broad and deep platform ecosystem integrating cloud, endpoint, and network",
                "Consistent financial performance and innovation cadence"
              ],
              weaknesses: [
                "Product portfolio complexity can slow adoption",
                "Relatively premium pricing limits mid-market penetration"
              ],
              opportunities: [
                "Growth in AI-based SOC automation and incident response",
                "Cloud workload security and zero-trust expansion",
                "Consolidation of fragmented cybersecurity tools market"
              ],
              threats: [
                "Intensifying competition from CrowdStrike, Fortinet, and Microsoft Security",
                "Evolving regulatory pressures on data privacy and AI safety"
              ]
            }
          },
          {
            name: "CrowdStrike",
            revenue: "≈ $3.4 billion",
            revenueNote: "FY2025 ending Jan 2025",
            recentDevelopments: [
              "Launched Charlotte AI, a generative security analyst assistant",
              "Increased presence in SMB and mid-market via modular Falcon platform",
              "Strong adoption in EDR/XDR and cloud security workloads"
            ],
            swot: {
              strengths: [
                "Highly scalable cloud-native Falcon platform",
                "Recognized brand for endpoint protection and detection response",
                "Fast innovation cycle and customer satisfaction levels"
              ],
              weaknesses: [
                "Heavy reliance on endpoint market vs full-stack platform",
                "High valuation and competition may pressure margins"
              ],
              opportunities: [
                "Expansion into identity, cloud, and data protection layers",
                "AI-based autonomous threat detection and orchestration",
                "International expansion and government cybersecurity programs"
              ],
              threats: [
                "Price competition from platform vendors (Microsoft, Palo Alto)",
                "Supply chain attacks or breaches could damage trust"
              ]
            }
          },
          {
            name: "Fortinet",
            revenue: "≈ $5.4 billion",
            revenueNote: "2025 forecasts",
            recentDevelopments: [
              "Released new FortiOS 8.0 with deep AI threat analytics",
              "Investing in Secure SD-WAN and Operational Technology (OT) protection",
              "Expanding hardware appliance refresh cycles for high-throughput networks"
            ],
            swot: {
              strengths: [
                "Strong edge in performance-optimized security hardware",
                "Broad portfolio across network, endpoint, and OT",
                "Cost-effective solution attractive for enterprise and mid-market"
              ],
              weaknesses: [
                "Slower transition to fully cloud-native solutions",
                "Brand perception more hardware-centric vs software-driven rivals"
              ],
              opportunities: [
                "Expanding AI-based network detection and response (NDR)",
                "OT and industrial cybersecurity growth",
                "Partnerships with telecoms and IoT security providers"
              ],
              threats: [
                "Competitive pressure from software-native security vendors",
                "Hardware supply chain disruptions impacting delivery cycles"
              ]
            }
          },
          {
            name: "Cloudflare",
            revenue: "≈ $1.7 billion",
            revenueNote: "FY2025 guidance range",
            recentDevelopments: [
              "Expanded Cloudflare One zero-trust platform",
              "Launched Cloudflare AI Gateway for secure AI model requests",
              "Introduced data localization suite for EU/US compliance"
            ],
            swot: {
              strengths: [
                "Massive global edge network with >300 data centers",
                "Excellent brand and developer adoption",
                "High growth in zero-trust and AI-security gateways"
              ],
              weaknesses: [
                "Margins tighter due to expansion and infrastructure costs",
                "Less enterprise depth compared to Palo Alto or CrowdStrike"
              ],
              opportunities: [
                "Explosive growth in secure AI traffic management",
                "Partnerships with AI model providers and enterprises",
                "SME-friendly cybersecurity-as-a-service model"
              ],
              threats: [
                "Strong competition in CDN + security integration space",
                "Increasing data-sovereignty regulatory burdens"
              ]
            }
          },
          {
            name: "Check Point",
            revenue: "≈ $2.4 billion",
            revenueNote: "FY2025",
            recentDevelopments: [
              "Introduced Infinity AI Copilot for security analysts",
              "Increasing focus on cloud threat prevention and AI-enhanced automation",
              "Acquisition of smaller Israeli AI-security startups"
            ],
            swot: {
              strengths: [
                "Strong heritage and reputation in network security",
                "Highly profitable business with strong balance sheet",
                "Continued innovation in AI-assisted security operations"
              ],
              weaknesses: [
                "Slower top-line growth vs cloud-native competitors",
                "Perception as legacy firewall vendor still lingers"
              ],
              opportunities: [
                "Rebranding and cloud-security pivot",
                "Consolidation via strategic acquisitions",
                "AI-powered SOC automation"
              ],
              threats: [
                "Rapid innovation by Palo Alto, CrowdStrike, and Cloudflare",
                "Competitive pricing and evolving enterprise preferences"
              ]
            }
          }
        ]
      },
      web3: {
        title: "Web3, Blockchain & Crypto",
        emoji: "🌐",
        competitors: [
          {
            name: "Coinbase",
            revenue: "~$6.2–$6.6 billion",
            revenueNote: "2024 estimate",
            recentDevelopments: [
              "Continued product expansion into institutional custody and staking services",
              "Strategic investments in regional exchanges (e.g., recent investment in CoinDCX)",
              "Continued focus on regulatory compliance and expansion in Asia"
            ],
            swot: {
              strengths: [
                "Large retail & institutional user base, strong brand recognition in regulated markets",
                "Diversified revenue streams: trading fees, custody, staking, institutional products",
                "Public company with audited financials — visibility and credibility"
              ],
              weaknesses: [
                "Revenue is highly correlated with crypto market volumes and volatility",
                "Regulatory scrutiny increases compliance costs and constrains products",
                "Competition from lower-fee exchanges and on-chain DEXs"
              ],
              opportunities: [
                "Institutional custody & staking adoption growth, new revenue from derivatives",
                "Strategic expansion in high-growth regions (India/EM)",
                "Partnerships with traditional financial institutions"
              ],
              threats: [
                "Regulatory enforcement or restrictions in major markets (US, EU, APAC)",
                "Intensifying competition from Binance and regional exchanges",
                "Market downturns sharply reduce trading revenue"
              ]
            }
          },
          {
            name: "Binance",
            revenue: "~$16.8 billion",
            revenueNote: "2024 industry estimate",
            recentDevelopments: [
              "Continued product expansion across spot, derivatives, staking, and institutional services",
              "Strategic local partnerships (e.g., SoftBank's PayPay stake in Binance Japan)",
              "Regulatory normalization efforts in APAC"
            ],
            swot: {
              strengths: [
                "Largest exchange by trading volume and product breadth",
                "Global reach and deep liquidity across many tokens and pairs",
                "Fast product development and strong user acquisition"
              ],
              weaknesses: [
                "Ongoing regulatory and compliance challenges in multiple jurisdictions",
                "Public perception and trust issues in some markets",
                "Centralized control model susceptible to scrutiny"
              ],
              opportunities: [
                "Licensing and local partnerships to re-enter/expand in regulated markets",
                "Institutional services expansion (custody, OTC, tokenized assets)",
                "On-chain analytics & compliance tooling as paid services"
              ],
              threats: [
                "Regulatory action or fines in major markets",
                "Shift to decentralized exchanges (DEXs) and cross-chain liquidity solutions",
                "Competition from regulated local exchanges and banks entering crypto"
              ]
            }
          },
          {
            name: "ConsenSys",
            revenue: "~$90–100 million",
            revenueNote: "2025 estimate",
            recentDevelopments: [
              "Continued development of enterprise Ethereum tooling and developer stacks",
              "Focus on institutional-grade infrastructure and tooling for builders",
              "Enhanced Infura, MetaMask Business, and Truffle offerings"
            ],
            swot: {
              strengths: [
                "Strong developer tooling & enterprise-grade Ethereum stack",
                "Deep integration in Ethereum ecosystem and strong enterprise relationships"
              ],
              weaknesses: [
                "Revenue smaller and more service-/project-driven versus exchange business models",
                "Dependent on Ethereum ecosystem health and adoption"
              ],
              opportunities: [
                "Growing demand for enterprise Web3 infrastructure, tokenization",
                "Managed services and SaaS for institutions building on Ethereum"
              ],
              threats: [
                "Competition from other infrastructure providers (Alchemy, Ankr)",
                "Market consolidation and volatility affecting developer spend"
              ]
            }
          },
          {
            name: "Chainalysis",
            revenue: "~$200–250 million",
            revenueNote: "ARR 2024 estimate",
            recentDevelopments: [
              "Continues to publish market reports (Global Crypto Adoption Index)",
              "Expanded compliance/forensics tooling for exchanges and governments",
              "Enhanced AML and investigative capabilities"
            ],
            swot: {
              strengths: [
                "Market leader in blockchain forensics, compliance, and investigative tooling",
                "Trusted by exchanges, governments, and financial institutions"
              ],
              weaknesses: [
                "B2B sales cycles can be long (govt & enterprise)",
                "Reliance on institutional budgets and public sector procurement"
              ],
              opportunities: [
                "Rising regulatory requirements create recurring revenue opportunities",
                "Productization of analytics for DeFi and on-chain compliance"
              ],
              threats: [
                "Increased attempts by bad actors to obfuscate flows",
                "Competition from other analytics firms and in-house exchange capabilities"
              ]
            }
          },
          {
            name: "Polygon Labs",
            revenue: "Protocol-based revenue",
            revenueNote: "TVL and ecosystem metrics",
            recentDevelopments: [
              "Polygon ecosystem TVL and transaction throughputs expanded significantly",
              "Continued technical upgrades (zkEVM improvements, scaling/zk rollups)",
              "Partnerships with dApp builders and enterprise clients"
            ],
            swot: {
              strengths: [
                "Large developer community and low-cost, high-throughput L2 solutions",
                "Strong ecosystem of dApps, tooling, and active token economy"
              ],
              weaknesses: [
                "Protocol revenue capture is indirect (tokenomics, staking, ecosystem fees)",
                "Competition from other L2s and rollups"
              ],
              opportunities: [
                "Monetization through developer tools, node services, enterprise partnerships",
                "Onboarding enterprise dApps seeking low fees and fast settlement"
              ],
              threats: [
                "Technical and security risks in smart contract ecosystems",
                "Market rotation to other L2s or base layer scaling solutions"
              ]
            }
          }
        ]
      },
      arvr: {
        title: "Augmented & Virtual Reality",
        emoji: "🥽",
        competitors: [
          {
            name: "Meta",
            revenue: "≈ $2.1 billion",
            revenueNote: "Reality Labs Revenue 2024",
            recentDevelopments: [
              "Reality Labs continued hardware/software investments with mixed quarterly performance",
              "Product roadmap signals increased focus on AR passthrough and enterprise XR use-cases",
              "Enhanced headset upgrades and developer toolkits"
            ],
            swot: {
              strengths: [
                "Massive balance sheet to fund long-term XR R&D",
                "Dominant install base across social apps",
                "Deep vertical integration between platform, social reach, and headset hardware"
              ],
              weaknesses: [
                "Reality Labs has produced large cumulative operating losses historically",
                "Consumer demand for Metaverse products has been uneven"
              ],
              opportunities: [
                "Enterprise XR for training, collaboration, and simulation (higher AR/VR ARPU)",
                "Improved AR features (retina-quality passthrough, spatial computing)"
              ],
              threats: [
                "Consumer adoption risk and continued skepticism on 'metaverse' value",
                "Regulatory and privacy implications for persistent AR experiences"
              ]
            }
          },
          {
            name: "HTC Vive",
            revenue: "~$97 million",
            revenueNote: "HTC TTM mid-2025",
            recentDevelopments: [
              "HTC continues to push Vive XR hardware and enterprise headsets",
              "Publishing regular monthly revenue updates",
              "Vive focuses on industrial / enterprise adoption"
            ],
            swot: {
              strengths: [
                "Established headset brand (Vive) with strong enterprise foothold",
                "Experience in high-performance VR hardware and developer SDKs"
              ],
              weaknesses: [
                "Small overall revenue base compared to hyperscalers",
                "Constrained R&D/hardware scale vs larger firms"
              ],
              opportunities: [
                "Niche enterprise markets (medical, manufacturing) that value premium hardware",
                "Partnerships with software vendors for vertical XR solutions"
              ],
              threats: [
                "Competition from larger ecosystem players (Meta, Apple)",
                "Hardware supply and component cost volatility"
              ]
            }
          },
          {
            name: "Niantic",
            revenue: "> $1 billion",
            revenueNote: "games revenue 2024, sold to Scopely",
            recentDevelopments: [
              "Sold game portfolio (including Pokémon Go) to Scopely for $3.5B",
              "Transitioning to spin out geospatial AR platform (Niantic Spatial)",
              "Focus on developer tools and location-based AR experiences"
            ],
            swot: {
              strengths: [
                "World-class experience in location-based AR",
                "Deep maps / geospatial dataset assets and developer-focused AR tooling"
              ],
              weaknesses: [
                "Games sale changes revenue profile",
                "Near-term revenue will depend on licensing and platform adoption"
              ],
              opportunities: [
                "Monetize geospatial platform via developer tools, enterprise AR",
                "Focus on AR cloud infrastructure — valuable, sticky enterprise product"
              ],
              threats: [
                "Losing direct consumer revenue after games sale",
                "Competition from other AR-cloud providers and big tech"
              ]
            }
          },
          {
            name: "Magic Leap",
            revenue: "~$308-750 million",
            revenueNote: "2025 estimates vary",
            recentDevelopments: [
              "Continues to commercialize AR for enterprise use",
              "Digital-twin visualization and industrial applications focus",
              "Attracted large strategic investors with substantial funding"
            ],
            swot: {
              strengths: [
                "Focused on enterprise AR with strong UX for spatial visualization",
                "Substantial funding and strategic investor backing"
              ],
              weaknesses: [
                "Private company with opaque financials",
                "Estimated revenues vary widely across trackers"
              ],
              opportunities: [
                "Enterprise digital-twin, simulation, and visualization markets",
                "Partnerships with large industrial customers (Siemens, etc.)"
              ],
              threats: [
                "Strong competitors scaling AR solutions (Meta, Apple)",
                "Capital intensity and hardware margin pressures"
              ]
            }
          },
          {
            name: "Varjo",
            revenue: "~$60–65 million",
            revenueNote: "2025 industry estimates",
            recentDevelopments: [
              "Continues to target premium enterprise VR/XR markets",
              "Focus on simulation, training, and design applications",
              "Raised rounds supporting specialized product development"
            ],
            swot: {
              strengths: [
                "High-end, photorealistic XR hardware",
                "Strong traction in simulation and training verticals (aviation, automotive)"
              ],
              weaknesses: [
                "Small overall revenue base and limited scale",
                "Limited scale compared to larger headset manufacturers"
              ],
              opportunities: [
                "Expand into enterprise services (simulation subscriptions, training-as-a-service)",
                "Licensing of vision/optics technology to other headset makers"
              ],
              threats: [
                "Larger players (Meta, Apple, Magic Leap) encroaching on enterprise segments",
                "Supply chain or component shortages harming device delivery"
              ]
            }
          }
        ]
      },
      robotics: {
        title: "Robotics & Automation",
        emoji: "🤖",
        competitors: [
          {
            name: "Boston Dynamics",
            revenue: "~$150–200 million",
            revenueNote: "2024 estimate",
            recentDevelopments: [
              "Hyundai continues expanding Boston Dynamics' role in industrial automation",
              "2025 roadmap focuses on AI integration for humanoid robot Atlas",
              "Spot and Stretch robots being deployed commercially across logistics"
            ],
            swot: {
              strengths: [
                "World leader in advanced robotics motion, balance, and agility",
                "Strong backing from Hyundai Motor Group enables industrial integration"
              ],
              weaknesses: [
                "High R&D costs and relatively small revenue base",
                "Limited large-scale manufacturing or SaaS-style recurring revenue streams"
              ],
              opportunities: [
                "Commercial scaling of Spot and Stretch robots for logistics",
                "Humanoid robotics and AI-driven automation partnerships"
              ],
              threats: [
                "Competitors introducing cheaper, less complex robots",
                "Long development cycles and cost barriers to mass adoption"
              ]
            }
          },
          {
            name: "ABB Robotics",
            revenue: "~$4.5–5 billion",
            revenueNote: "Robotics & Discrete Automation segment 2024",
            recentDevelopments: [
              "ABB launched new modular robot arms for EV and electronics assembly",
              "Expansion in collaborative robotics (cobots) and automation software",
              "Strengthened manufacturing footprint in China and Europe"
            ],
            swot: {
              strengths: [
                "Global industrial footprint and extensive customer base",
                "Diversified robotics portfolio serving multiple industries"
              ],
              weaknesses: [
                "High exposure to cyclical industrial demand",
                "Complex integration between robotics, automation, and software systems"
              ],
              opportunities: [
                "Increasing demand for automation in EV and electronics manufacturing",
                "AI-enabled predictive maintenance and robotic-as-a-service models"
              ],
              threats: [
                "Competition from Fanuc, Yaskawa, and emerging low-cost Chinese robotics firms",
                "Supply chain disruptions affecting precision component availability"
              ]
            }
          },
          {
            name: "iRobot",
            revenue: "$890 million",
            revenueNote: "2024 results",
            recentDevelopments: [
              "Amazon's planned $1.4B acquisition terminated due to EU antitrust objections",
              "Refocusing on profitability and next-gen Roomba AI mapping",
              "Pursuing licensing and smart home ecosystem partnerships"
            ],
            swot: {
              strengths: [
                "Strong consumer brand and market leadership in home cleaning robotics",
                "Large installed base with reliable data for AI-driven optimization"
              ],
              weaknesses: [
                "Profitability challenges and reliance on consumer discretionary spending",
                "Rising competition from Xiaomi, Roborock, Ecovacs"
              ],
              opportunities: [
                "Integration into smart home ecosystems via partnerships",
                "Subscription or service-based maintenance plans"
              ],
              threats: [
                "Market commoditization and shrinking margins",
                "Privacy/regulatory concerns tied to in-home data collection"
              ]
            }
          },
          {
            name: "Fanuc",
            revenue: "$6.1 billion",
            revenueNote: "2024 Financial Report",
            recentDevelopments: [
              "Continued dominance in CNC, servo motors, and industrial robots",
              "Announced major AI upgrades to robot vision and adaptive automation",
              "Expanding automation capacity for semiconductor and EV production"
            ],
            swot: {
              strengths: [
                "Pioneer and leader in industrial robotics with high reliability",
                "Strong balance sheet and consistent profitability"
              ],
              weaknesses: [
                "Slow pace of diversification beyond factory automation",
                "Conservative corporate culture limits risk-taking in AI"
              ],
              opportunities: [
                "Integration of AI and cloud robotics for predictive maintenance",
                "EV and semiconductor manufacturing automation"
              ],
              threats: [
                "Competition from ABB, Yaskawa, and KUKA",
                "Global manufacturing slowdowns and currency volatility"
              ]
            }
          },
          {
            name: "UiPath",
            revenue: "$1.36 billion",
            revenueNote: "FY2025 earnings report",
            recentDevelopments: [
              "Expanded automation platform with generative AI integrations (Autopilot)",
              "Focus on expanding automation in finance, healthcare, and government",
              "Growing developer community and ecosystem partnerships"
            ],
            swot: {
              strengths: [
                "Market leader in software automation (RPA) with broad platform adoption",
                "Strong developer ecosystem and enterprise partnerships"
              ],
              weaknesses: [
                "Heavy competition from Microsoft Power Automate and Automation Anywhere",
                "Dependence on enterprise IT budgets and ROI justification"
              ],
              opportunities: [
                "AI-driven automation growth across all industries",
                "Expansion into autonomous decision-making and workflow orchestration"
              ],
              threats: [
                "Rapid commoditization of low-code automation tools",
                "Potential margin compression due to pricing pressure"
              ]
            }
          }
        ]
      },
      semiconductors: {
        title: "Semiconductors & Hardware",
        emoji: "⚙️",
        competitors: [
          {
            name: "Intel",
            revenue: "$79 billion",
            revenueNote: "2024 Earnings Report",
            recentDevelopments: [
              "Expansion of Intel 20A and 18A process nodes for advanced manufacturing",
              "Investment in US fabs (Ohio & Arizona) to boost domestic chip production",
              "AI chip product launches for data centers and generative AI workloads"
            ],
            swot: {
              strengths: [
                "Industry-leading semiconductor design and fabrication capabilities",
                "Strong brand and long-standing enterprise and consumer relationships"
              ],
              weaknesses: [
                "Lagging behind TSMC in leading-edge process technology adoption",
                "Heavy reliance on PC and data center markets, sensitive to cyclical demand"
              ],
              opportunities: [
                "Growing AI, HPC, and autonomous vehicle semiconductor markets",
                "Expansion in foundry services for external customers"
              ],
              threats: [
                "Aggressive competition from AMD, NVIDIA, and TSMC",
                "Geopolitical tensions affecting supply chain and global market access"
              ]
            }
          },
          {
            name: "AMD",
            revenue: "$25.5 billion",
            revenueNote: "2024 Earnings Report",
            recentDevelopments: [
              "Continued market share gains in high-performance CPUs and GPUs",
              "Partnerships with cloud providers for AI and HPC workloads",
              "Launch of next-gen Ryzen and EPYC processors"
            ],
            swot: {
              strengths: [
                "Competitive CPU and GPU technology with strong performance benchmarks",
                "Agile product development and strong presence in gaming and data centers"
              ],
              weaknesses: [
                "Smaller manufacturing footprint; relies on TSMC for advanced chip production",
                "Limited diversification outside x86 CPU/GPU markets"
              ],
              opportunities: [
                "Expansion in AI, HPC, and cloud computing markets",
                "Strategic acquisitions and ecosystem partnerships"
              ],
              threats: [
                "Intel and NVIDIA competition in data center and gaming markets",
                "Supply chain dependency on TSMC for advanced nodes"
              ]
            }
          },
          {
            name: "NVIDIA",
            revenue: "$29.5 billion",
            revenueNote: "FY2024 Earnings",
            recentDevelopments: [
              "Dominance in AI GPUs and expansion in data center AI platforms",
              "Launch of Hopper and next-gen LLM-focused GPUs",
              "Growth in autonomous vehicle and AI enterprise solutions"
            ],
            swot: {
              strengths: [
                "Leader in AI computing and GPU technology",
                "Strong developer ecosystem and AI software platforms"
              ],
              weaknesses: [
                "Heavy reliance on GPU sales; limited CPU and diversified hardware revenue",
                "High R&D and capital expenditure"
              ],
              opportunities: [
                "AI boom and generative AI adoption in cloud, enterprise, and autonomous systems",
                "Expansion into edge AI and automotive markets"
              ],
              threats: [
                "Competition from AMD, Intel, and emerging AI chip startups",
                "Volatile demand cycles in gaming and crypto markets"
              ]
            }
          },
          {
            name: "TSMC",
            revenue: "$75 billion",
            revenueNote: "Annual Report 2024",
            recentDevelopments: [
              "Expansion of 3nm and 2nm process technologies for major clients",
              "Increasing manufacturing capacity in Taiwan, US, and Japan",
              "Focused on leading-edge foundry leadership with advanced process nodes"
            ],
            swot: {
              strengths: [
                "Global leader in semiconductor manufacturing with cutting-edge technology",
                "Diversified customer base including major tech firms"
              ],
              weaknesses: [
                "High capital expenditure required to maintain process leadership",
                "Geographic concentration creates geopolitical risk"
              ],
              opportunities: [
                "Growing demand for AI chips, high-performance computing, and mobile processors",
                "Expansion into new regions and new client segments"
              ],
              threats: [
                "Geopolitical tensions with China and Taiwan",
                "Competition from Samsung Foundry and Intel Foundry Services"
              ]
            }
          },
          {
            name: "Qualcomm",
            revenue: "$44 billion",
            revenueNote: "FY2024 Annual Report",
            recentDevelopments: [
              "Leadership in 5G chipsets and expansion into automotive and IoT markets",
              "Launch of Snapdragon 8 Gen 3 series for premium mobile devices",
              "Growing focus on AI and XR processing in mobile and edge devices"
            ],
            swot: {
              strengths: [
                "Strong IP portfolio in mobile and 5G technologies",
                "Leadership in mobile processors and connectivity solutions"
              ],
              weaknesses: [
                "Dependence on smartphone OEMs for revenue",
                "Limited presence in large-scale datacenter GPUs"
              ],
              opportunities: [
                "Growth in AI, XR, and automotive edge computing markets",
                "Licensing of 5G and semiconductor IP to other manufacturers"
              ],
              threats: [
                "Competition from MediaTek, Intel, and Apple in chip design",
                "Regulatory scrutiny on licensing and international trade"
              ]
            }
          }
        ]
      },
      quantum: {
        title: "Quantum Computing",
        emoji: "⚛️",
        competitors: [
          {
            name: "IBM Quantum",
            revenue: "$1.1 billion",
            revenueNote: "Quantum Division Estimate 2024",
            recentDevelopments: [
              "Deployment of 433-qubit Osprey processor",
              "Expansion of Quantum Network for enterprise partnerships",
              "Integration with cloud-based AI and HPC solutions"
            ],
            swot: {
              strengths: [
                "Industry pioneer with extensive quantum computing patents",
                "Strong enterprise client base and cloud integration capabilities"
              ],
              weaknesses: [
                "High costs and long R&D cycles",
                "Complexity of quantum technology adoption for mainstream customers"
              ],
              opportunities: [
                "Growing demand for quantum solutions in finance, chemistry, and logistics",
                "Collaboration with universities and startups to accelerate innovation"
              ],
              threats: [
                "Competition from specialized quantum startups and global tech giants",
                "Technological barriers and scaling challenges"
              ]
            }
          },
          {
            name: "Rigetti",
            revenue: "$120 million",
            revenueNote: "2024",
            recentDevelopments: [
              "Expansion of hybrid quantum-classical computing platform",
              "Partnerships with cloud providers for quantum computing access",
              "Development of Aspen-11 processor with enhanced qubit stability"
            ],
            swot: {
              strengths: [
                "Agile startup with focus on hybrid quantum solutions",
                "Proprietary quantum software stack for enterprise clients"
              ],
              weaknesses: [
                "Smaller scale compared to IBM and Google Quantum",
                "Reliance on external funding for R&D expansion"
              ],
              opportunities: [
                "Early adoption in finance, materials science, and cryptography",
                "Strategic partnerships with cloud and AI providers"
              ],
              threats: [
                "Rapidly evolving quantum hardware landscape",
                "Competition from better-funded global players"
              ]
            }
          },
          {
            name: "IonQ",
            revenue: "$90 million",
            revenueNote: "2024",
            recentDevelopments: [
              "Launch of next-generation trapped-ion quantum processors",
              "Partnership with Microsoft Azure Quantum for cloud services",
              "Increased qubit coherence and gate fidelity improvements"
            ],
            swot: {
              strengths: [
                "High-fidelity trapped-ion qubits with strong performance metrics",
                "Early mover in cloud-based quantum access"
              ],
              weaknesses: [
                "Revenue still limited; hardware scale smaller than IBM or Google",
                "High operational costs per qubit"
              ],
              opportunities: [
                "Expansion in enterprise quantum cloud services",
                "Research collaborations with industry and academia"
              ],
              threats: [
                "Competition from superconducting and photonic quantum startups",
                "Rapidly evolving technology and potential obsolescence"
              ]
            }
          },
          {
            name: "D-Wave Systems",
            revenue: "$60 million",
            revenueNote: "2024",
            recentDevelopments: [
              "Release of Advantage quantum annealer with 5000+ qubits",
              "Focus on optimization problems for enterprises",
              "Expansion of Leap quantum cloud platform"
            ],
            swot: {
              strengths: [
                "Leader in quantum annealing for optimization problems",
                "Cloud platform provides easy access for business applications"
              ],
              weaknesses: [
                "Limited applicability for general-purpose quantum computing",
                "Small market compared to mainstream quantum startups"
              ],
              opportunities: [
                "Growing enterprise adoption for optimization and AI integration",
                "Expansion into logistics, finance, and energy optimization problems"
              ],
              threats: [
                "Competition from gate-based quantum hardware startups",
                "Uncertainty in market adoption for specialized annealing solutions"
              ]
            }
          },
          {
            name: "Xanadu",
            revenue: "$40 million",
            revenueNote: "2024",
            recentDevelopments: [
              "Development of photonic quantum computers and Strawberry Fields software",
              "Cloud-based quantum computing platform for research and enterprise",
              "Expansion of partnerships in AI and quantum simulations"
            ],
            swot: {
              strengths: [
                "Unique photonic approach with strong potential for scaling",
                "Strong software ecosystem for quantum programming and simulation"
              ],
              weaknesses: [
                "Early-stage revenue and market adoption",
                "Limited hardware deployment compared to superconducting qubit companies"
              ],
              opportunities: [
                "Expansion in quantum machine learning and optimization solutions",
                "Collaboration with universities and research institutions"
              ],
              threats: [
                "Competing quantum technologies may dominate enterprise adoption",
                "Funding and R&D challenges in early-stage photonic hardware"
              ]
            }
          }
        ]
      },
      consumer: {
        title: "Consumer Electronics",
        emoji: "📱",
        competitors: [
          {
            name: "Apple",
            revenue: "$428 billion",
            revenueNote: "2024",
            recentDevelopments: [
              "Launch of iPhone 16 series with AI-powered camera features",
              "Expansion of AR/VR headset product line",
              "Growth in services segment (Apple TV+, iCloud, App Store)"
            ],
            swot: {
              strengths: [
                "Strong brand loyalty and ecosystem integration",
                "High-margin products and premium positioning"
              ],
              weaknesses: [
                "Dependence on iPhone for majority of revenue",
                "Premium pricing limits mass market penetration"
              ],
              opportunities: [
                "Expansion in AR/VR and AI-driven consumer devices",
                "Growth in subscription services and wearables"
              ],
              threats: [
                "Intense competition from Samsung, Xiaomi, and emerging Chinese brands",
                "Supply chain disruptions and component shortages"
              ]
            }
          },
          {
            name: "Samsung",
            revenue: "$250 billion",
            revenueNote: "2024",
            recentDevelopments: [
              "Launch of Galaxy Z Fold and Flip series",
              "Expansion of semiconductor and display technology",
              "Strengthening smart home ecosystem with IoT devices"
            ],
            swot: {
              strengths: [
                "Diversified product portfolio and strong hardware capabilities",
                "Global distribution network and brand recognition"
              ],
              weaknesses: [
                "Profit margins lower than Apple in premium segment",
                "Heavy reliance on smartphone and semiconductor markets"
              ],
              opportunities: [
                "Growth in foldable devices and smart home solutions",
                "Expansion in emerging markets with affordable devices"
              ],
              threats: [
                "Competition from Apple, Xiaomi, and Oppo in smartphones",
                "Market saturation in mature regions"
              ]
            }
          },
          {
            name: "Sony",
            revenue: "$95 billion",
            revenueNote: "2024",
            recentDevelopments: [
              "Launch of PlayStation 6 rumors and next-gen gaming tech",
              "Expansion in camera, audio, and TV segments",
              "Investments in AI and VR for gaming experiences"
            ],
            swot: {
              strengths: [
                "Strong gaming and entertainment portfolio",
                "Innovative hardware and brand heritage"
              ],
              weaknesses: [
                "Limited presence in smartphones compared to Apple and Samsung",
                "Dependency on gaming and entertainment sectors"
              ],
              opportunities: [
                "Expansion in gaming subscriptions and VR content",
                "Leveraging AI for smart TVs and camera technology"
              ],
              threats: [
                "Competition from Microsoft, Nintendo, and emerging gaming startups",
                "Rapid tech changes in consumer electronics"
              ]
            }
          },
          {
            name: "LG",
            revenue: "$70 billion",
            revenueNote: "2024",
            recentDevelopments: [
              "Focus on home appliances, smart TVs, and OLED displays",
              "Expansion of energy-efficient electronics",
              "Innovations in smart home devices and AI integration"
            ],
            swot: {
              strengths: [
                "Leader in OLED display technology",
                "Strong brand presence in home appliances"
              ],
              weaknesses: [
                "Smaller presence in smartphones compared to competitors",
                "Moderate global brand recognition in premium electronics"
              ],
              opportunities: [
                "Growth in smart home, energy-efficient appliances, and OLED adoption",
                "Collaboration with tech firms for AI-enabled devices"
              ],
              threats: [
                "Competition from Samsung, Xiaomi, and new smart appliance brands",
                "Market volatility in consumer electronics and energy costs"
              ]
            }
          },
          {
            name: "Xiaomi",
            revenue: "$55 billion",
            revenueNote: "2024",
            recentDevelopments: [
              "Expansion of budget-friendly smartphones with high specs",
              "Growth in IoT ecosystem including smart home devices",
              "Investments in electric vehicles and AI-driven hardware"
            ],
            swot: {
              strengths: [
                "Aggressive pricing strategy and broad product portfolio",
                "Rapid growth in emerging markets"
              ],
              weaknesses: [
                "Lower brand loyalty in premium segment",
                "Profit margins thinner than competitors"
              ],
              opportunities: [
                "Expansion in global markets and smart home ecosystem",
                "Growth in AI, wearables, and connected devices"
              ],
              threats: [
                "Competition from Apple, Samsung, and local Chinese brands",
                "Regulatory challenges and geopolitical tensions affecting supply chain"
              ]
            }
          }
        ]
      },
      greentech: {
        title: "Green Tech & Energy Innovation",
        emoji: "🌱",
        competitors: [
          {
            name: "Tesla Energy",
            revenue: "$31 billion",
            revenueNote: "2024",
            recentDevelopments: [
              "Expansion of solar roof and Powerwall installations globally",
              "Integration of AI and battery storage in energy solutions",
              "Investment in large-scale energy storage projects"
            ],
            swot: {
              strengths: [
                "Strong brand and innovation in clean energy",
                "Vertically integrated energy and storage solutions"
              ],
              weaknesses: [
                "High costs may limit mass adoption",
                "Heavy reliance on U.S. market"
              ],
              opportunities: [
                "Global demand for renewable energy and EV-related storage solutions",
                "Expansion into grid-scale battery storage and solar solutions"
              ],
              threats: [
                "Competition from established energy companies and startups",
                "Regulatory changes and tariffs on solar imports"
              ]
            }
          },
          {
            name: "Enphase",
            revenue: "$3.6 billion",
            revenueNote: "2024",
            recentDevelopments: [
              "Launch of next-gen microinverters for residential solar",
              "Expansion in Europe and Asia markets",
              "Integration with smart home and energy management platforms"
            ],
            swot: {
              strengths: [
                "Leader in microinverter technology",
                "Strong focus on residential solar solutions"
              ],
              weaknesses: [
                "Limited presence in utility-scale projects",
                "Smaller brand recognition compared to Tesla"
              ],
              opportunities: [
                "Growth in residential solar adoption globally",
                "Partnerships with energy companies for smart grid integration"
              ],
              threats: [
                "Competition from SolarEdge, Tesla Energy, and local manufacturers",
                "Supply chain constraints and rising component costs"
              ]
            }
          },
          {
            name: "Siemens Energy",
            revenue: "$64 billion",
            revenueNote: "2024",
            recentDevelopments: [
              "Expansion in wind and renewable energy projects worldwide",
              "Development of green hydrogen technology",
              "Investments in smart grid and energy digitalization"
            ],
            swot: {
              strengths: [
                "Global presence and diversified energy portfolio",
                "Expertise in industrial-scale renewable solutions"
              ],
              weaknesses: [
                "Large organizational structure can slow innovation",
                "Exposure to fluctuating energy markets"
              ],
              opportunities: [
                "Growth in renewable energy projects and hydrogen solutions",
                "Partnerships with governments for clean energy transitions"
              ],
              threats: [
                "Intense competition from renewable-focused startups",
                "Geopolitical risks affecting energy contracts"
              ]
            }
          },
          {
            name: "Ørsted",
            revenue: "$13 billion",
            revenueNote: "2024",
            recentDevelopments: [
              "Leading offshore wind projects in Europe and Asia",
              "Expansion into green hydrogen initiatives",
              "Strategic partnerships for sustainable energy investments"
            ],
            swot: {
              strengths: [
                "Leader in offshore wind energy",
                "Strong government and industrial partnerships"
              ],
              weaknesses: [
                "Revenue concentrated in wind energy",
                "Limited diversification beyond renewables"
              ],
              opportunities: [
                "Expansion in Asia-Pacific offshore wind markets",
                "Integration with hydrogen and storage technologies"
              ],
              threats: [
                "Competition from other renewable energy companies",
                "Regulatory and permitting challenges in new markets"
              ]
            }
          },
          {
            name: "First Solar",
            revenue: "$4.5 billion",
            revenueNote: "2024",
            recentDevelopments: [
              "Launch of advanced thin-film solar modules",
              "Expansion of utility-scale solar projects in North America and India",
              "R&D focus on solar efficiency and recycling"
            ],
            swot: {
              strengths: [
                "Strong technology in thin-film solar modules",
                "Established presence in utility-scale solar projects"
              ],
              weaknesses: [
                "Limited presence in residential solar market",
                "Heavy reliance on North American projects"
              ],
              opportunities: [
                "Growth in global utility-scale solar demand",
                "Strategic partnerships for solar storage integration"
              ],
              threats: [
                "Competition from global solar manufacturers",
                "Trade restrictions and fluctuating raw material prices"
              ]
            }
          }
        ]
      }
    }

    return competitorData[domain] || competitorData.ai_ml
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
  }, [domainKey, fetchData])

  const currentDomainData = getCompetitorData(domainKey)

  if (isLoading('domains')) {
    return <LoadingSpinner text="Loading competitors..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-5xl">{currentDomainData.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentDomainData.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
              Competitor Analysis & Market Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Competitors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentDomainData.competitors.map((competitor, index) => (
          <CompetitorCard key={index} competitor={competitor} domainKey={domainKey} />
        ))}
      </div>
    </div>
  )
}

export default Competitors 