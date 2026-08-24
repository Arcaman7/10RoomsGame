[CmdletBinding()]
param(
    [int]$Version
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

if (-not $Version) {
    $latest = Get-ChildItem -LiteralPath $projectRoot -File |
        Where-Object { $_.Name -match '^game_(\d+)\.html$' } |
        ForEach-Object { [pscustomobject]@{ File = $_; Number = [int]$Matches[1] } } |
        Sort-Object Number |
        Select-Object -Last 1
    if (-not $latest) { throw 'No numbered game build found.' }
    $Version = $latest.Number
}

$buildPath = Join-Path $projectRoot "game_$Version.html"
if (-not (Test-Path -LiteralPath $buildPath)) { throw "Build not found: $buildPath" }

& (Join-Path $PSScriptRoot 'build.ps1') -Version $Version -Check

$html = [System.IO.File]::ReadAllText($buildPath)
foreach ($marker in @('<title>', '<style>', '</style>', '<canvas id="game"', '<script>', '</script>')) {
    if (-not $html.Contains($marker)) { throw "Required HTML marker missing: $marker" }
}
if ($html.Contains('{{TEN_ROOMS_') -or $html.Contains('{{VERSION_')) {
    throw 'Build contains an unresolved source token.'
}

$scriptStart = $html.IndexOf('<script>', [System.StringComparison]::Ordinal)
$scriptEnd = $html.IndexOf('</script>', $scriptStart, [System.StringComparison]::Ordinal)
if ($scriptStart -lt 0 -or $scriptEnd -lt 0) { throw 'Inline script block not found.' }
$javascript = $html.Substring($scriptStart + '<script>'.Length, $scriptEnd - $scriptStart - '<script>'.Length)

$node = Get-Command node -ErrorAction SilentlyContinue
$nodePath = if ($node) { $node.Source } else {
    $bundledNode = Join-Path ([Environment]::GetFolderPath('UserProfile')) '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
    if (Test-Path -LiteralPath $bundledNode) { $bundledNode } else { $null }
}
if (-not $nodePath) { throw 'Node.js is required for JavaScript syntax validation.' }

$tempJs = Join-Path ([System.IO.Path]::GetTempPath()) ("ten-rooms-{0}-{1}.js" -f $Version, [guid]::NewGuid().ToString('N'))
try {
    [System.IO.File]::WriteAllText($tempJs, $javascript, [System.Text.UTF8Encoding]::new($false))
    & $nodePath --check $tempJs
    if ($LASTEXITCODE -ne 0) { throw 'Inline JavaScript syntax validation failed.' }
} finally {
    if (Test-Path -LiteralPath $tempJs) { Remove-Item -LiteralPath $tempJs -Force }
}

Write-Output "Validated game_$Version.html"
