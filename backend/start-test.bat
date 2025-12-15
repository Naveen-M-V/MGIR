@echo off
echo ========================================
echo MGIR Backend Testing Script
echo ========================================
echo.

echo 1. Installing dependencies...
call npm install

echo.
echo 2. Testing database connection...
node test-db.js

echo.
echo 3. Starting the server...
echo Server will run on http://localhost:5000
echo Health check: http://localhost:5000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
