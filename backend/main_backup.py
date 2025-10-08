from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os
from typing import Dict, List, Any
from textblob import TextBlob
import re
import uvicorn
from collections import defaultdict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Domain configurations
DOMAINS = {
    "ai_ml": {
        "name": "Artificial Intelligence & Machine Learning",
        "emoji": "🧠",
        "competitors": ["OpenAI", "Anthropic", "DeepMind", "Hugging Face", "Stability AI"]
    },
    "cloud": {
        "name": "Cloud Computing & SaaS",
        "emoji": "☁️",
        "competitors": ["AWS", "Microsoft Azure", "Google Cloud", "Salesforce", "Oracle"]
    },
    "cybersecurity": {
        "name": "Cybersecurity & Data Privacy",
        "emoji": "🔐",
        "competitors": ["Palo Alto Networks", "CrowdStrike", "Fortinet", "Cloudflare", "Check Point"]
    },
    "web3": {
        "name": "Web3, Blockchain & Crypto",
        "emoji": "🌐",
        "competitors": ["Coinbase", "Binance", "ConsenSys", "Chainalysis", "Polygon Labs"]
    },
    "arvr": {
        "name": "Augmented & Virtual Reality",
        "emoji": "",
        "competitors": ["Meta", "HTC Vive", "Niantic", "Magic Leap", "Varjo"]
    },
    "robotics": {
        "name": "Robotics & Automation",
        "emoji": "",
        "competitors": ["Boston Dynamics", "ABB Robotics", "iRobot", "Fanuc", "UiPath"]
    },
    "semiconductors": {
        "name": "Semiconductors & Hardware",
        "emoji": "",
        "competitors": ["Intel", "AMD", "NVIDIA", "TSMC", "Qualcomm"]
    },
    "quantum": {
        "name": "Quantum Computing",
        "emoji": "",
        "competitors": ["IBM Quantum", "Rigetti", "IonQ", "D-Wave Systems", "Xanadu"]
    },
    "consumer": {
        "name": "Consumer Electronics",
        "emoji": "",
        "competitors": ["Apple", "Samsung", "Sony", "LG", "Xiaomi"]
    },
    "greentech": {
        "name": "Green Tech & Energy Innovation",
        "emoji": "",
        "competitors": ["Tesla Energy", "Enphase", "Siemens Energy", "Ørsted", "First Solar"]
    }
}

def compute_sentiment(text):
    if pd.isna(text) or text == "":
        return 0.0
    try:
        blob = TextBlob(str(text))
        return blob.sentiment.polarity
    except:
        return 0.0

def load_and_process_csv(domain_key, csv_type):
    file_path = f"data/{domain_key}_{csv_type}.csv"
    
    if not os.path.exists(file_path):
        return pd.DataFrame()
    
    try:
        df = pd.read_csv(file_path)
        
        # Handle different date column names
        date_columns = ['date', 'published_at', 'timestamp']
        for col in date_columns:
            if col in df.columns:
                df['date'] = pd.to_datetime(df[col], errors='coerce')
                break
        
        # Handle different text column names for sentiment analysis
        if csv_type == 'news':
            text_columns = ['summary', 'content', 'title', 'text']
            for col in text_columns:
                if col in df.columns:
                    text_col = col
                    break
            else:
                text_col = None
        else:  # social
            text_columns = ['text', 'content', 'message']
            for col in text_columns:
                if col in df.columns:
                    text_col = col
                    break
            else:
                text_col = None
        
        # Compute sentiment if missing or update existing
        if text_col and text_col in df.columns:
            if 'sentiment_score' not in df.columns:
                df['sentiment_score'] = df[text_col].apply(compute_sentiment)
            else:
                # Fill missing sentiment scores
                mask = df['sentiment_score'].isna()
                if mask.any():
                    df.loc[mask, 'sentiment_score'] = df.loc[mask, text_col].apply(compute_sentiment)
        
        # Handle different source column names
        if 'source' not in df.columns:
            if 'platform' in df.columns:
                df['source'] = df['platform']
            elif 'company' in df.columns:
                df['source'] = df['company']
            else:
                df['source'] = 'Unknown'
        
        # Ensure required columns exist
        if 'title' not in df.columns and text_col:
            df['title'] = df[text_col].str[:100] + '...'
        
        return df
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return pd.DataFrame()

@app.get("/")
async def root():
    return {"message": "INSIGHTIQ API is running"}

