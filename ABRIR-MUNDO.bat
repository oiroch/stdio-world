@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias del proyecto...
  call npm ci
  if errorlevel 1 goto error
)
echo Abre http://127.0.0.1:5173 en tu navegador.
call npm run dev
goto end
:error
echo No se pudo preparar el sitio. Revisa el mensaje anterior.
:end
pause
