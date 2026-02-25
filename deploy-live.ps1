# Run this script in PowerShell ON YOUR PC (not in Cursor's terminal).
# It will open your browser to log in to Railway and Vercel once, then deploy everything.
# Usage: Right-click deploy-live.ps1 -> Run with PowerShell, or: powershell -ExecutionPolicy Bypass -File deploy-live.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot

Write-Host "=== Small Town Big Stage - Deploy to live (www.smalltownbigstage.org) ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check CLIs
$railway = Get-Command railway -ErrorAction SilentlyContinue
$vercel = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $railway) {
    Write-Host "Railway CLI not found. Install: npm install -g @railway/cli" -ForegroundColor Yellow
    exit 1
}
if (-not $vercel) {
    Write-Host "Vercel CLI not found. Install: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

# 2. Railway login
Write-Host "[1/5] Checking Railway login..." -ForegroundColor Cyan
$railwayWho = & railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Railway: not logged in. Opening browser - please log in, then run this script again." -ForegroundColor Yellow
    & railway login
    exit 0
}
Write-Host "  Logged in to Railway." -ForegroundColor Green

# 3. Vercel login
Write-Host "[2/5] Checking Vercel login..." -ForegroundColor Cyan
$vercelWho = & vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel: not logged in. Opening browser - please log in, then run this script again." -ForegroundColor Yellow
    & vercel login
    exit 0
}
Write-Host "  Logged in to Vercel." -ForegroundColor Green

# 4. Deploy backend (Railway)
Write-Host "[3/5] Deploying backend to Railway..." -ForegroundColor Cyan
Push-Location (Join-Path $RepoRoot "backend")

# Link or init project (non-interactive: use --ci or environment)
if (-not (Test-Path ".railway")) {
    Write-Host "  First time: linking Railway project. If prompted, create a new project." -ForegroundColor Yellow
    & railway link 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Run: railway link (choose or create a project), then run this script again." -ForegroundColor Yellow
        Pop-Location
        exit 1
    }
}

# Set env vars in Railway (so backend has FRONTEND_URL and PORT)
& railway variable set "FRONTEND_URL=https://www.smalltownbigstage.org" "PORT=3001" 2>&1

& railway up --detach 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Railway deploy failed. Fix errors above and run again." -ForegroundColor Red
    Pop-Location
    exit 1
}

# Get URL (railway status sometimes shows it)
Start-Sleep -Seconds 5
$status = & railway status 2>&1
$railwayUrl = $null
if ($status -match "https://[^\s]+\.railway\.app") { $railwayUrl = $Matches[0] }
if (-not $railwayUrl) {
    $railwayUrl = Read-Host "  Paste your Railway service URL (e.g. https://....up.railway.app)"
}
$railwayUrl = $railwayUrl.Trim().Trim('"')
Pop-Location
Write-Host "  Backend URL: $railwayUrl" -ForegroundColor Green

# 5. Deploy frontend (Vercel)
Write-Host "[4/5] Deploying frontend to Vercel..." -ForegroundColor Cyan
Push-Location (Join-Path $RepoRoot "frontend")

$env:NEXT_PUBLIC_API_URL = $railwayUrl
& vercel deploy --prod --yes 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Vercel deploy failed. Fix errors above and run again." -ForegroundColor Red
    Pop-Location
    exit 1
}

# Add domain (may need to be done in dashboard if first time)
& vercel domains add www.smalltownbigstage.org 2>&1
Pop-Location
Write-Host "  Frontend deployed to Vercel." -ForegroundColor Green

# 6. GoDaddy instructions
Write-Host "[5/5] GoDaddy DNS (you must do this once):" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Go to https://godaddy.com -> My Products -> smalltownbigstage.org -> DNS" -ForegroundColor White
Write-Host "  2. Add or edit:" -ForegroundColor White
Write-Host "     Type: A    Name: @     Value: 76.76.21.21    TTL: 600" -ForegroundColor White
Write-Host "     Type: CNAME  Name: www  Value: cname.vercel-dns.com  TTL: 600" -ForegroundColor White
Write-Host "  3. Save. In 5-60 min the site will be live at https://www.smalltownbigstage.org" -ForegroundColor White
Write-Host ""
Write-Host "=== Done. Add Stripe keys later in Railway Variables. ===" -ForegroundColor Cyan
