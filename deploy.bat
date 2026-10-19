@echo off
title Push Portfolio Updates to GitHub
set "PATH=%LOCALAPPDATA%\GitHubDesktop\app-3.6.7\resources\app\git\cmd;%PATH%"

echo ======================================================================
echo   [+] SOC DEPLOYMENT SCRIPT: P. Raghavendra Portfolio
echo   [+] Target Repository: https://github.com/saaaaikrrish/Portfolio.git
echo ======================================================================
echo.

git status

echo.
set /p commitMsg="[?] Enter commit message (or press ENTER for default): "
if "%commitMsg%"=="" (
    set commitMsg=Update cybersecurity portfolio and achievements
)

echo.
echo [+] Staging files...
git add index.html style.css script.js

echo [+] Creating commit: %commitMsg%
git commit -m "%commitMsg%"

echo [+] Pushing to main branch on GitHub...
git push -u origin main

echo.
echo ======================================================================
echo   [+] Success! Your changes are synced to GitHub.
echo   [+] Live URL: https://saaaaikrrish.github.io/Portfolio/
echo ======================================================================
echo.
pause
