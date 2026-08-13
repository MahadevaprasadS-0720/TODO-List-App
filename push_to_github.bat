@echo off
echo ===================================================
echo   Pushing TaskFlow Pro App to GitHub...
echo ===================================================

cd /d "%~dp0"

echo [1/5] Initializing Git Repository...
git init

echo [2/5] Staging Project Files...
git add .

echo [3/5] Creating Commit...
git commit -m "refactor: replace Express/MongoDB server with Firebase Firestore backend"

echo [4/5] Setting Remote Repository...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/MahadevaprasadS-0720/TODO-List-App.git

echo [5/5] Pushing Code to GitHub...
git push -u origin main --force

echo ===================================================
echo   Successfully pushed to:
echo   https://github.com/MahadevaprasadS-0720/TODO-List-App
echo ===================================================
pause
