#!/usr/bin/env python3
"""
Test script to verify INSIGHTIQ setup and functionality
"""

import os
import sys
import requests
import pandas as pd
from pathlib import Path

def test_python_dependencies():
    """Test if all Python dependencies are installed"""
    print("Testing Python dependencies...")
    try:
        import fastapi
        import uvicorn
        import pandas
        import numpy
        import textblob
        print("✅ All Python dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing Python dependency: {e}")
        return False

def test_data_files():
    """Test if data files exist and are readable"""
    print("Testing data files...")
    data_dir = Path("data")
    if not data_dir.exists():
        print("❌ Data directory not found")
        return False
    
    csv_files = list(data_dir.glob("*.csv"))
    if not csv_files:
        print("❌ No CSV files found in data directory")
        return False
    
    print(f"✅ Found {len(csv_files)} CSV files")
    
    # Test reading a sample file
    try:
        sample_file = csv_files[0]
        df = pd.read_csv(sample_file)
        print(f"✅ Successfully read {sample_file.name} with {len(df)} rows")
        return True
    except Exception as e:
        print(f"❌ Error reading CSV file: {e}")
        return False

def test_backend_startup():
    """Test if backend can start (without actually starting it)"""
    print("Testing backend configuration...")
    try:
        import sys
        sys.path.append('.')
        import backend.main
        print(f"✅ Backend configuration loaded with {len(backend.main.DOMAINS)} domains")
        return True
    except Exception as e:
        print(f"❌ Backend configuration error: {e}")
        return False

def test_frontend_files():
    """Test if frontend files exist"""
    print("Testing frontend files...")
    required_files = [
        "package.json",
        "src/main.jsx",
        "src/App.jsx",
        "index.html"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing frontend files: {missing_files}")
        return False
    
    print("✅ All required frontend files exist")
    return True

def test_package_json():
    """Test package.json dependencies"""
    print("Testing package.json...")
    try:
        import json
        with open("package.json", "r") as f:
            package_data = json.load(f)
        
        required_deps = ["react", "react-dom", "react-router-dom", "recharts"]
        missing_deps = []
        
        dependencies = {**package_data.get("dependencies", {}), **package_data.get("devDependencies", {})}
        
        for dep in required_deps:
            if dep not in dependencies:
                missing_deps.append(dep)
        
        if missing_deps:
            print(f"❌ Missing dependencies in package.json: {missing_deps}")
            return False
        
        print("✅ All required dependencies found in package.json")
        return True
    except Exception as e:
        print(f"❌ Error reading package.json: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 INSIGHTIQ Setup Test")
    print("=" * 50)
    
    tests = [
        test_python_dependencies,
        test_data_files,
        test_backend_startup,
        test_frontend_files,
        test_package_json
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
            print()
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            print()
    
    print("=" * 50)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! INSIGHTIQ is ready to run.")
        print("Run 'setup_and_run.bat' to start the application.")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        print("Make sure all dependencies are installed:")
        print("  - Python: pip install -r requirements.txt")
        print("  - Node.js: npm install")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)