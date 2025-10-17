#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
InSightIQ - AI-Powered Strategic Intelligence Platform
Optimized version with .env integration and modular architecture
"""

import os
import sys
import json
import time
import re
import math
import warnings
from pathlib import Path
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional

import pandas as pd
import numpy as np
import requests
import feedparser
from dotenv import load_dotenv

warnings.filterwarnings('ignore')

# =============================================================================
# CONFIGURATION LOADER
# =============================================================================

class Config:
    """Centralized configuration management using .env file"""
    
    def __init__(self, env_file: str = "insights.env"):
        # Load environment variables
        env_path = Path(env_file)
        
        if env_path.exists():
            load_dotenv(env_path)
            print(f"✅ Found {env_file} at: {env_path.absolute()}")
        else:
            # Try alternate locations
            alternate_paths = [
                Path.cwd() / env_file,
                Path(__file__).parent / env_file,
                Path.home() / env_file
            ]
            
            found = False
            for alt_path in alternate_paths:
                if alt_path.exists():
                    load_dotenv(alt_path)
                    print(f"✅ Loaded configuration from {alt_path}")
                    found = True
                    break
            
            if not found:
                print(f"⚠️  Warning: {env_file} not found in:")
                print(f"   - {env_path.absolute()}")
                for alt in alternate_paths:
                    print(f"   - {alt}")
                print("   Using environment variables only")
        
        # API Keys - with debug info
        self.GNEWS_API_KEY = os.getenv("GNEWS_API_KEY", "")
        self.REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID", "")
        self.REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET", "")
        self.REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT", "")
        self.TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN", "")
        self.SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL", "")
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
        self.SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")
        self.FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "")
        self.ALPHAVANTAGE_API_KEY = os.getenv("ALPHAVANTAGE_API_KEY", "")
        
        # Directories
        self.DATA_DIR = Path(os.getenv("DATA_DIRECTORY", "data"))
        self.CACHE_DIR = Path(os.getenv("CACHE_DIRECTORY", "cache"))
        self.MODELS_DIR = Path(os.getenv("MODELS_DIRECTORY", "models"))
        self.LOG_DIR = Path("logs")
        
        # Create directories if they don't exist
        for dir_path in [self.DATA_DIR, self.CACHE_DIR, self.MODELS_DIR, self.LOG_DIR]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Feature Flags
        self.ENABLE_LIVE_DATA = os.getenv("ENABLE_LIVE_DATA_COLLECTION", "false").lower() == "true"
        self.ENABLE_AI_INSIGHTS = os.getenv("ENABLE_AI_INSIGHTS", "true").lower() == "true"
        self.ENABLE_FORECASTING = os.getenv("ENABLE_FORECASTING", "true").lower() == "true"
        self.ENABLE_ALERTS = os.getenv("ENABLE_ALERTS", "true").lower() == "true"
        
        # Performance Settings
        self.TIMEOUT = int(os.getenv("TIMEOUT", "30"))
        self.MAX_ROWS = int(os.getenv("MAX_ROWS_PER_REQUEST", "1000"))
        self.CACHE_TTL = int(os.getenv("CACHE_TTL", "3600"))
        
        # Debug Mode
        self.DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    
    def validate(self) -> List[str]:
        """Validate required API keys and return missing ones"""
        missing = []
        required = {
            "GNEWS_API_KEY": self.GNEWS_API_KEY,
            "REDDIT_CLIENT_ID": self.REDDIT_CLIENT_ID,
            "REDDIT_CLIENT_SECRET": self.REDDIT_CLIENT_SECRET,
            "SLACK_WEBHOOK_URL": self.SLACK_WEBHOOK_URL,
        }
        for key, value in required.items():
            if not value:
                missing.append(key)
        return missing

# Initialize config
config = Config()

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def log(msg: str, level: str = "INFO"):
    """Simple logging function with safe encoding"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Print to console
    try:
        print(f"[{timestamp}] {level}: {msg}")
    except UnicodeEncodeError:
        # Fallback: remove problematic characters
        clean_msg = msg.encode('ascii', 'replace').decode('ascii')
        print(f"[{timestamp}] {level}: {clean_msg}")
    
    # Write to log file with UTF-8 encoding
    try:
        log_file = config.LOG_DIR / "insightiq.log"
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(f"[{timestamp}] {level}: {msg}\n")
    except Exception as e:
        # If logging fails, just continue
        pass

