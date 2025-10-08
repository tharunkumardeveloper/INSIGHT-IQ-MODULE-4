# INSIGHTIQ - Strategic Intelligence Platform

A comprehensive web application for tracking and analyzing market intelligence across 10 technology domains using news and social media data.

## 🚀 Features

### Core Functionality
- **Domain Selection**: Choose from 10 technology domains with competitor tracking
- **5-Page Navigation**: Dashboard, Market, News, Social, Alerts
- **Real-time Data**: CSV-based data processing with automatic sentiment analysis
- **Automated Alerts**: Smart notifications for market changes and trends
- **Dark/Light Theme**: Toggle between themes for optimal viewing

### Technology Domains
1. 🧠 **Artificial Intelligence & Machine Learning** - OpenAI, Anthropic, DeepMind, Hugging Face, Stability AI
2. ☁️ **Cloud Computing & SaaS** - AWS, Microsoft Azure, Google Cloud, Salesforce, Oracle
3. 🔐 **Cybersecurity & Data Privacy** - Palo Alto Networks, CrowdStrike, Fortinet, Cloudflare, Check Point
4. 🌐 **Web3, Blockchain & Crypto** - Coinbase, Binance, ConsenSys, Chainalysis, Polygon Labs
5. 🕶️ **Augmented & Virtual Reality** - Meta, HTC Vive, Niantic, Magic Leap, Varjo
6. 🤖 **Robotics & Automation** - Boston Dynamics, ABB Robotics, iRobot, Fanuc, UiPath
7. ⚙️ **Semiconductors & Hardware** - Intel, AMD, NVIDIA, TSMC, Qualcomm
8. ⚛️ **Quantum Computing** - IBM Quantum, Rigetti, IonQ, D-Wave Systems, Xanadu
9. 📱 **Consumer Electronics** - Apple, Samsung, Sony, LG, Xiaomi
10. 🌱 **Green Tech & Energy Innovation** - Tesla Energy, Enphase, Siemens Energy, Ørsted, First Solar

### Page Features

#### Dashboard
- Domain overview with key metrics
- Competitor cards with sentiment and mention counts
- 4 interactive charts: Sentiment trends, Mentions by competitor, Source distribution, Topic trends
- CSV data preview for news and social posts

#### Market
- Detailed competitor analysis
- Market insights panel with top 5 trends
- 4 advanced charts: Multi-series trends, Market share, Topic treemap, Sentiment vs Engagement scatter

#### News
- News article feed with filtering
- Source analysis and timeline view
- 3 charts: News volume, Sentiment distribution, Top sources
- Advanced filters: date range, sentiment, source, keywords

#### Social
- Social media post analysis
- Influencer leaderboard and engagement metrics
- 3 charts: Engagement trends, Platform distribution, Top influencers
- Filters: platform, sentiment, date, competitor

#### Alerts
- **Fully Automated Alert Generation**:
  - Mention spikes (>2x weekly average)
  - Sentiment drops (below -0.4)
  - Trending topic detection
- Alert management: mark read, snooze, search, filter
- Real-time notifications with severity levels

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for responsive styling
- **Recharts** for interactive data visualization
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **FastAPI** for high-performance API
- **Pandas** for data processing
- **TextBlob** for sentiment analysis
- **Uvicorn** ASGI server

### Data Processing
- Automatic CSV parsing and validation
- Real-time sentiment computation for missing scores
- Keyword extraction and trend analysis
- Competitor mention tracking

## 📁 Project Structure

