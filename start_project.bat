@echo off
echo Starting Adheseal RFM Analysis Project...

echo Starting Backend Server...
start "Backend Server" cmd.exe /k "cd rfm_backend && uvicorn app.main:app --reload"

echo Starting Frontend Development Server...
start "Frontend Server" cmd.exe /k "cd rfm_frontend && npm run dev"

echo Both servers are starting. Check the respective terminal windows for status.
echo You can close this window or press Ctrl+C to terminate this script.
pause