def norm(s: Any) -> Optional[str]:
    """Normalize string values"""
    return None if s is None else str(s).strip()

def base_row() -> Dict[str, Any]:
    """Standard schema for all data sources"""
    return {
        "source": "",
        "title": "",
        "text": "",
        "url": "",
        "author": "",
        "published_at": "",
        "score": None,
        "timestamp": None,
        "sentiment": None,
        "raw": {}
    }

def safe_request(url: str, params: Dict = None, headers: Dict = None, 
                 timeout: int = None) -> Optional[requests.Response]:
    """Safe HTTP request wrapper with error handling"""
    timeout = timeout or config.TIMEOUT
    try:
        response = requests.get(url, params=params, headers=headers, timeout=timeout)
        response.raise_for_status()
        return response
    except requests.exceptions.RequestException as e:
        log(f"Request failed for {url}: {e}", "ERROR")
        return None

# =============================================================================
# DATA COLLECTORS
# =============================================================================

class DataCollector:
    """Base class for all data collectors"""
    
    def __init__(self, query: str = None):
        self.query = query or self._default_query()
        self.today = datetime.now(timezone.utc)
        self.from_date = (self.today - timedelta(days=3)).strftime("%Y-%m-%d")
    
    @staticmethod
    def _default_query() -> str:
        """Default AI-focused search query"""
        return '("artificial intelligence" OR "machine learning" OR "deep learning" OR "AI" OR "LLM")'
    
    def collect(self) -> List[Dict[str, Any]]:
        """Override this method in subclasses"""
        raise NotImplementedError


class GNewsCollector(DataCollector):
    """GNews API collector (replacement for NewsAPI)"""
    
    def collect(self, max_results: int = 100) -> List[Dict[str, Any]]:
        if not config.GNEWS_API_KEY:
            log("GNews API key not set - skipping", "WARNING")
            return []
        
        log("Collecting from GNews...")
        rows = []
        url = "https://gnews.io/api/v4/search"
        
        params = {
            "q": self.query,
            "lang": "en",
            "max": min(max_results, 100),
            "apikey": config.GNEWS_API_KEY,
            "from": self.from_date
        }
        
        response = safe_request(url, params=params)
        if not response:
            return rows
        
        data = response.json()
        for article in data.get("articles", []):
            row = base_row()
            row.update({
                "source": "GNews",
                "title": norm(article.get("title")),
                "text": norm(article.get("description")),
                "url": norm(article.get("url")),
                "author": norm(article.get("source", {}).get("name")),
                "published_at": norm(article.get("publishedAt")),
                "raw": article
            })
            rows.append(row)
        
        log(f"Collected {len(rows)} articles from GNews")
        return rows


class RedditCollector(DataCollector):
    """Reddit data collector using PRAW"""
    
    def collect(self, limit: int = 200) -> List[Dict[str, Any]]:
        if not all([config.REDDIT_CLIENT_ID, config.REDDIT_CLIENT_SECRET, config.REDDIT_USER_AGENT]):
            log("Reddit credentials not set - skipping", "WARNING")
            return []
        
        try:
            import praw
        except ImportError:
            log("PRAW not installed. Run: pip install praw", "ERROR")
            return []
        
        log("Collecting from Reddit...")
        rows = []
        
        reddit = praw.Reddit(
            client_id=config.REDDIT_CLIENT_ID,
            client_secret=config.REDDIT_CLIENT_SECRET,
            user_agent=config.REDDIT_USER_AGENT
        )
        
        subreddits = [
            "MachineLearning", "artificial", "DeepLearning", 
            "OpenAI", "LocalLLaMA", "ChatGPT", "datascience"
        ]
        
        posts_per_sub = math.ceil(limit / len(subreddits))
        
        for sub in subreddits:
            try:
                for post in reddit.subreddit(sub).search(
                    self.query, sort="new", time_filter="week", limit=posts_per_sub
                ):
                    row = base_row()
                    row.update({
                        "source": "Reddit",
                        "title": norm(post.title),
                        "text": norm(post.selftext),
                        "url": f"https://www.reddit.com{post.permalink}",
                        "author": norm(str(post.author)),
                        "published_at": datetime.fromtimestamp(post.created_utc, tz=timezone.utc).isoformat(),
                        "score": int(post.score),
                        "raw": {"subreddit": sub, "id": post.id}
                    })
                    rows.append(row)
            except Exception as e:
                log(f"Error collecting from r/{sub}: {e}", "ERROR")
                continue
        
        log(f"Collected {len(rows)} posts from Reddit")
        return rows


