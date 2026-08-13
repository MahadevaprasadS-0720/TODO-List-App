Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   Starting Firebase-Powered Todo Application..." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot

Write-Host "[1/2] Installing client dependencies..." -ForegroundColor Yellow
Set-Location -Path "$rootDir\client"
npm install

Write-Host "[2/2] Launching Client on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\client'; npm run dev"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   Client Application: http://localhost:3000" -ForegroundColor Green
Write-Host "   Backend: Cloud Firebase Firestore Connected" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
