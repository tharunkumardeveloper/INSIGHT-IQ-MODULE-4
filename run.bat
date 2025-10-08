@echo off
echo ========================================
echo INSIGHTIQ - Strategic Intelligence Platform
echo ========================================
echo.

echo Checking if setup is complete...

if not exist venv (
    echo ❌ Virtual environment not found
    echo Please run 'setup.bat' first
    pause
    exit /b 1
)

if not exist node_modules (
    echo ❌ Node modules not found
    echo Please run 'setup.bat' first
    pause
    exit /b 1
)

echo ✅ Setup verified

echo.
echo Starting INSIGHTIQ...
echo.
echo 🔧 Backend API: http://localhost:8000
echo 🌐 Frontend UI: http://localhost:3000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo ⚠️  Keep this window open while using the application
echo ⚠️  Press Ctrl+C to stop the servers
echo.

REM Start backend in a new window
echo Starting backend server...
start "INSIGHTIQ Backend" cmd /k "call venv\Scripts\activate.bat && python backend/main.py"

REM Wait a moment for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in a new window
echo Starting frontend server...
start "INSIGHTIQ Frontend" cmd /k "npm run dev"

REM Wait for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo 🚀 INSIGHTIQ is starting up...
echo ========================================
echo.
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.

REM Wait a bit more then open browser
timeout /t 8 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo 📊 INSIGHTIQ is now running!
echo ========================================
echo.
echo Features available:
echo • 10 Technology domains to explore
echo • Dashboard with competitor analysis
echo • Market trends and insights
echo • News and social media analysis
echo • Automated alerts system
echo • Dark/Light theme toggle
echo.
echo Press any key to close this window (servers will continue running)
pause >nul