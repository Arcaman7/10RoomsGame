[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateRange(1, 3999)]
    [int]$Version,
    [string]$OutputFile,
    [switch]$Check
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$sourceRoot = Join-Path $projectRoot 'src'
$templatePath = Join-Path $sourceRoot 'index.html'
$utf8 = [System.Text.UTF8Encoding]::new($false)

function ConvertTo-Roman([int]$Number) {
    $pairs = @(
        @(1000, 'M'), @(900, 'CM'), @(500, 'D'), @(400, 'CD'),
        @(100, 'C'), @(90, 'XC'), @(50, 'L'), @(40, 'XL'),
        @(10, 'X'), @(9, 'IX'), @(5, 'V'), @(4, 'IV'), @(1, 'I')
    )
    $result = [System.Text.StringBuilder]::new()
    foreach ($pair in $pairs) {
        while ($Number -ge $pair[0]) {
            [void]$result.Append($pair[1])
            $Number -= $pair[0]
        }
    }
    return $result.ToString()
}

function Join-SourceFiles([string]$Path, [string]$Filter) {
    $files = Get-ChildItem -LiteralPath $Path -Recurse -File -Filter $Filter | Sort-Object FullName
    if (-not $files) { throw "No $Filter source files found below $Path" }
    $builder = [System.Text.StringBuilder]::new()
    foreach ($file in $files) {
        [void]$builder.Append([System.IO.File]::ReadAllText($file.FullName))
    }
    return $builder.ToString()
}

if (-not (Test-Path -LiteralPath $templatePath)) {
    throw "Source template not found: $templatePath"
}

if (-not $OutputFile) { $OutputFile = "game_$Version.html" }
$outputPath = Join-Path $projectRoot $OutputFile
$resolvedParent = (Resolve-Path (Split-Path -Parent $outputPath)).Path
if ($resolvedParent -ne $projectRoot) {
    throw 'Build output must stay in the project root.'
}
if (-not (Test-Path -LiteralPath $outputPath)) {
    throw "Refusing to create an unversioned build. Run new_version.ps1 first: $outputPath"
}
if ((Split-Path -Leaf $outputPath) -ne "game_$Version.html") {
    throw "Output filename must match the requested version: game_$Version.html"
}

$template = [System.IO.File]::ReadAllText($templatePath)
$styles = Join-SourceFiles (Join-Path $sourceRoot 'styles') '*.css'
$scripts = Join-SourceFiles (Join-Path $sourceRoot 'js') '*.js'

$templateTokens = @('{{TEN_ROOMS_STYLES}}', '{{TEN_ROOMS_SCRIPTS}}', '{{VERSION_ROMAN}}')
foreach ($token in $templateTokens) {
    if (-not $template.Contains($token)) { throw "Template token missing: $token" }
}

$output = $template.Replace('{{TEN_ROOMS_STYLES}}', $styles)
$output = $output.Replace('{{TEN_ROOMS_SCRIPTS}}', $scripts)
if (-not $output.Contains('{{VERSION_NUMBER}}')) {
    throw 'Numeric version token missing from assembled JavaScript.'
}
$output = $output.Replace('{{VERSION_ROMAN}}', (ConvertTo-Roman $Version))
$output = $output.Replace('{{VERSION_NUMBER}}', [string]$Version)

foreach ($token in @('{{TEN_ROOMS_STYLES}}', '{{TEN_ROOMS_SCRIPTS}}', '{{VERSION_ROMAN}}', '{{VERSION_NUMBER}}')) {
    if ($output.Contains($token)) { throw "Unresolved build token: $token" }
}

if ($Check) {
    $current = [System.IO.File]::ReadAllText($outputPath)
    if ($current -cne $output) {
        throw "Build is stale: run scripts/build.ps1 -Version $Version"
    }
    Write-Output "Build is current: $outputPath"
} else {
    [System.IO.File]::WriteAllText($outputPath, $output, $utf8)
    Write-Output "Built $outputPath"
}
