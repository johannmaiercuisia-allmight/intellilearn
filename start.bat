@echo off
echo Starting PostgreSQL...
net start postgresql-x64-18 2>nul
echo.
echo Starting all servers...
cd /d "%~dp0"
npx concurrently --names "LARAVEL,REACT,AI" --prefix-colors "green,cyan,magenta" "php artisan serve" "cd frontend && npm run dev" "cd ai-service && venv\\Scripts\\activate && uvicorn app:app --reload --port 8001"