class HackerNewsCollector(DataCollector):
    """Hacker News collector via Algolia API"""
    
    def collect(self, hits_per_page: int = 100, pages: int = 2) -> List[Dict[str, Any]]:
        log("Collecting from Hacker News...")
        rows = []
        
        for page in range(pages):
            url = "https://hn.algolia.com/api/v1/search_by_date"
            params = {
                "query": self.query,
                "tags": "story",
                "hitsPerPage": hits_per_page,
                "page": page
            }
            
            response = safe_request(url, params=params)
            if not response:
                break
            
            for hit in response.json().get("hits", []):
                row = base_row()
                row.update({
                    "source": "HackerNews",
                    "title": norm(hit.get("title")),
                    "text": norm(hit.get("story_text")),
                    "url": norm(hit.get("url") or f"https://news.ycombinator.com/item?id={hit.get('objectID')}"),
                    "author": norm(hit.get("author")),
                    "published_at": datetime.fromtimestamp(hit.get("created_at_i", 0), tz=timezone.utc).isoformat(),
                    "score": hit.get("points"),
                    "raw": hit
                })
                rows.append(row)
            
            time.sleep(0.3)
        
        log(f"Collected {len(rows)} stories from Hacker News")
        return rows


class ArxivCollector(DataCollector):
    """arXiv research papers collector"""
    
    def collect(self, max_results: int = 200) -> List[Dict[str, Any]]:
        log("Collecting from arXiv...")
        rows = []
        
        search_query = 'cat:cs.AI+OR+cat:cs.CL+OR+cat:cs.LG+OR+cat:stat.ML'
        url = f"http://export.arxiv.org/api/query?search_query={search_query}&sortBy=submittedDate&sortOrder=descending&start=0&max_results={max_results}"
        
        feed = feedparser.parse(url)
        
        for entry in feed.entries:
            row = base_row()
            row.update({
                "source": "arXiv",
                "title": norm(entry.get("title")),
                "text": norm(entry.get("summary")),
                "url": norm(entry.get("link")),
                "author": norm(", ".join([a.get("name", "") for a in entry.get("authors", [])])),
                "published_at": norm(entry.get("published")),
                "raw": {"id": entry.get("id")}
            })
            rows.append(row)
        
        log(f"Collected {len(rows)} papers from arXiv")
        return rows


class TwitterCollector(DataCollector):
    """Twitter/X collector using v2 API"""
    
    def collect(self, max_results: int = 50) -> List[Dict[str, Any]]:
        if not config.TWITTER_BEARER_TOKEN:
            log("Twitter bearer token not set - skipping", "WARNING")
            return []
        
        log("Collecting from Twitter...")
        rows = []
        
        url = "https://api.twitter.com/2/tweets/search/recent"
        headers = {"Authorization": f"Bearer {config.TWITTER_BEARER_TOKEN}"}
        params = {
            "query": '("AI" OR "machine learning" OR "deep learning") lang:en -is:retweet -is:reply',
            "tweet.fields": "created_at,author_id,text,public_metrics",
            "max_results": max_results
        }
        
        response = safe_request(url, params=params, headers=headers)
        if not response:
            return rows
        
        data = response.json()
        for tweet in data.get("data", []):
            row = base_row()
            row.update({
                "source": "Twitter",
                "title": norm(tweet.get("text")[:80] + "..."),
                "text": norm(tweet.get("text")),
                "url": f"https://twitter.com/i/web/status/{tweet.get('id')}",
                "author": norm(tweet.get("author_id")),
                "published_at": norm(tweet.get("created_at")),
                "score": tweet.get("public_metrics", {}).get("like_count", 0),
                "raw": tweet
            })
            rows.append(row)
        
        log(f"Collected {len(rows)} tweets from Twitter")
        return rows


class FinnhubCollector(DataCollector):
    """Finnhub market news and company sentiment collector"""
    
    def collect(self, category: str = "technology") -> List[Dict[str, Any]]:
        if not config.FINNHUB_API_KEY:
            log("Finnhub API key not set - skipping", "WARNING")
            return []
        
        log("Collecting from Finnhub...")
        rows = []
        
        # Get general market news
        url = "https://finnhub.io/api/v1/news"
        params = {
            "category": category,
            "token": config.FINNHUB_API_KEY
        }
        
        response = safe_request(url, params=params)
        if not response:
            return rows
        
        articles = response.json()
        for article in articles[:50]:  # Limit to 50 articles
            row = base_row()
            row.update({
                "source": "Finnhub",
                "title": norm(article.get("headline")),
                "text": norm(article.get("summary")),
                "url": norm(article.get("url")),
                "author": norm(article.get("source")),
                "published_at": datetime.fromtimestamp(article.get("datetime", 0), tz=timezone.utc).isoformat(),
                "raw": article
            })
            rows.append(row)
        
        # Get company-specific news for major AI companies
        ai_companies = ["NVDA", "MSFT", "GOOGL", "META", "AMZN"]
        for symbol in ai_companies:
            company_url = "https://finnhub.io/api/v1/company-news"
            from_date = (self.today - timedelta(days=7)).strftime("%Y-%m-%d")
            to_date = self.today.strftime("%Y-%m-%d")
            
            params = {
                "symbol": symbol,
                "from": from_date,
                "to": to_date,
                "token": config.FINNHUB_API_KEY
            }
            
            response = safe_request(company_url, params=params)
            if response:
                company_articles = response.json()
                for article in company_articles[:10]:  # Top 10 per company
                    row = base_row()
                    row.update({
                        "source": f"Finnhub-{symbol}",
                        "title": norm(article.get("headline")),
                        "text": norm(article.get("summary")),
                        "url": norm(article.get("url")),
                        "author": norm(article.get("source")),
                        "published_at": datetime.fromtimestamp(article.get("datetime", 0), tz=timezone.utc).isoformat(),
                        "raw": {"company": symbol, **article}
                    })
                    rows.append(row)
            
            time.sleep(0.5)  # Rate limiting
        
        log(f"Collected {len(rows)} articles from Finnhub")
        return rows


class AlphaVantageCollector(DataCollector):
    """Alpha Vantage news and sentiment collector"""
    
    def collect(self, topics: str = "technology,artificial_intelligence") -> List[Dict[str, Any]]:
        if not config.ALPHAVANTAGE_API_KEY:
            log("Alpha Vantage API key not set - skipping", "WARNING")
            return []
        
        log("Collecting from Alpha Vantage...")
        rows = []
        
        # News & Sentiment endpoint
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "NEWS_SENTIMENT",
            "topics": topics,
            "apikey": config.ALPHAVANTAGE_API_KEY,
            "limit": 200,
            "sort": "LATEST"
        }
        
        response = safe_request(url, params=params)
        if not response:
            return rows
        
        try:
            data = response.json()
            
            if "feed" not in data:
                log(f"Alpha Vantage returned no feed: {data.get('Note', 'Unknown error')}", "WARNING")
                return rows
            
            for article in data.get("feed", []):
                # Extract sentiment scores
                sentiment_score = 0.0
                if "overall_sentiment_score" in article:
                    sentiment_score = float(article["overall_sentiment_score"])
                
                row = base_row()
                row.update({
                    "source": "AlphaVantage",
                    "title": norm(article.get("title")),
                    "text": norm(article.get("summary")),
                    "url": norm(article.get("url")),
                    "author": norm(article.get("source")),
                    "published_at": norm(article.get("time_published")),
                    "sentiment": sentiment_score,  # Pre-computed sentiment
                    "score": sentiment_score,
                    "raw": {
                        "topics": article.get("topics", []),
                        "ticker_sentiment": article.get("ticker_sentiment", []),
                        "overall_sentiment_label": article.get("overall_sentiment_label")
                    }
                })
                rows.append(row)
            
            log(f"Collected {len(rows)} articles from Alpha Vantage")
            
        except Exception as e:
            log(f"Error parsing Alpha Vantage response: {e}", "ERROR")
        
        return rows


# =============================================================================
# DATA PROCESSING PIPELINE
# =============================================================================

class DataProcessor:
    """Handles data enrichment, cleaning, and filtering"""
    
    @staticmethod
    def enrich_sentiment(df: pd.DataFrame) -> pd.DataFrame:
        """Add sentiment analysis using VADER (skip if already present from Alpha Vantage)"""
        try:
            import nltk
            from nltk.sentiment.vader import SentimentIntensityAnalyzer
            
            try:
                nltk.data.find('sentiment/vader_lexicon.zip')
            except LookupError:
                nltk.download('vader_lexicon', quiet=True)
            
            sia = SentimentIntensityAnalyzer()
            
            def get_sentiment(row):
                # If Alpha Vantage already provided sentiment, use it
                if row.get("source") == "AlphaVantage" and isinstance(row.get("sentiment"), float):
                    return row["sentiment"]
                
                # Otherwise calculate with VADER
                text = row.get("text", "")
                if not text or not str(text).strip():
                    return 0.0
                try:
                    return sia.polarity_scores(str(text))["compound"]
                except:
                    return 0.0
            
            df["sentiment_score"] = df.apply(get_sentiment, axis=1)
            df["sentiment"] = df["sentiment_score"].apply(
                lambda s: "positive" if s > 0.2 else ("negative" if s < -0.2 else "neutral")
            )
            
            log("✅ Sentiment analysis completed")
            
        except Exception as e:
            log(f"Sentiment analysis failed: {e}", "WARNING")
            df["sentiment_score"] = 0.0
            df["sentiment"] = "neutral"
        
        return df
    
    @staticmethod
    def clean_text(df: pd.DataFrame) -> pd.DataFrame:
        """Clean and normalize text content"""
        def clean(text):
            if not isinstance(text, str):
                return ""
            text = re.sub(r"http\S+", "", text)  # Remove URLs
            text = re.sub(r"\s+", " ", text).strip()  # Normalize whitespace
            return text
        
        df["text"] = df["text"].fillna("").apply(clean)
        df["title"] = df["title"].fillna("").apply(clean)
        df["clean"] = df["title"] + ". " + df["text"]
        
        log("✅ Text cleaning completed")
        return df
    
    @staticmethod
    def filter_ai_content(df: pd.DataFrame) -> pd.DataFrame:
        """Filter for AI-relevant content"""
        ai_keywords = {
            "ai", "artificial intelligence", "machine learning", "deep learning",
            "neural network", "llm", "large language model", "chatgpt", "gpt",
            "transformer", "diffusion", "openai", "anthropic", "deepmind",
            "computer vision", "nlp", "natural language processing"
        }
        
        def is_ai_related(row):
            text = (str(row.get("title", "")) + " " + str(row.get("text", ""))).lower()
            return any(keyword in text for keyword in ai_keywords)
        
        initial_count = len(df)
        df = df[df.apply(is_ai_related, axis=1)].reset_index(drop=True)
        filtered_count = initial_count - len(df)
        
        log(f"✅ Filtered {filtered_count} non-AI items, kept {len(df)} relevant items")
        return df
    
    @staticmethod
    def normalize_timestamps(df: pd.DataFrame) -> pd.DataFrame:
        """Normalize and parse timestamps"""
        df["published_at"] = pd.to_datetime(df["published_at"], errors="coerce", utc=True)
        df["published_at"] = df["published_at"].fillna(pd.Timestamp.utcnow())
        df["date"] = df["published_at"].dt.date
        
        log("✅ Timestamps normalized")
        return df


# =============================================================================
# ALERT SYSTEM
# =============================================================================

