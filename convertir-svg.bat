@echo off
chcp 65001 >nul
color 0A
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  🎨 CONVERSOR SVG a HTML/REACT                ║
echo ║                                                                ║
echo ║  Arrastra tu archivo .svg aquí o ingresa la ruta              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Si se pasa el archivo como parámetro (drag & drop)
if "%~1"=="" (
    set /p ruta="➡️  Ingresa la ruta completa del archivo .svg: "
) else (
    set "ruta=%~1"
)

REM Validar que el archivo existe
if not exist "%ruta%" (
    echo.
    echo ❌ ERROR: No encontré el archivo en esa ruta
    echo    Verifica que copiaste bien la ruta
    echo.
    pause
    exit /b 1
)

REM Validar que es un archivo .svg
if /i not "%ruta:~-4%"==".svg" (
    echo.
    echo ❌ ERROR: El archivo debe ser .svg
    echo    Archivo: %ruta%
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Archivo encontrado: %ruta%
echo.
echo ⏳ Convirtiendo...
echo.

REM Ejecutar el script Node.js
node "%~dp0scripts\svg-to-html.js" "%ruta%"

if %errorlevel% equ 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║                   ✅ ¡CONVERSIÓN EXITOSA!                      ║
    echo ║                                                                ║
    echo ║  Se generaron 2 archivos en la misma carpeta:                ║
    echo ║                                                                ║
    echo ║  1. .html  → Abre en el navegador para ver el resultado      ║
    echo ║  2. .tsx   → Código React listo para copiar                  ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
) else (
    echo.
    echo ❌ Hubo un error durante la conversión
    echo.
)

pause
