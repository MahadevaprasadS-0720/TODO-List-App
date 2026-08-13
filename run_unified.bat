@echo off
echo ===================================================
echo   Building and Launching Todo Application
echo ===================================================

cd /d "%~dp0"

echo [1/2] Installing client dependencies...
cd client
call npm install
cd ..

echo [2/2] Launching React Client Development Server...
echo ===================================================
echo   Client Application: http://localhost:3000
echo   Backend: Cloud Firebase Firestore Connected
echo ===================================================

cd client
call npm run dev
