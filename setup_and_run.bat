@echo off
echo ========================================
echo INSIGHTIQ - Strategic Intelligence Platform
echo ========================================
echo.

echo [1/6] Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error: Failed to create virtual environment. Make sure Python is installed.
    pause
    exit /b 1
)

echo [2/6] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/6] Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install Python dependencies.
    pause
    exit /b 1
)

echo [4/6] Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo Error: Failed to install Node.js dependencies. Make sure Node.js and npm are installed.
    pause
    exit /b 1
)

echo [5/6] Building frontend...
npm run build
if errorlevel 1 (
    echo Warning: Frontend build failed, but continuing...
)

echo [6/6] Starting INSIGHTIQ...
echo.
echo Backend will start on: http://localhost:8000
echo Frontend will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

start "INSIGHTIQ Backend" cmd /k "venv\Scripts\activate.bat && python backend/main.py"
timeout /t 3 /nobreak > nul
start "INSIGHTIQ Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo INSIGHTIQ is starting up...
echo Open http://localhost:3000 in your browser
echo ========================================
echo.
echo Press any key to exit this window (servers will continue running)
pause > nul