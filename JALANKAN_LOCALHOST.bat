@echo off
title Smart Food Safety Lampung - Localhost Server
cls
echo ====================================================================
echo   Smart Food Safety Lampung
echo   Terintegrasi BBPOM ^& Dinas Ketahanan Pangan Provinsi Lampung
echo   Copyright(C)2026 by M. Andri Junaidi dan Dr. Erliyan Redy Susanto, M.Kom
echo ====================================================================
echo.
echo Menjalankan Web Server Localhost...
echo Halaman akan otomatis terbuka di browser Anda (http://localhost:8080).
echo.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause

