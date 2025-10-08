#!/usr/bin/env python3
import os
import sys
import csv
from datetime import datetime, timedelta
import random
import json
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

# Domain configurations
DOMAINS = {
    "ai": {
        "title": "Artificial Intelligence & Machine Learning",
        "competitors": ["OpenAI", "Anthropic", "DeepMind", "Hugging Face", "Stability AI"],
        "keywords": ["AI", "machine learning", "neural networks", "GPT", "LLM", "artificial intelligence", "deep learning", "NLP", "computer vision", "robotics"]
    },
    "cloud": {
        "title": "Cloud Computing & SaaS",
        "competitors": ["AWS", "Microsoft Azure", "Google Cloud", "Salesforce", "Oracle"],
        "keywords": ["cloud computing", "SaaS", "infrastructure", "serverless", "containers", "kubernetes", "microservices", "DevOps", "scalability", "migration"]
    },
    "security": {
        "title": "Cybersecurity & Data Privacy",
        "competitors": ["Palo Alto Networks", "CrowdStrike", "Fortinet", "Cloudflare", "Check Point"],
        "keywords": ["cybersecurity", "data privacy", "firewall", "threat detection", "malware", "ransomware", "encryption", "zero trust", "GDPR", "compliance"]
    },
    "web3": {
        "title": "Web3, Blockchain & Crypto",
        "competitors": ["Coinbase", "Binance", "ConsenSys", "Chainalysis", "Polygon Labs"],
        "keywords": ["blockchain", "cryptocurrency", "DeFi", "NFT", "smart contracts", "ethereum", "bitcoin", "web3", "decentralized", "tokenization"]
    },
    "arvr": {
        "title": "Augmented & Virtual Reality",
        "competitors": ["Meta (Reality Labs)", "HTC Vive", "Niantic", "Magic Leap", "Varjo"],
        "keywords": ["virtual reality", "augmented reality", "VR", "AR", "metaverse", "immersive", "headset", "mixed reality", "spatial computing", "haptics"]
    },
    "robotics": {
        "title": "Robotics & Automation",
        "competitors": ["Boston Dynamics", "ABB Robotics", "iRobot", "Fanuc", "UiPath"],
        "keywords": ["robotics", "automation", "industrial robots", "RPA", "autonomous systems", "manufacturing", "AI robotics", "collaborative robots", "process automation", "robotic surgery"]
    },
    "semiconductors": {
        "title": "Semiconductors & Hardware",
        "competitors": ["Intel", "AMD", "NVIDIA", "TSMC", "Qualcomm"],
        "keywords": ["semiconductors", "chips", "processors", "GPU", "CPU", "silicon", "fabrication", "nanotechnology", "Moore's law", "quantum computing"]
    },
    "quantum": {
        "title": "Quantum Computing",
        "competitors": ["IBM Quantum", "Rigetti", "IonQ", "D-Wave Systems", "Xanadu"],
        "keywords": ["quantum computing", "quantum supremacy", "qubits", "quantum algorithms", "quantum cryptography", "quantum entanglement", "superposition", "quantum annealing", "quantum software", "quantum hardware"]
    },
    "consumer": {
        "title": "Consumer Electronics",
        "competitors": ["Apple", "Samsung Electronics", "Sony", "LG Electronics", "Xiaomi"],
        "keywords": ["smartphones", "consumer electronics", "wearables", "smart home", "IoT devices", "tablets", "laptops", "gaming", "5G", "wireless technology"]
    },
    "greentech": {
        "title": "Green Tech & Energy Innovation",
        "competitors": ["Tesla Energy", "Enphase Energy", "Siemens Energy", "Ørsted", "First Solar"],
        "keywords": ["renewable energy", "solar power", "wind energy", "battery technology", "electric vehicles", "energy storage", "carbon capture", "sustainability", "clean technology", "green hydrogen"]
    }
}

# News headline templates
NEWS_TEMPLATES = [
    "{company} announces breakthrough in {keyword} technology",
    "{company} reports {percent}% growth in {keyword} sector",
    "{company} launches new {keyword} platform for enterprises",
    "{company} partners with major tech firms on {keyword} initiative",
    "{company} raises $100M for {keyword} research and development",
    "{company} CEO discusses future of {keyword} at tech conference",
    "{company} acquires startup specializing in {keyword}",
    "{company} releases open-source {keyword} framework",
    "{company} wins major contract for {keyword} implementation",
    "{company} faces regulatory scrutiny over {keyword} practices",
    "Industry experts praise {company}'s {keyword} innovation",
    "{company} stock surges after {keyword} product launch",
    "{company} collaborates with universities on {keyword} research",
    "{company} expands {keyword} operations to new markets",
    "{company} addresses concerns about {keyword} security"
]

# Social media templates
SOCIAL_TEMPLATES = [
    "Just tried {company}'s new {keyword} feature - game changer! 🚀",
    "Thoughts on {company}'s approach to {keyword}? Seems promising 🤔",
    "{company} is leading the {keyword} revolution. Exciting times ahead!",
    "Comparing {keyword} solutions: {company} vs competitors. Thread 🧵",
    "Breaking: {company} announces major {keyword} update",
    "Why {company}'s {keyword} strategy might be the future",
    "Hot take: {company} is undervalued in the {keyword} space",
    "Anyone else excited about {company}'s {keyword} roadmap?",
    "{company} hiring spree in {keyword} - bullish signal?",
    "Deep dive into {company}'s {keyword} technology stack",
    "Unpopular opinion: {company} is overhyped in {keyword}",
    "{company}'s {keyword} demo was impressive at the conference",
    "Investment thesis: Why {company} will dominate {keyword}",
    "Technical analysis of {company}'s {keyword} implementation",
    "User experience review: {company}'s {keyword} platform"
]

def generate_sentiment():
    """Generate realistic sentiment scores and labels"""
    # Bias towards slightly positive sentiment (realistic for tech news)
    sentiment_score = random.gauss(0.1, 0.4)
    sentiment_score = max(-1.0, min(1.0, sentiment_score))  # Clip to [-1, 1]
    
    if sentiment_score > 0.25:
        sentiment_label = "positive"
    elif sentiment_score < -0.25:
        sentiment_label = "negative"
    else:
        sentiment_label = "neutral"
    
    return sentiment_score, sentiment_label

def generate_engagement_score():
    """Generate realistic engagement scores"""
    # Exponential distribution for engagement (some posts go viral)
    base_score = random.expovariate(1/100) + 10
    return int(min(base_score, 10000))

def generate_mention_count():
    """Generate daily mention counts"""
    # Random mentions with some variation
    return random.randint(10, 150)

def create_sample_data(domain_key, domain_info, num_rows=100):
    """Create sample data for a specific domain"""
    
    data = []
    competitors = domain_info["competitors"]
    keywords = domain_info["keywords"]
    
    # Generate data for the last 90 days
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)
    
    for i in range(num_rows):
        # Random date within the last 90 days
        random_date = start_date + timedelta(
            days=random.randint(0, 90),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        
        # Choose random competitor and keyword
        company = random.choice(competitors)
        keyword = random.choice(keywords)
        
        # Determine if this is news or social
        is_news = random.choice([True, False])
        source = "news" if is_news else random.choice(["twitter", "reddit"])
        
        # Generate content
        if is_news:
            template = random.choice(NEWS_TEMPLATES)
            title = template.format(
                company=company,
                keyword=keyword,
                percent=random.randint(5, 50)
            )
            text = f"{title}. {company} continues to innovate in the {keyword} space, with industry analysts noting significant progress in recent developments. The company's strategic focus on {keyword} technology positions it well for future growth in this rapidly evolving market."
            url = f"https://example-news.com/{domain_key}/{company.lower().replace(' ', '-')}/{random.randint(1000, 9999)}"
        else:
            template = random.choice(SOCIAL_TEMPLATES)
            title = template.format(company=company, keyword=keyword)
            text = title
            if source == "twitter":
                url = f"https://twitter.com/user/status/{random.randint(1000000000000000000, 9999999999999999999)}"
            else:
                url = f"https://reddit.com/r/{keyword.replace(' ', '')}/comments/{random.randint(100000, 999999)}"
        
        # Generate metrics
        sentiment_score, sentiment_label = generate_sentiment()
        engagement_score = generate_engagement_score()
        mention_count = generate_mention_count()
        
        # Create row
        row = {
            "source": source,
            "company": company,
            "title": title,
            "text": text,
            "url": url,
            "published_at": random_date.isoformat() + "Z",
            "timestamp": int(random_date.timestamp()),
            "mention_count": mention_count,
            "sentiment_score": round(sentiment_score, 3),
            "sentiment_label": sentiment_label,
            "score": engagement_score,
            "raw_json": json.dumps({
                "domain": domain_key,
                "processed_at": datetime.now().isoformat(),
                "source_type": source,
                "engagement_metrics": {
                    "likes": random.randint(10, 1000),
                    "shares": random.randint(5, 500),
                    "comments": random.randint(0, 200)
                }
            })
        }
        
        data.append(row)
    
    return data

def main():
    """Generate sample data for all domains"""
    
    # Create data directory if it doesn't exist
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    
    print("🚀 Generating comprehensive sample data for InSightIQ...")
    print(f"📊 Creating 100 rows per domain across {len(DOMAINS)} domains")
    print("=" * 60)
    
    total_rows = 0
    
    for domain_key, domain_info in DOMAINS.items():
        print(f"📈 Generating data for {domain_info['title']}...")
        
        # Generate combined data (news + social)
        data = create_sample_data(domain_key, domain_info, 100)
        
        # Split into news and social
        news_data = [row for row in data if row['source'] == 'news']
        social_data = [row for row in data if row['source'] in ['twitter', 'reddit']]
        
        # Save to CSV files
        news_file = data_dir / f"{domain_key}_news.csv"
        social_file = data_dir / f"{domain_key}_social.csv"
        
        # Write news CSV
        if news_data:
            with open(news_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=news_data[0].keys())
                writer.writeheader()
                writer.writerows(news_data)
        
        # Write social CSV
        if social_data:
            with open(social_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=social_data[0].keys())
                writer.writeheader()
                writer.writerows(social_data)
        
        print(f"   ✅ {len(news_data)} news rows → {news_file}")
        print(f"   ✅ {len(social_data)} social rows → {social_file}")
        
        total_rows += len(data)
    
    print("=" * 60)
    print(f"🎉 Sample data generation complete!")
    print(f"📊 Total rows generated: {total_rows}")
    print(f"📁 Files created in: {data_dir.absolute()}")
    print("")
    print("💡 The system will now work offline with this sample data")
    print("🔄 You can refresh with live APIs when daily limits reset")

if __name__ == "__main__":
    main()