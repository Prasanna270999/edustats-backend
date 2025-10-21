@echo off
title Start MongoDB and Backend

REM Start MongoDB
start "" "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath "C:\data\db"

REM Wait 5 seconds
timeout /t 5 /nobreak

REM Start backend server
start "" cmd /k "cd /d %~dp0 && npm run dev"

echo All done! MongoDB + backend started.
pause
