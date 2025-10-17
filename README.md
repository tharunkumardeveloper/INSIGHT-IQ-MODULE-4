# 🚀 INSIGHTIQ - Strategic Intelligence Platform

**Transform data into strategic intelligence across 10 cutting-edge technology domains**

InsightIQ is a comprehensive web application that provides real-time market intelligence, competitive analysis, and automated insights across 10 major technology sectors. Built for strategic decision-makers, product managers, and market analysts who need actionable intelligence to stay ahead of the competition.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 16+](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68+-red.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## ✨ Key Features

### 🎯 Strategic Intelligence Core
- **Multi-Domain Coverage**: Track 10 major technology sectors with 50+ key competitors
- **Real-Time Analytics**: Live data processing with automated sentiment analysis using TextBlob
- **Intelligent Alerts**: AI-powered notifications for market shifts, competitor moves, and emerging trends
- **Competitive Intelligence**: Deep competitor analysis with mention tracking and sentiment monitoring
- **Interactive Dashboards**: 12+ chart types with responsive design and export capabilities

### 🔍 Advanced Analytics
- **Sentiment Analysis**: Automated sentiment scoring for news articles and social media posts
- **Trend Detection**: Keyword extraction and topic analysis for emerging market trends
- **Market Intelligence**: Real-time competitor mention tracking and market share analysis
- **Engagement Metrics**: Social media engagement tracking across platforms
- **Custom Filtering**: Advanced multi-criteria filtering across all data sources

## 🌐 Technology Domains Covered

InsightIQ provides comprehensive coverage across 10 strategic technology sectors:

| Domain | Key Players | Market Focus |
|--------|-------------|--------------|
| � ***AI & Machine Learning** | OpenAI, Anthropic, DeepMind, Hugging Face, Stability AI | LLMs, Foundation Models, AI Safety |
| ☁️ **Cloud Computing & SaaS** | AWS, Microsoft Azure, Google Cloud, Salesforce, Oracle | Infrastructure, Platform Services, Enterprise SaaS |
| 🔐 **Cybersecurity & Privacy** | Palo Alto Networks, CrowdStrike, Fortinet, Cloudflare, Check Point | Threat Detection, Zero Trust, Privacy Tech |
| 🌐 **Web3 & Blockchain** | Coinbase, Binance, ConsenSys, Chainalysis, Polygon Labs | DeFi, NFTs, Crypto Infrastructure |
| 🕶️ **AR/VR & Metaverse** | Meta, HTC Vive, Niantic, Magic Leap, Varjo | Mixed Reality, Spatial Computing |
| 🤖 **Robotics & Automation** | Boston Dynamics, ABB Robotics, iRobot, Fanuc, UiPath | Industrial Automation, Service Robots |
| ⚙️ **Semiconductors & Hardware** | Intel, AMD, NVIDIA, TSMC, Qualcomm | AI Chips, Edge Computing, Manufacturing |
| ⚛️ **Quantum Computing** | IBM Quantum, Rigetti, IonQ, D-Wave Systems, Xanadu | Quantum Algorithms, Hardware, Cloud Access |
| 📱 **Consumer Electronics** | Apple, Samsung, Sony, LG, Xiaomi | Mobile Devices, Smart Home, Wearables |
| 🌱 **Green Tech & Energy** | Tesla Energy, Enphase, Siemens Energy, Ørsted, First Solar | Renewable Energy, Energy Storage, Smart Grid |

## 📊 Platform Architecture

### 🏠 Dashboard - Strategic Overview
- **Executive Summary**: Key metrics and KPIs across all tracked competitors
- **Competitor Intelligence Cards**Comprehensive ntimetitor reslysis and monitoring
- **Interactive Visualizations**: 4 dynamic charts including sentiment trends and market share
- **Data Preview**: Live CSV data feeds with real-time updates
- **Domain Switching**: Seamless navigation between technology sectors

Competitor Intellige Center
Theshboard featated **Compe Intelligence Hub** that provides dee into each comp

#*Competitor Cards Di## 📈 Ma
- **Visualrket Intellentification**: Automatic logo ligence - th intDeep Analfallbacks
- **Real-Tysi Sentiment Scosg**: Live sentiment analysis witolor-coded indic
- **🟢 **Positive Sentiment** Competitive Landscape**: Comprehensive competitor positioning and analysis  
- **Market Insights Panel**: AI-generated top 5 trends and strategic recommendations
- **Advanced Analytics**: Multi-series trend analysis, market share visualization, topic clustering
- **Sentiment vs Engagement**: Correlation analysis between public sentiment and market engagement
- **Export Capabilities**: Download reports and charts for strategic presentations

### 📰 News Intelligence - Media Monitoring
- **Real-Time News Feed**: Aggregated news articles with automated sentiment analysis
- **Source Intelligence**: Media source analysis and credibility scoring
- **Timeline Visualization**: Chronological news flow and trend identification
- **Advanced Filtering**: Multi-dimensional filtering by date, sentiment, source, and keywords
- **Trend Detection**: Automated identification of emerging topics and themes

### 📱 Social Intelligence - Social Listening
- **Social Media Monitoring**: Cross-platform social media post analysis
- **Influencer Intelligence**: Identification and tracking of key industry influencers
- **Engagement Analytics**: Deep dive into likes, shares, comments, and reach metrics
- **Platform Analysis**: Performance comparison across Twitter, LinkedIn, Reddit, and more
- **Sentiment Tracking**: Real-time sentiment analysis of social conversations

### 🚨 Intelligent Alerts - Automated Monitoring
- **AI-Powered Detection**: Automated identification of significant market events
  - **Mention Spikes**: Alerts when competitor mentions exceed 2x weekly average
  - **Sentiment Shifts**: Notifications for sentiment drops below -0.4 threshold
  - **Trending Topics**: Real-time detection of emerging industry themes
- **Alert Management**: Comprehensive alert lifecycle management with read/unread status
- **Severity Classification**: High, medium, and low priority alert categorization
- **Custom Notifications**: Configurable alert preferences and delivery methods

## 🛠️ Technology Stack & Architecture

### 🎨 Frontend Architecture
- **React 18** - Modern component-based UI with hooks and context
- **Vite** - Lightning-fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Recharts** - Powerful charting library with 12+ interactive chart types
- **React Router DOM** - Client-side routing and navigation
- **Lucide React** - Beautiful, customizable icon library
- **Axios** - HTTP client for API communication
- **Context API** - State management for theme and data caching

### ⚡ Backend Infrastructure  
- **FastAPI** - High-performance async Python web framework
- **Pandas** - Advanced data manipulation and analysis
- **TextBlob** - Natural language processing for sentiment analysis
- **Uvicorn** - Lightning-fast ASGI server
- **CORS Middleware** - Cross-origin resource sharing configuration
- **JSON Response Optimization** - UTF-8 encoding for international data

### 🔄 Data Processing Pipeline
- **Automated CSV Ingestion** - Dynamic file discovery and parsing
- **Real-Time Sentiment Analysis** - On-the-fly sentiment computation using TextBlob
- **Data Validation & Cleaning** - Robust error handling and data normalization  
- **Keyword Extraction** - Automated topic and trend identification
- **Competitor Mention Tracking** - Real-time competitor intelligence gathering
- **Alert Generation Engine** - AI-powered anomaly detection and notification system

### 🏗️ System Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   Data Layer    │
│   (React/Vite)  │◄──►│   (FastAPI)      │◄──►│   (CSV Files)   │
│                 │    │                  │    │                 │
│ • Dashboard     │    │ • Data Processing│    │ • News Data     │
│ • Market View   │    │ • Sentiment AI   │    │ • Social Data   │
│ • News Feed     │    │ • Alert Engine   │    │ • Logos/Assets  │
│ • Social Feed   │    │ • API Endpoints  │    │ • Config Files  │
│ • Alerts        │    │ • CORS Handler   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
insightiq/
├── 🔧 Backend Infrastructure
│   ├── backend/
│   │   ├── main.py                    # FastAPI server with 10+ API endpoints
│   │   ├── generate_sample_data.py    # Data generation utilities
│   │   └── __pycache__/               # Python bytecode cache
│
├── 🎨 Frontend Application  
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── charts/               # 12+ interactive chart components
│   │   │   │   ├── SentimentTrend.jsx
│   │   │   │   ├── CompetitorMentions.jsx
│   │   │   │   ├── SourceDistribution.jsx
│   │   │   │   ├── TopicTrends.jsx
│   │   │   │   ├── MarketShare.jsx
│   │   │   │   ├── EngagementScatter.jsx
│   │   │   │   └── [8+ more charts]
│   │   │   ├── CompetitorCard.jsx     # Competitor intelligence cards
│   │   │   ├── CSVViewer.jsx          # Data preview component
│   │   │   ├── DomainModal.jsx        # Domain selection interface
│   │   │   ├── LoadingSpinner.jsx     # Loading state management
│   │   │   ├── Navbar.jsx             # Navigation and theme toggle
│   │   │   ├── NewsCard.jsx           # News article display
│   │   │   ├── NewsFilters.jsx        # Advanced news filtering
│   │   │   ├── SocialCard.jsx         # Social media post display
│   │   │   ├── SocialFilters.jsx      # Social media filtering
│   │   │   └── InsightsPanel.jsx      # AI-generated insights
│   │   ├── context/                   # React Context providers
│   │   │   ├── DataContext.jsx        # Data caching and API management
│   │   │   └── ThemeContext.jsx       # Dark/light theme management
│   │   ├── pages/                     # Main application pages
│   │   │   ├── Dashboard.jsx          # Executive dashboard
│   │   │   ├── Market.jsx             # Market intelligence
│   │   │   ├── News.jsx               # News monitoring
│   │   │   ├── Social.jsx             # Social listening
│   │   │   └── Alerts.jsx             # Intelligent alerts
│   │   ├── App.jsx                    # Main application component
│   │   ├── main.jsx                   # React application entry point
│   │   └── index.css                  # Global styles and Tailwind
│
├── 📊 Data Assets
│   ├── data/                          # CSV data files (20 files)
│   │   ├── ai_ml_news.csv            # AI/ML news intelligence
│   │   ├── ai_ml_social.csv          # AI/ML social intelligence  
│   │   ├── cloud_news.csv            # Cloud computing news
│   │   ├── cloud_social.csv          # Cloud computing social
│   │   ├── [domain]_news.csv         # News data for each domain
│   │   └── [domain]_social.csv       # Social data for each domain
│   └── logos/                         # Company logo assets (50+ logos)
│       ├── ai_ml/                    # AI/ML company logos
│       ├── cloud/                    # Cloud company logos
│       ├── cybersecurity/            # Security company logos
│       └── [8 more domain folders]
│
├── 🚀 Deployment & Configuration
│   ├── package.json                   # Node.js dependencies and scripts
│   ├── requirements.txt               # Python dependencies
│   ├── vite.config.js                # Vite build configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── setup.bat                     # Windows setup script
│   ├── run.bat                       # Windows run script
│   └── setup_and_run.bat             # One-click setup and launch
│
├── 📋 Documentation & Specs
│   ├── .kiro/specs/                  # Development specifications
│   ├── project_structure.txt         # Detailed project structure
│   ├── Tharun Kumar - InsightIQ - Agile Document.pdf
│   └── README.md                     # This comprehensive guide
│
└── 🔨 Development Tools
    ├── .vscode/settings.json         # VS Code configuration
    ├── node_modules/                 # Node.js dependencies
    ├── venv/                         # Python virtual environment
    └── dist/                         # Production build output
```

## 🚀 Quick Start Guide

### 📋 Prerequisites
- **Python 3.8+** with pip package manager
- **Node.js 16+** with npm package manager  
- **Git** (optional, for cloning repository)
- **Windows/macOS/Linux** operating system
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### ⚡ Option 1: One-Click Setup (Recommended)
Perfect for quick demos and testing:

1. **Clone or Download** the repository
   ```bash
   git clone <repository-url>
   cd insightiq
   ```

2. **Run Automated Setup** (Windows)
   ```bash
   # Double-click or run in terminal
   setup_and_run.bat
   ```
   
3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### 🔧 Option 2: Manual Development Setup
For developers who want full control:

#### Backend Configuration
```bash
# 1. Create isolated Python environment
python -m venv venv

# 2. Activate virtual environment
# Windows Command Prompt:
venv\Scripts\activate
# Windows PowerShell:
venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# 3. Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 4. Start FastAPI backend server
cd backend
python main.py
# Server runs on http://localhost:8000
```

#### Frontend Configuration  
```bash
# 1. Install Node.js dependencies
npm install

# 2. Start Vite development server
npm run dev
# Development server runs on http://localhost:3000

# 3. Build for production (optional)
npm run build
npm run preview
```

#### Concurrent Development
```bash
# Run both frontend and backend simultaneously
npm run start
# This uses concurrently to run both servers
```

### 🌐 Application Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Main Application** | http://localhost:3000 | React frontend interface |
| **API Server** | http://localhost:8000 | FastAPI backend server |
| **API Documentation** | http://localhost:8000/docs | Interactive Swagger UI |
| **Alternative API Docs** | http://localhost:8000/redoc | ReDoc documentation |

### 🔍 First-Time Setup Verification

1. **Check Backend Health**
   ```bash
   curl http://localhost:8000/
   # Should return: {"message": "INSIGHTIQ API is running"}
   ```

2. **Verify Domain Data**
   ```bash
   curl http://localhost:8000/api/domains
   # Should return JSON with 10 technology domains
   ```

3. **Test Sample Data**
   ```bash
   curl http://localhost:8000/api/dashboard/ai_ml
   # Should return AI/ML dashboard metrics
   ```

## 📊 Data Architecture & Formats

### 📰 News Intelligence Data Schema
```csv
source,company,title,text,url,published_at,timestamp,mention_count,sentiment_score,sentiment_label,score,raw_json
news,OpenAI,OpenAI unveils GPT-5 with enhanced reasoning,"OpenAI has officially announced GPT-5...",https://example.com,2025-10-14T10:14:23Z,1729000463,102,0.68,positive,112,"{""engagement_metrics"":{""likes"":812}}"
```

**Key Fields:**
- `source`: News outlet or publication
- `company`: Competitor being mentioned  
- `title`: Article headline
- `text`: Article summary or content
- `sentiment_score`: Automated sentiment analysis (-1 to +1)
- `mention_count`: Number of competitor mentions
- `raw_json`: Additional metadata and engagement metrics

### 📱 Social Intelligence Data Schema  
```csv
platform,handle,text,likes,shares,comments,sentiment_score,company,published_at,engagement_rate,influence_score
Twitter,@techcrunch,Breaking: OpenAI releases GPT-5 with revolutionary reasoning capabilities,1247,523,189,0.72,OpenAI,2025-10-14T10:30:00Z,0.156,8.4
```

**Key Fields:**
- `platform`: Social media platform (Twitter, LinkedIn, Reddit, etc.)
- `handle`: User handle or account name
- `text`: Social media post content
- `likes/shares/comments`: Engagement metrics
- `sentiment_score`: Automated sentiment analysis
- `engagement_rate`: Calculated engagement percentage
- `influence_score`: User influence rating (1-10)

### 🤖 Automated Data Processing

**Sentiment Analysis Engine:**
- **TextBlob Integration**: Automatic sentiment computation for missing scores
- **Real-Time Processing**: On-the-fly sentiment analysis during data ingestion
- **Fallback Handling**: Graceful handling of missing or corrupted sentiment data
- **Multi-Language Support**: Sentiment analysis across multiple languages

**Data Validation Pipeline:**
- **Schema Validation**: Automatic validation of CSV structure and data types
- **Date Normalization**: Flexible date parsing across different formats
- **Missing Data Handling**: Intelligent fallbacks for missing fields
- **Duplicate Detection**: Automatic identification and handling of duplicate entries

**Competitor Intelligence:**
- **Mention Tracking**: Automatic competitor mention counting and tracking
- **Keyword Extraction**: AI-powered extraction of relevant keywords and topics
- **Trend Detection**: Statistical analysis for identifying emerging trends
- **Alert Generation**: Automated alert creation based on configurable thresholds

## 🔧 API Reference & Endpoints

### 🌐 Core API Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/` | Health check and API status | `{"message": "INSIGHTIQ API is running"}` |
| `GET` | `/api/domains` | Retrieve all technology domains | Domain configurations with competitors |
| `GET` | `/api/data/{domain_key}/{data_type}` | Get news or social data for domain | Processed CSV data with sentiment |
| `GET` | `/api/dashboard/{domain_key}` | Dashboard metrics and KPIs | Aggregated analytics and insights |
| `GET` | `/api/alerts/{domain_key}` | Intelligent alerts for domain | AI-generated alerts and notifications |

### 📊 Domain Keys Reference
```
ai_ml          - Artificial Intelligence & Machine Learning
cloud          - Cloud Computing & SaaS  
cybersecurity  - Cybersecurity & Data Privacy
web3           - Web3, Blockchain & Crypto
arvr           - Augmented & Virtual Reality
robotics       - Robotics & Automation
semiconductors - Semiconductors & Hardware
quantum        - Quantum Computing
consumer       - Consumer Electronics
greentech      - Green Tech & Energy Innovation
```

### 🔍 API Usage Examples

**Get All Domains:**
```bash
curl -X GET "http://localhost:8000/api/domains" \
  -H "accept: application/json"
```

**Fetch AI/ML News Data:**
```bash
curl -X GET "http://localhost:8000/api/data/ai_ml/news" \
  -H "accept: application/json"
```

**Get Dashboard Analytics:**
```bash
curl -X GET "http://localhost:8000/api/dashboard/cybersecurity" \
  -H "accept: application/json"
```

**Retrieve Intelligent Alerts:**
```bash
curl -X GET "http://localhost:8000/api/alerts/web3" \
  -H "accept: application/json"
```

### 📈 Response Data Structures

**Domain Configuration Response:**
```json
{
  "ai_ml": {
    "name": "Artificial Intelligence & Machine Learning",
    "emoji": "🧠",
    "competitors": ["OpenAI", "Anthropic", "DeepMind", "Hugging Face", "Stability AI"]
  }
}
```

**Dashboard Metrics Response:**
```json
{
  "total_mentions": 1247,
  "avg_sentiment": 0.68,
  "top_competitors": ["OpenAI", "Anthropic"],
  "trending_topics": ["GPT-5", "AI Safety", "Multimodal"],
  "sentiment_distribution": {"positive": 0.65, "neutral": 0.25, "negative": 0.10}
}
```

**Alert Response:**
```json
{
  "id": "product_launch_ai_ml_1",
  "type": "product_launch", 
  "title": "OpenAI launches GPT-5 with enhanced reasoning",
  "description": "Major breakthrough in AI reasoning capabilities...",
  "severity": "high",
  "timestamp": "2025-10-14T10:14:23Z",
  "source": "product_monitoring"
}
```

### 🔒 API Security & Configuration

**CORS Configuration:**
- **Origins**: Configured for cross-origin requests
- **Methods**: All HTTP methods supported
- **Headers**: Custom headers allowed for API integration

**Error Handling:**
- **404 Errors**: Graceful handling of missing domains or data
- **500 Errors**: Comprehensive error logging and user-friendly messages
- **Data Validation**: Input validation and sanitization

## 🎯 Advanced Features & Capabilities

### 🤖 AI-Powered Intelligence
- **Advanced Sentiment Analysis**: TextBlob-powered sentiment computation with -1 to +1 scoring
- **Trend Detection Engine**: Statistical analysis for identifying emerging market trends
- **Automated Alert Generation**: AI-driven notifications for mention spikes and sentiment shifts
- **Competitor Intelligence**: Real-time tracking of competitor mentions and market positioning
- **Topic Clustering**: Machine learning-based topic extraction and categorization
- **Predictive Analytics**: Trend forecasting based on historical data patterns

### 📊 Interactive Data Visualization
- **12+ Chart Types**: Line charts, bar charts, pie charts, treemaps, scatter plots, and more
- **Real-Time Updates**: Live data refreshing with intelligent caching mechanisms
- **Responsive Design**: Mobile-first design with adaptive layouts for all screen sizes
- **Export Capabilities**: PNG, SVG, and PDF export options for charts and reports
- **Interactive Filtering**: Dynamic filtering with real-time chart updates
- **Dark/Light Themes**: Seamless theme switching with persistent user preferences

### 🎨 Superior User Experience
- **Intuitive Domain Selection**: Modal-based domain switching with visual competitor cards
- **Advanced Search & Filtering**: Multi-dimensional filtering across date, sentiment, source, and keywords
- **Loading State Management**: Smooth loading indicators and skeleton screens
- **Error Boundary Handling**: Graceful error recovery with user-friendly messages
- **Keyboard Navigation**: Full keyboard accessibility support
- **Progressive Web App**: Offline capabilities and mobile app-like experience

### 🔄 Data Management & Processing
- **Intelligent Data Caching**: Context-based caching with automatic invalidation
- **CSV Auto-Discovery**: Dynamic file discovery and parsing across multiple naming conventions
- **Data Validation Pipeline**: Robust validation with automatic data cleaning and normalization
- **Real-Time Processing**: On-the-fly data processing and sentiment analysis
- **Backup & Recovery**: Automatic data backup and recovery mechanisms
- **Performance Optimization**: Lazy loading and virtualization for large datasets

## 🧪 Testing & Quality Assurance

### 🔍 Comprehensive Test Plan

#### 🌐 Domain & Navigation Testing
- **Domain Selection**: Verify all 10 technology domains load with correct competitor data
- **Navigation Flow**: Test seamless navigation between Dashboard, Market, News, Social, and Alerts
- **URL Routing**: Confirm proper React Router functionality and deep linking
- **Domain Switching**: Validate domain modal functionality and state persistence

#### 📊 Data Integration Testing  
- **CSV Data Loading**: Confirm all 20 CSV files (news + social for each domain) load correctly
- **Data Validation**: Test data parsing, cleaning, and normalization processes
- **Sentiment Analysis**: Verify TextBlob sentiment computation for missing scores
- **API Response Validation**: Ensure all API endpoints return properly formatted JSON

#### 📈 Visualization & UI Testing
- **Chart Rendering**: Verify all 12+ chart types render correctly with real data
- **Interactive Features**: Test chart interactions, tooltips, and zoom functionality
- **Responsive Design**: Validate mobile, tablet, and desktop layouts
- **Theme Switching**: Test dark/light mode toggle and persistence
- **Loading States**: Confirm smooth loading indicators and skeleton screens

#### 🔧 Functional Testing
- **Advanced Filtering**: Test multi-criteria filtering on News and Social pages
- **Search Functionality**: Validate keyword search across all data sources
- **Alert Generation**: Confirm automated alert creation and management
- **Data Export**: Test chart and data export functionality
- **Error Handling**: Verify graceful error recovery and user feedback

### 🚀 Automated Testing Commands

#### Backend API Testing
```bash
# Health check
curl http://localhost:8000/
# Expected: {"message": "INSIGHTIQ API is running"}

# Domain configuration test
curl http://localhost:8000/api/domains
# Expected: JSON object with 10 domain configurations

# Data endpoint testing
curl http://localhost:8000/api/data/ai_ml/news
curl http://localhost:8000/api/data/cybersecurity/social
# Expected: Processed CSV data with sentiment scores

# Dashboard analytics test
curl http://localhost:8000/api/dashboard/web3
# Expected: Aggregated metrics and insights

# Alert system test  
curl http://localhost:8000/api/alerts/quantum
# Expected: Array of AI-generated alerts
```

#### Frontend Integration Testing
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run component tests
npm test

# Build verification
npm run build
npm run preview
# Verify production build works correctly
```

### 📋 Manual Testing Checklist

#### ✅ Core Functionality
- [ ] All 10 domains load with correct competitor data
- [ ] Navigation between all 5 pages works smoothly  
- [ ] Charts render correctly with real data
- [ ] Filtering and search functionality works
- [ ] Theme toggle persists across sessions
- [ ] Mobile responsiveness on various screen sizes

#### ✅ Data Integrity
- [ ] CSV files load without errors
- [ ] Sentiment analysis computes correctly
- [ ] Missing data is handled gracefully
- [ ] Date parsing works across different formats
- [ ] Competitor mentions are tracked accurately

#### ✅ Performance & UX
- [ ] Page load times under 3 seconds
- [ ] Smooth animations and transitions
- [ ] No console errors or warnings
- [ ] Proper loading states during data fetching
- [ ] Error messages are user-friendly

### 🐛 Debugging & Troubleshooting

#### Common Issues & Solutions
```bash
# Port conflicts
netstat -ano | findstr :3000
netstat -ano | findstr :8000
# Kill conflicting processes if needed

# Python dependency issues
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall

# Node.js cache issues
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Data loading issues
# Check data/ directory for CSV files
# Verify file naming conventions match domain keys
```

## 🔄 Data Management & Updates

### 📊 Data Update Workflow

#### Real-Time Data Updates
1. **Replace CSV Files**: Update files in `/data/` directory with new intelligence data
2. **Automatic Detection**: Backend automatically detects file changes and updates
3. **Cache Invalidation**: Click **Refresh** button in navbar to invalidate data cache
4. **Live Reload**: New data appears immediately across all dashboards and charts

#### Data File Management
```bash
# Data directory structure
data/
├── ai_ml_news.csv          # AI/ML news intelligence
├── ai_ml_social.csv        # AI/ML social media data
├── cloud_news.csv          # Cloud computing news
├── cloud_social.csv        # Cloud social media data
├── [domain]_news.csv       # News data for each domain
└── [domain]_social.csv     # Social data for each domain
```

#### Supported Data Sources
- **News Sources**: TechCrunch, VentureBeat, Wired, Reuters, Bloomberg Technology
- **Social Platforms**: Twitter/X, LinkedIn, Reddit, Hacker News, GitHub
- **Industry Reports**: Gartner, Forrester, IDC, McKinsey Technology Reports
- **Company Blogs**: Official company announcements and blog posts
- **Patent Databases**: USPTO, WIPO patent filings and applications

### 🔧 Data Processing Pipeline

#### Automated Data Enrichment
- **Sentiment Analysis**: Automatic sentiment scoring using TextBlob NLP
- **Keyword Extraction**: AI-powered topic and trend identification
- **Competitor Tagging**: Automatic competitor mention detection and tagging
- **Engagement Metrics**: Social media engagement calculation and normalization
- **Duplicate Detection**: Intelligent deduplication across multiple sources

#### Data Quality Assurance
- **Schema Validation**: Automatic validation of CSV structure and data types
- **Missing Data Handling**: Intelligent fallbacks and data imputation
- **Date Normalization**: Flexible parsing of various date formats
- **Text Cleaning**: Automatic removal of HTML tags, special characters, and noise
- **Outlier Detection**: Statistical analysis to identify and flag data anomalies

## 🎨 Customization & Extension

### 🌐 Adding New Technology Domains

#### Backend Configuration
1. **Update Domain Registry** in `backend/main.py`:
```python
DOMAINS = {
    "new_domain": {
        "name": "New Technology Domain",
        "emoji": "🚀",
        "competitors": ["Company1", "Company2", "Company3", "Company4", "Company5"]
    }
}
```

2. **Add Data Files** in `/data/` directory:
```
data/
├── new_domain_news.csv     # News intelligence data
└── new_domain_social.csv   # Social media data
```

3. **Add Company Logos** in `/logos/new_domain/`:
```
logos/new_domain/
├── company1.png
├── company2.png
└── [competitor logos]
```

#### Frontend Integration
- Domain automatically appears in domain selection modal
- All existing charts and analytics work immediately
- No additional frontend code required

### 📊 Chart Customization & Extension

#### Adding New Chart Types
```jsx
// Create new chart component in /src/components/charts/
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';

export const CustomChart = ({ data, theme }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Line type="monotone" dataKey="value" stroke={theme === 'dark' ? '#60a5fa' : '#3b82f6'} />
    </LineChart>
  </ResponsiveContainer>
);
```

#### Chart Styling & Themes
- **Recharts Integration**: Full Recharts library support for advanced visualizations
- **Theme Support**: Automatic dark/light theme switching for all charts
- **Responsive Design**: Charts automatically adapt to screen size
- **Color Palettes**: Customizable color schemes for different data series

### 🔧 API Extension & Custom Endpoints

#### Adding Custom API Endpoints
```python
# Add to backend/main.py
@app.get("/api/custom/{domain_key}")
async def custom_endpoint(domain_key: str):
    # Custom logic here
    return {"custom_data": "your_data"}
```

#### Custom Data Processing
```python
def custom_data_processor(domain_key: str):
    """Add custom data processing logic"""
    # Load data
    df = load_and_process_csv(domain_key, 'news')
    
    # Custom processing
    processed_data = df.groupby('company').agg({
        'sentiment_score': 'mean',
        'mention_count': 'sum'
    })
    
    return processed_data.to_dict()
```

### 🎯 Alert System Customization

#### Custom Alert Rules
```python
def generate_custom_alerts(domain_key):
    """Create domain-specific alert rules"""
    alerts = []
    
    # Custom alert logic
    if domain_key == "ai_ml":
        # AI-specific alerts
        alerts.append({
            "type": "model_release",
            "title": "New AI Model Released",
            "severity": "high"
        })
    
    return alerts
```

#### Alert Notification Channels
- **Email Integration**: SMTP configuration for email alerts
- **Slack Integration**: Webhook support for Slack notifications  
- **Custom Webhooks**: Generic webhook support for any service
- **In-App Notifications**: Real-time browser notifications

### 🔌 Third-Party Integrations

#### Data Source Integration
```python
# Example: Twitter API integration
import tweepy

def fetch_twitter_data(domain_key):
    """Fetch real-time Twitter data"""
    api = tweepy.API(auth)
    tweets = api.search_tweets(q=f"{domain_key} competitors")
    return process_tweets(tweets)
```

#### Analytics Platform Integration
- **Google Analytics**: Track user engagement and usage patterns
- **Mixpanel**: Advanced event tracking and user behavior analysis
- **Segment**: Unified analytics and data pipeline
- **Custom Analytics**: Build custom tracking and reporting

## 🐛 Troubleshooting & Support

### 🔧 Common Issues & Solutions

#### Port Conflicts
```bash
# Check what's using ports 3000 and 8000
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill conflicting processes (Windows)
taskkill /PID [PID_NUMBER] /F

# Kill conflicting processes (macOS/Linux)
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:8000 | xargs kill -9
```

#### Python Environment Issues
```bash
# Upgrade pip and reinstall dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt --force-reinstall

# Create fresh virtual environment
deactivate  # if currently in venv
rm -rf venv
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

#### Node.js & npm Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Update Node.js and npm
npm install -g npm@latest

# Check Node.js version compatibility
node --version  # Should be 16+
npm --version   # Should be 8+
```

#### Data Loading Problems
```bash
# Verify data directory structure
ls -la data/
# Should show 20 CSV files (10 domains × 2 types)

# Check CSV file format
head -n 5 data/ai_ml_news.csv
# Verify headers and data structure

# Test backend data loading
curl http://localhost:8000/api/data/ai_ml/news
# Should return JSON data without errors
```

### 🚨 Error Diagnosis Guide

#### Frontend Errors
```bash
# Check browser console for JavaScript errors
# Open Developer Tools (F12) → Console tab

# Common React errors:
# - "Cannot read property of undefined" → Check data loading
# - "Module not found" → Run npm install
# - "Unexpected token" → Check for syntax errors
```

#### Backend Errors
```bash
# Check FastAPI server logs
python backend/main.py
# Look for error messages in terminal output

# Common Python errors:
# - "ModuleNotFoundError" → pip install missing package
# - "FileNotFoundError" → Check CSV file paths
# - "pandas.errors.EmptyDataError" → Verify CSV file content
```

#### Performance Issues
```bash
# Monitor system resources
# Task Manager (Windows) or Activity Monitor (macOS)

# Check for memory leaks
# Large CSV files may require more RAM
# Consider data pagination for production use

# Optimize chart rendering
# Reduce data points for better performance
# Use data sampling for large datasets
```

### 📞 Getting Help & Support

#### Self-Diagnosis Steps
1. **Check Prerequisites**: Verify Python 3.8+ and Node.js 16+ are installed
2. **Review Logs**: Check both frontend (browser console) and backend (terminal) logs
3. **Test API Endpoints**: Use curl or Postman to test backend functionality
4. **Verify Data Files**: Ensure all CSV files are present and properly formatted
5. **Clear Caches**: Clecache and npm/pip caches

#### Debug ModActivation
```bash
# Enverbose logging in bnd
export DEBUG=true
pytmain

# Eact development mode
npm run dev
# Provides ailed error messages and hot reloadi


#### Community Resourc## 📈 Performance
- **Best Pra**Gies**: Performance optHub Ispln and deployment guides

#### Proes**: Sam Support
For enterplese deploymen**: Architecture t implsuengtegrations
- **T guiing & Onboarding**: Team training danceractices
- /7 Support**: Producrt and monitoring
- **Custom Development**:tomature developmen integrations:tations and integReport bugs and feature 
- **Technical Con- **Documentation**: Comprehensi**Data Cachsetup documentation
- *ing**: Intelligent caching with invalidation
- **Lazy Loading**: Components load data only when needed
- **Optimized Charts**: Efficient rendering with Recharts
- **API Optimization**: FastAPI with async support

## 🔒 Security

- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Data sanitization and validation
- **Error Handling**: Secure error messages
- **No Sensitive Data**: All data is from CSV files

## 📝 License

This project is for demonstration purposes. Modify and use as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the test plan
3. Examine browser console for errors
4. Verify CSV data format

---

**INSIGHTIQ** - Transforming data into strategic intelligence 🚀