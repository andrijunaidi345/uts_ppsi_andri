# Smart Food Safety Lampung - Native PowerShell HTTP Server
# Copyright©2026 by M. Andri Junaidi dan Dr. Erliyan Redy Susanto, M.Kom

$ports = @(8080, 8081, 8082, 3000, 5000, 8000)
$listener = $null
$activePort = $null
$activePrefix = $null

foreach ($p in $ports) {
    try {
        $tempListener = New-Object System.Net.HttpListener
        $prefix = "http://localhost:$p/"
        $tempListener.Prefixes.Add($prefix)
        $tempListener.Start()
        $listener = $tempListener
        $activePort = $p
        $activePrefix = $prefix
        break
    } catch {
        # Port sedang digunakan, coba port berikutnya
    }
}

if (-not $listener) {
    Write-Host "Error: Tidak dapat mengikat port HTTP localhost." -ForegroundColor Red
    exit 1
}

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  Smart Food Safety Lampung — Terintegrasi BBPOM & Dinas Ketahanan Pangan" -ForegroundColor Green
Write-Host "  Platform Pengawasan Keamanan Pangan Pasar Tradisional Provinsi Lampung" -ForegroundColor Green
Write-Host "  Copyright©2026 by M. Andri Junaidi dan Dr. Erliyan Redy Susanto, M.Kom" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "Server Localhost aktif di: $activePrefix" -ForegroundColor Yellow
Write-Host "Membuka browser sistem otomatis di $activePrefix ..." -ForegroundColor Cyan

try { Start-Process $activePrefix } catch {}

$currentDir = $PSScriptRoot
if (-not $currentDir) { $currentDir = (Get-Location).Path }

Write-Host "Tekan CTRL + C di jendela ini untuk menghentikan server." -ForegroundColor Gray
Write-Host "--------------------------------------------------------------------" -ForegroundColor DarkGray

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath
        if ($path -eq "/" -or [string]::IsNullOrWhiteSpace($path)) {
            $path = "/index.html"
        }

        $cleanPath = $path.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $currentDir $cleanPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()

            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".htm"  { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".ts"   { "text/plain; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".svg"  { "image/svg+xml" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".ico"  { "image/x-icon" }
                ".md"   { "text/plain; charset=utf-8" }
                Default { "application/octet-stream" }
            }

            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "[200 OK] $($request.HttpMethod) $path" -ForegroundColor Green
        } else {
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Objek Tidak Ditemukan: $path")
            $response.StatusCode = 404
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            Write-Host "[404 Not Found] $($request.HttpMethod) $path" -ForegroundColor Red
        }
        $response.OutputStream.Close()
    } catch {
        # Tangani browser connection resets
    }
}
