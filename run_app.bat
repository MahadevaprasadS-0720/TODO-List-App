@echo off
echo ===================================================
echo   Starting Firebase-Powered Todo Application...
echo ===================================================

cd /d "%~dp0"

echo [1/2] Installing client dependencies...
cd client
call npm install

cd ..

echo [2/2] Launching React Client...
start "Todo Application (React + Vite + Firebase)" cmd /k "cd /d "%~dp0client" && npm run dev"

echo ===================================================
echo   Client Application: http://localhost:3000
echo   Backend: Cloud Firebase Firestore Connected
echo ===================================================
