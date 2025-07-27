@echo off
echo Starting Flask API Server...
echo.
echo Make sure you have Python and the required packages installed.
echo.
cd backend
echo Installing requirements...
pip install -r requirements.txt
echo.
echo Starting server on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.
python app.py
pause 