class AlertSystem:
    """Manages alert detection and Slack notifications"""
    
    def __init__(self):
        self.webhook_url = config.SLACK_WEBHOOK_URL
        self.alert_log_path = config.DATA_DIR / "sent_alerts.json"
        self.sent_alerts = self._load_sent_alerts()
    
    def _load_sent_alerts(self) -> set:
        """Load previously sent alerts to avoid duplicates"""
        if self.alert_log_path.exists():
            with open(self.alert_log_path, 'r') as f:
                return set(json.load(f))
        return set()
    
    def _save_sent_alerts(self):
        """Persist sent alerts"""
        with open(self.alert_log_path, 'w') as f:
            json.dump(list(self.sent_alerts), f)
    
    def detect_anomalies(self, df: pd.DataFrame) -> List[str]:
        """Detect market shifts and anomalies"""
        if len(df) < 7:
            log("Not enough data for anomaly detection", "WARNING")
            return []
        
        daily_trends = df.groupby('date').agg({
            'text': 'count',
            'sentiment_score': 'mean'
        }).reset_index()
        daily_trends.rename(columns={'text': 'keyword_count'}, inplace=True)
        
        # Calculate moving averages
        daily_trends['keyword_ma'] = daily_trends['keyword_count'].rolling(window=7, min_periods=1).mean()
        daily_trends['sentiment_ma'] = daily_trends['sentiment_score'].rolling(window=7, min_periods=1).mean()
        
        # Detect anomalies
        alerts = []
        for _, row in daily_trends.iterrows():
            # Keyword surge
            if row['keyword_count'] > 1.5 * row['keyword_ma']:
                alert = f"🚨 Keyword Surge Detected on {row['date']} | Count: {int(row['keyword_count'])} (MA: {row['keyword_ma']:.1f})"
                alerts.append(alert)
            
            # Sentiment drop
            if row['sentiment_score'] < row['sentiment_ma'] - 0.2:
                alert = f"⚠️ Sentiment Drop on {row['date']} | Score: {row['sentiment_score']:.2f} (MA: {row['sentiment_ma']:.2f})"
                alerts.append(alert)
        
        log(f"Detected {len(alerts)} anomalies")
        return alerts
    
    def send_to_slack(self, alerts: List[str]):
        """Send alerts to Slack webhook"""
        if not self.webhook_url or not config.ENABLE_ALERTS:
            log("Slack alerts disabled", "INFO")
            return
        
        new_alerts = [a for a in alerts if a not in self.sent_alerts]
        
        if not new_alerts:
            log("No new alerts to send")
            return
        
        for alert in new_alerts:
            payload = {"text": alert}
            try:
                response = requests.post(
                    self.webhook_url,
                    data=json.dumps(payload),
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                if response.status_code == 200:
                    log(f"✅ Alert sent: {alert[:50]}...")
                    self.sent_alerts.add(alert)
                else:
                    log(f"Failed to send alert: {response.status_code}", "ERROR")
            except Exception as e:
                log(f"Error sending alert: {e}", "ERROR")
        
        self._save_sent_alerts()


# =============================================================================
# MAIN ORCHESTRATOR
# =============================================================================

class InSightIQ:
    """Main orchestrator for the intelligence platform"""
    
    def __init__(self):
        self.config = config
        self.processor = DataProcessor()
        self.alert_system = AlertSystem()
        self.output_file = config.DATA_DIR / "ai_intel_clean.csv"
    
    def collect_all_data(self) -> List[Dict[str, Any]]:
        """Run all data collectors"""
        log("=" * 60)
        log("Starting data collection...")
        log("=" * 60)
        
        all_rows = []
        
        collectors = [
            GNewsCollector(),
            RedditCollector(),
            HackerNewsCollector(),
            ArxivCollector(),
            TwitterCollector(),
            FinnhubCollector(),
            AlphaVantageCollector()
        ]
        
        for collector in collectors:
            try:
                rows = collector.collect()
                all_rows.extend(rows)
            except Exception as e:
                log(f"Error in {collector.__class__.__name__}: {e}", "ERROR")
        
        log(f"✅ Total items collected: {len(all_rows)}")
        return all_rows
    
    def process_data(self, rows: List[Dict[str, Any]]) -> pd.DataFrame:
        """Process and clean collected data"""
        log("=" * 60)
        log("Processing data...")
        log("=" * 60)
        
        df = pd.DataFrame(rows)
        
        if df.empty:
            log("No data to process", "WARNING")
            return df
        
        # Apply processing pipeline
        df = self.processor.normalize_timestamps(df)
        df = self.processor.clean_text(df)
        df = self.processor.filter_ai_content(df)
        df = self.processor.enrich_sentiment(df)
        
        # Remove duplicates
        df = df.drop_duplicates(subset=["title", "url"]).reset_index(drop=True)
        
        log(f"✅ Processing complete: {len(df)} items ready")
        return df
    
    def save_data(self, df: pd.DataFrame):
        """Save processed data to CSV"""
        if df.empty:
            log("No data to save", "WARNING")
            return
        
        # Select columns to save
        cols = ["source", "published_at", "date", "title", "text", "clean", 
                "url", "author", "sentiment", "sentiment_score", "score"]
        df_to_save = df[[c for c in cols if c in df.columns]].copy()
        
        df_to_save.to_csv(self.output_file, index=False)
        log(f"✅ Saved {len(df_to_save)} rows to {self.output_file}")
    
    def run_alerts(self, df: pd.DataFrame):
        """Detect and send alerts"""
        if not config.ENABLE_ALERTS or df.empty:
            return
        
        log("=" * 60)
        log("Running alert detection...")
        log("=" * 60)
        
        alerts = self.alert_system.detect_anomalies(df)
        self.alert_system.send_to_slack(alerts)
    
    def run(self):
        """Main execution pipeline"""
        start_time = time.time()
        
        # Validate configuration
        missing_keys = self.config.validate()
        if missing_keys:
            log(f"⚠️  Missing API keys: {', '.join(missing_keys)}", "WARNING")
        
        # Collect data
        rows = self.collect_all_data()
        
        # Process data
        df = self.process_data(rows)
        
        # Save results
        self.save_data(df)
        
        # Run alerts
        self.run_alerts(df)
        
        elapsed = time.time() - start_time
        log("=" * 60)
        log(f"✅ Pipeline completed in {elapsed:.2f} seconds")
        log("=" * 60)
        
        return df


# =============================================================================
# ENTRY POINT
# =============================================================================

if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║                      InSightIQ                               ║
    ║         AI-Powered Strategic Intelligence Platform           ║
    ╚══════════════════════════════════════════════════════════════╝
    """)

    # DEBUG: Show environment before running
    print("\n🔍 Environment Check:")
    print(f"   Working Directory: {Path.cwd()}")
    print(f"   Script Location: {Path(__file__).parent}")

    env_file = Path("insights.env")
    if env_file.exists():
        print(f"   ✅ insights.env found")
        # Read first few non-comment lines to check format
        with open(env_file, 'r', encoding='utf-8') as f:
            lines = [l.strip() for l in f.readlines()[:8] if l.strip() and not l.lstrip().startswith('#')]
            if lines:
                sample = lines[0]
                if ' = ' in sample:
                    print(f"   ⚠️  WARNING: .env has spaces around '=' (remove them!)")
                    print(f"      Example: '{sample}'")
                elif '=' in sample:
                    print(f"   ✅ .env format looks correct")
    else:
        print(f"   ❌ insights.env NOT FOUND in {env_file.absolute()}")

    # Initialize and run
    app = InSightIQ()

    # Show presence of loaded keys (do NOT print full keys)
    print(f"\n🔑 Loaded API Keys (presence only):")
    def present(key_val):
        return "✅ Present" if key_val else "❌ MISSING"
    print(f"   GNEWS_API_KEY: {present(config.GNEWS_API_KEY)}")
    print(f"   REDDIT_CLIENT_ID: {present(config.REDDIT_CLIENT_ID)}")
    print(f"   TWITTER_BEARER_TOKEN: {present(config.TWITTER_BEARER_TOKEN)}")
    print(f"   FINNHUB_API_KEY: {present(config.FINNHUB_API_KEY)}")
    print(f"   ALPHAVANTAGE_API_KEY: {present(config.ALPHAVANTAGE_API_KEY)}")
    print(f"   SLACK_WEBHOOK_URL: {present(config.SLACK_WEBHOOK_URL)}")
    print()

    # Run pipeline and capture returned DataFrame
    try:
        df = app.run()
    except Exception as e:
        log(f"Fatal error running pipeline: {e}", "ERROR")
        df = None

    # Final statistics (safe checks)
    print(f"\n📊 Final Statistics:")
    if df is None:
        print("   ⚠️  Pipeline did not produce a DataFrame (see logs).")
    elif isinstance(df, pd.DataFrame) and df.empty:
        print("   - Total items: 0 (empty DataFrame)")
        print(f"   - Output file: {app.output_file}")
    else:
        try:
            sources = ', '.join(sorted(df['source'].dropna().unique()))
        except Exception:
            sources = "unknown"
        print(f"   - Total items: {len(df)}")
        print(f"   - Sources: {sources}")
        if len(df) > 0:
            print(f"   - Date range: {df['date'].min()} to {df['date'].max()}")
            print(f"   - Sentiment breakdown:")
            sentiment_counts = df['sentiment'].value_counts()
            for sentiment, count in sentiment_counts.items():
                print(f"     • {sentiment}: {count} ({count/len(df)*100:.1f}%)")
        print(f"   - Output file: {app.output_file}")
    print(f"\n✅ Ready for dashboard visualization!")