@app.get("/api/domains")
async def get_domains():
    return DOMAINS

@app.get("/api/data/{domain_key}/{data_type}")
async def get_data(domain_key: str, data_type: str):
    if domain_key not in DOMAINS:
        raise HTTPException(status_code=404, detail="Domain not found")
    
    if data_type not in ["news", "social"]:
        raise HTTPException(status_code=400, detail="Data type must be 'news' or 'social'")
    
    df = load_and_process_csv(domain_key, data_type)
    
    if df.empty:
        return {"data": [], "metrics": {}}
    
    # Convert DataFrame to records
    data = df.to_dict('records')
    
    # Compute metrics
    metrics = {
        "total_count": len(df),
        "avg_sentiment": float(df['sentiment_score'].mean()) if 'sentiment_score' in df.columns else 0,
        "date_range": {
            "start": df['date'].min().isoformat() if 'date' in df.columns and not df['date'].isna().all() else None,
            "end": df['date'].max().isoformat() if 'date' in df.columns and not df['date'].isna().all() else None
        }
    }
    
    return {"data": data, "metrics": metrics}

@app.get("/api/dashboard/{domain_key}")
async def get_dashboard_data(domain_key: str):
    if domain_key not in DOMAINS:
        raise HTTPException(status_code=404, detail="Domain not found")
    
    domain_info = DOMAINS[domain_key]
    news_df = load_and_process_csv(domain_key, 'news')
    social_df = load_and_process_csv(domain_key, 'social')
    
    # Competitor analysis
    competitors_data = []
    for competitor in domain_info["competitors"]:
        # Check multiple columns for competitor mentions
        news_mentions = 0
        social_mentions = 0
        competitor_sentiment = 0
        
        if not news_df.empty:
            # Check company column first, then title, then text
            if 'company' in news_df.columns:
                news_mentions = len(news_df[news_df['company'].str.contains(competitor, case=False, na=False)])
                competitor_news = news_df[news_df['company'].str.contains(competitor, case=False, na=False)]
            else:
                # Fallback to searching in title or text
                search_cols = ['title', 'text', 'summary', 'content']
                for col in search_cols:
                    if col in news_df.columns:
                        news_mentions = len(news_df[news_df[col].str.contains(competitor, case=False, na=False)])
                        competitor_news = news_df[news_df[col].str.contains(competitor, case=False, na=False)]
                        break
                else:
                    competitor_news = pd.DataFrame()
            
            if not competitor_news.empty and 'sentiment_score' in competitor_news.columns:
                competitor_sentiment = competitor_news['sentiment_score'].mean()
        
        if not social_df.empty:
            # Check company column first, then text
            if 'company' in social_df.columns:
                social_mentions = len(social_df[social_df['company'].str.contains(competitor, case=False, na=False)])
            else:
                search_cols = ['text', 'content', 'message']
                for col in search_cols:
                    if col in social_df.columns:
                        social_mentions = len(social_df[social_df[col].str.contains(competitor, case=False, na=False)])
                        break
        
        competitors_data.append({
            "name": competitor,
            "news_count": news_mentions,
            "social_mentions": social_mentions,
            "sentiment": float(competitor_sentiment) if not pd.isna(competitor_sentiment) else 0
        })
    
    # Overall metrics
    combined_df = pd.concat([news_df, social_df], ignore_index=True)
    overall_sentiment = float(combined_df['sentiment_score'].mean()) if not combined_df.empty and 'sentiment_score' in combined_df.columns else 0
    
    return {
        "domain": domain_info,
        "competitors": competitors_data,
        "overall_sentiment": overall_sentiment,
        "total_news": len(news_df),
        "total_social": len(social_df)
    }

@app.get("/api/alerts/{domain_key}")
async def get_alerts(domain_key: str):
    if domain_key not in DOMAINS:
        raise HTTPException(status_code=404, detail="Domain not found")
    
    # Simple alerts for demo
    alerts = [
        {
            "id": f"demo_alert_{domain_key}",
            "type": "trending",
            "title": "Market Activity Detected",
            "description": f"Increased activity in {DOMAINS[domain_key]['name']} sector",
            "severity": "medium",
            "timestamp": datetime.now().isoformat(),
            "source": "automated_analysis"
        }
    ]
    return {"alerts": alerts}

if __name__ == "__main__":
    print("Starting INSIGHTIQ Backend Server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
