# scripts/install-wan21.ps1
# PowerShell automated installer for Wan2.1 Text-to-Video Engine (1.3B T2V model)

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor DarkYellow
Write-Host "   BRICK-MAKER STUDIO - WAN2.1 INSTALLER   " -ForegroundColor DarkYellow
Write-Host "=========================================" -ForegroundColor DarkYellow

# 1. Check Python installation
Write-Host "[1/7] Checking Python installation..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Success: Python detected - $pythonVersion" -ForegroundColor Green
} catch {
    Write-Error "Error: Python is not installed or not in the system PATH. Python 3.10+ is required."
    Exit 1
}

# Wan2.1 pins numpy<2, which does not provide a Python 3.13 Windows wheel.
# Use an isolated Python 3.11 environment so system Python remains untouched.
$venvPath = Join-Path (Get-Location) ".venv-wan21"
$pythonExe = Join-Path $venvPath "Scripts/python.exe"
if (!(Test-Path $pythonExe)) {
    if (!(Get-Command uv -ErrorAction SilentlyContinue)) {
        Write-Error "Python 3.11 environment is required. Install uv from https://docs.astral.sh/uv/ and rerun."
        Exit 1
    }

    Write-Host "Preparing isolated Python 3.11 environment..." -ForegroundColor Cyan
    uv python install 3.11
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Unable to install Python 3.11 through uv."
        Exit 1
    }

    uv venv $venvPath --python 3.11 --seed
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Unable to create the Wan2.1 virtual environment."
        Exit 1
    }
}

$venvPythonVersion = & $pythonExe --version 2>&1
Write-Host "Using Wan2.1 environment - $venvPythonVersion" -ForegroundColor Green

# 2. Check Git installation
Write-Host "[2/7] Checking Git installation..." -ForegroundColor Cyan
try {
    $gitVersion = git --version 2>&1
    Write-Host "Success: Git detected - $gitVersion" -ForegroundColor Green
} catch {
    Write-Error "Error: Git is not installed or not in the system PATH."
    Exit 1
}

# 3. Create directories
Write-Host "[3/7] Setting up folders..." -ForegroundColor Cyan
$enginePath = "./engines/Wan2.1"
$modelPath = "./models/Wan2.1-T2V-1.3B"

if (!(Test-Path "./engines")) {
    New-Item -ItemType Directory -Path "./engines" | Out-Null
}
if (!(Test-Path "./models")) {
    New-Item -ItemType Directory -Path "./models" | Out-Null
}
Write-Host "Folders successfully prepared." -ForegroundColor Green

# 4. Clone GitHub Repository
Write-Host "[4/7] Clong Wan2.1 GitHub Repository..." -ForegroundColor Cyan
if (Test-Path $enginePath) {
    Write-Host "Wan2.1 repository directory already exists. Skipping clone." -ForegroundColor Yellow
} else {
    try {
        git clone https://github.com/Wan-Video/Wan2.1 $enginePath
        Write-Host "Successfully cloned repository into $enginePath" -ForegroundColor Green
    } catch {
        Write-Error "Failed to clone Wan2.1 repository from GitHub."
        Exit 1
    }
}

# 5. Install huggingface_hub CLI and dependency manager
Write-Host "[5/7] Installing huggingface_hub..." -ForegroundColor Cyan
try {
    & $pythonExe -m pip install --upgrade pip setuptools wheel huggingface_hub
    if ($LASTEXITCODE -ne 0) {
        throw "huggingface_hub installation failed with exit code $LASTEXITCODE."
    }
    Write-Host "huggingface_hub installed successfully." -ForegroundColor Green
} catch {
    Write-Error "Failed to install huggingface_hub via pip."
    Exit 1
}

# 6. Download Model from Hugging Face
Write-Host "[6/7] Downloading Wan2.1-T2V-1.3B model (this might take some time)..." -ForegroundColor Cyan
Write-Host "Target Directory: $modelPath" -ForegroundColor Gray
try {
    $hfExe = Join-Path $venvPath "Scripts/hf.exe"
    & $hfExe download Wan-AI/Wan2.1-T2V-1.3B --local-dir $modelPath
    if ($LASTEXITCODE -ne 0) {
        throw "Hugging Face download failed with exit code $LASTEXITCODE."
    }
    Write-Host "Model downloaded successfully to $modelPath" -ForegroundColor Green
} catch {
    Write-Error "Failed to download model. Please check internet connection, huggingface accessibility, or disk space."
    Exit 1
}

# 7. Install Wan2.1 Requirements
Write-Host "[7/7] Installing Wan2.1 python dependencies..." -ForegroundColor Cyan
try {
    if (Test-Path "$enginePath/requirements.txt") {
        # # flash_attn normally has no Windows wheel and requires a matching
        # CUDA/MSVC build toolchain. Install all portable dependencies first.
        $windowsRequirements = Join-Path $env:TEMP "wan21-requirements-windows.txt"
        Get-Content "$enginePath/requirements.txt" |
            Where-Object { $_ -notmatch "^\s*flash[_-]attn(\s|[<>=!~]|$)" } |
            Set-Content -Path $windowsRequirements -Encoding UTF8

        & $pythonExe -m pip install -r $windowsRequirements
        if ($LASTEXITCODE -ne 0) {
            throw "Wan2.1 dependency installation failed with exit code $LASTEXITCODE."
        }

        Remove-Item $windowsRequirements -Force -ErrorAction SilentlyContinue
        Write-Host "Dependencies successfully installed." -ForegroundColor Green
        Write-Host "Note: # flash_attn was skipped on Windows (optional CUDA acceleration)." -ForegroundColor Yellow
    } else {
        Write-Host "Warning: requirements.txt not found in cloned engine. Skipping pip install -r requirements." -ForegroundColor Yellow
    }
} catch {
    Write-Error "Failed to install Wan2.1 requirements.txt python packages."
    Exit 1
}

Write-Host "=========================================" -ForegroundColor DarkYellow
Write-Host "   WAN2.1 ENGINE INSTALLED SUCCESSFULLY!  " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor DarkYellow