```
insightiq/
├── backend/
│   └── main.py                 # FastAPI server with all endpoints
├── src/
│   ├── components/
│   │   ├── charts/            # All chart components
│   │   ├── CompetitorCard.jsx
│   │   ├── CSVViewer.jsx
│   │   ├── DomainModal.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── NewsCard.jsx
│   │   ├── NewsFilters.jsx
│   │   ├── SocialCard.jsx
│   │   ├── SocialFilters.jsx
│   │   └── InsightsPanel.jsx
│   ├── context/
│   │   ├── DataContext.jsx    # Data caching and API calls
│   │   └── ThemeContext.jsx   # Theme management
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Market.jsx
│   │   ├── News.jsx
│   │   ├── Social.jsx
│   │   └── Alerts.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── data/
│   ├── ai_ml_news.csv
│   ├── ai_ml_social.csv
│   ├── [domain]_news.csv      # News data for each domain
│   └── [domain]_social.csv    # Social data for each domain
├── logos/
│   └── [domain]/
│       └── [company].png      # Company logos
├── public/
├── package.json
├── requirements.txt
├── setup_and_run.bat          # Automated setup script
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** (optional)

### Option 1: Automated Setup (Recommended)
1. **Download/Clone** the project
2. **Double-click** `setup_and_run.bat`
3. **Wait** for automatic installation and startup
4. **Open** http://localhost:3000 in your browser

### Option 2: Manual Setup

#### Backend Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start backend server
python backend/main.py
```

#### Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

## 📊 Data Format

### News CSV Format
```csv
date,source,title,summary,url,sentiment_score,category
2024-01-15,TechCrunch,AI Breakthrough,Summary text,https://...,0.75,Technology
```

### Social CSV Format
```csv
date,platform,handle,text,likes,shares,comments,sentiment_score
2024-01-15,Twitter,@user,Post content,100,50,25,0.5
```

**Note**: Sentiment scores are automatically computed if missing using TextBlob.

## 🔧 API Endpoints

- `GET /api/domains` - Get all available domains
- `GET /api/data/{domain_key}/{data_type}` - Get news or social data
- `GET /api/dashboard/{domain_key}` - Get dashboard metrics
- `GET /api/alerts/{domain_key}` - Get automated alerts

## 🎯 Key Features

### Automated Intelligence
- **Smart Sentiment Analysis**: Automatic computation for missing sentiment scores
- **Trend Detection**: Keyword extraction and topic analysis
- **Alert Generation**: Automated notifications for market changes
- **Competitor Tracking**: Mention counting and sentiment analysis per competitor

### Interactive Visualizations
- **12+ Chart Types**: Line, bar, pie, treemap, scatter, and more
- **Responsive Design**: Mobile-friendly layouts
- **Real-time Updates**: Data refreshing and caching
- **Export Capabilities**: Chart and data export options

### User Experience
- **Domain Modal**: Intuitive domain selection on startup
- **Theme Toggle**: Dark/light mode support
- **Advanced Filtering**: Multi-criteria filtering across all pages
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error management

## 🧪 Testing

### Test Plan
1. **Domain Selection**: Verify all 10 domains load correctly
2. **Navigation**: Test all 5 menu items work properly
3. **Data Loading**: Confirm CSV data loads and displays
4. **Charts**: Verify all charts render with data
5. **Filters**: Test filtering functionality on News/Social pages
6. **Alerts**: Confirm automated alert generation works
7. **Theme Toggle**: Test dark/light mode switching
8. **Responsive**: Verify mobile compatibility

### Sample Test Commands
```bash
# Test backend API
curl http://localhost:8000/api/domains

# Test specific domain data
curl http://localhost:8000/api/dashboard/ai_ml

# Test alerts
curl http://localhost:8000/api/alerts/ai_ml
```

## 🔄 Data Updates

To update data:
1. Replace CSV files in `/data/` directory
2. Click **Refresh** button in the navbar
3. Data cache will be invalidated and reloaded

## 🎨 Customization

### Adding New Domains
1. Update `DOMAINS` object in `backend/main.py`
2. Add corresponding CSV files in `/data/`
3. Add company logos in `/logos/[domain]/`

### Modifying Charts
- Chart components are in `/src/components/charts/`
- Uses Recharts library for easy customization
- Responsive design with dark theme support

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes on ports 3000 and 8000
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

**Python Dependencies**
```bash
# Upgrade pip and reinstall
python -m pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**Node.js Issues**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📈 Performance

- **Data Caching**: Intelligent caching with invalidation
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