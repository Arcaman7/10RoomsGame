[CmdletBinding()]
param(
    [string]$InputFile = 'game_27.html'
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$inputPath = (Resolve-Path (Join-Path $projectRoot $InputFile)).Path
$sourceRoot = Join-Path $projectRoot 'src'

if (Test-Path -LiteralPath $sourceRoot) {
    throw "Refusing to overwrite existing source tree: $sourceRoot"
}

$utf8 = [System.Text.UTF8Encoding]::new($false)
$content = [System.IO.File]::ReadAllText($inputPath)

function Extract-Block([string]$Text, [string]$OpenTag, [string]$CloseTag) {
    $start = $Text.IndexOf($OpenTag, [System.StringComparison]::Ordinal)
    if ($start -lt 0) { throw "Opening tag not found: $OpenTag" }
    $start += $OpenTag.Length
    $end = $Text.IndexOf($CloseTag, $start, [System.StringComparison]::Ordinal)
    if ($end -lt 0) { throw "Closing tag not found: $CloseTag" }
    return [pscustomobject]@{
        Start = $start
        End = $end
        Text = $Text.Substring($start, $end - $start)
    }
}

function Write-Fragments([string]$Block, [object[]]$Parts) {
    for ($i = 0; $i -lt $Parts.Count; $i++) {
        $start = if ($i -eq 0) { 0 } else {
            $pos = $Block.IndexOf($Parts[$i].Marker, [System.StringComparison]::Ordinal)
            if ($pos -lt 0) { throw "Section marker not found: $($Parts[$i].Marker)" }
            $pos
        }
        $end = if ($i + 1 -lt $Parts.Count) {
            $pos = $Block.IndexOf($Parts[$i + 1].Marker, [System.StringComparison]::Ordinal)
            if ($pos -lt 0) { throw "Section marker not found: $($Parts[$i + 1].Marker)" }
            $pos
        } else { $Block.Length }
        if ($end -le $start) { throw "Invalid section order near $($Parts[$i].Path)" }
        $path = Join-Path $sourceRoot $Parts[$i].Path
        [System.IO.Directory]::CreateDirectory((Split-Path -Parent $path)) | Out-Null
        [System.IO.File]::WriteAllText($path, $Block.Substring($start, $end - $start), $utf8)
    }
}

$style = Extract-Block $content '<style>' '</style>'
$script = Extract-Block $content '<script>' '</script>'

$template = $content.Substring(0, $style.Start) + '{{TEN_ROOMS_STYLES}}' +
    $content.Substring($style.End, $script.Start - $style.End) +
    '{{TEN_ROOMS_SCRIPTS}}' + $content.Substring($script.End)

$template = [regex]::Replace($template, '(<title>Десять залов тьмы )[IVXLCDM]+( —)', '$1{{VERSION_ROMAN}}$2', 1)
$template = [regex]::Replace($template, '(ВЕРСИЯ )[IVXLCDM]+( ·)', '$1{{VERSION_ROMAN}}$2', 1)
$scriptText = [regex]::Replace($script.Text, 'game_\d+\.html\?testboss=', 'game_{{VERSION_NUMBER}}.html?testboss=', 1)

if ([regex]::Matches($template, [regex]::Escape('{{VERSION_ROMAN}}')).Count -ne 2) {
    throw 'Expected two Roman version placeholders in the template.'
}
if ([regex]::Matches($scriptText, [regex]::Escape('{{VERSION_NUMBER}}')).Count -ne 1) {
    throw 'Expected one numeric version placeholder in the template.'
}

[System.IO.Directory]::CreateDirectory($sourceRoot) | Out-Null
[System.IO.File]::WriteAllText((Join-Path $sourceRoot 'index.html'), $template, $utf8)

$styleParts = @(
    @{ Path = 'styles/00-base.css'; Marker = $null },
    @{ Path = 'styles/10-touch.css'; Marker = '/* ==== СЕНСОРНОЕ УПРАВЛЕНИЕ ==== */' },
    @{ Path = 'styles/20-game-ui.css'; Marker = '/* ==== души, комбо, синергии, карта, лавки ==== */' },
    @{ Path = 'styles/30-codex.css'; Marker = '/* кодекс пробуждений */' }
)

$scriptParts = @(
    @{ Path = 'js/00-core/00-bootstrap.js'; Marker = $null },
    @{ Path = 'js/10-data/00-catalogs.js'; Marker = '/* ================= ДАННЫЕ ================= */' },
    @{ Path = 'js/10-data/10-weapon-modifiers.js'; Marker = '/* ================= МОДИФИКАТОРЫ ОРУЖИЯ ================= */' },
    @{ Path = 'js/10-data/20-synergies.js'; Marker = '/* ================= СИНЕРГИИ БАФФОВ ================= */' },
    @{ Path = 'js/10-data/30-curses.js'; Marker = '/* ================= ПРОКЛЯТЫЕ ДАРЫ ================= */' },
    @{ Path = 'js/10-data/40-map-nodes.js'; Marker = '/* ================= УЗЛЫ КАРТЫ ================= */' },
    @{ Path = 'js/10-data/50-meta-progression.js'; Marker = '/* ================= МЕТА-ПРОГРЕССИЯ ================= */' },
    @{ Path = 'js/20-world/00-hazards.js'; Marker = '/* ================= ФИШКИ ЗАЛОВ ================= */' },
    @{ Path = 'js/20-world/10-state.js'; Marker = '/* ================= СОСТОЯНИЕ ================= */' },
    @{ Path = 'js/20-world/20-audio.js'; Marker = '/* ================= ЗВУК ================= */' },
    @{ Path = 'js/20-world/30-effects.js'; Marker = '/* ================= ЭФФЕКТЫ ================= */' },
    @{ Path = 'js/20-world/40-rooms.js'; Marker = '/* ================= КОМНАТЫ ================= */' },
    @{ Path = 'js/20-world/50-mobs.js'; Marker = '/* ================= МОБЫ ================= */' },
    @{ Path = 'js/30-combat/00-pickups.js'; Marker = '/* ================= ХИЛКИ ================= */' },
    @{ Path = 'js/30-combat/10-damage.js'; Marker = '/* ================= УРОН ================= */' },
    @{ Path = 'js/30-combat/20-player-attacks.js'; Marker = '/* ================= АТАКИ ИГРОКА ================= */' },
    @{ Path = 'js/30-combat/30-projectiles.js'; Marker = '/* ================= СНАРЯДЫ ================= */' },
    @{ Path = 'js/40-evolutions/00-evolutions.js'; Marker = '/* ================= ПРОБУЖДЕНИЕ ОРУЖИЯ (ЭВОЛЮЦИИ) ================= */' },
    @{ Path = 'js/40-evolutions/10-icons.js'; Marker = '/* ================= НОВОЕ: РИСОВАННЫЕ ИКОНКИ ПРОБУЖДЁННОГО ОРУЖИЯ ================= */' },
    @{ Path = 'js/50-runtime/00-update.js'; Marker = '/* ================= ОБНОВЛЕНИЕ ================= */' },
    @{ Path = 'js/60-render/00-world.js'; Marker = '/* ================= РИСОВАНИЕ ================= */' },
    @{ Path = 'js/60-render/10-act2-bosses.js'; Marker = '/* ================= АКТ II · ДЕТАЛИЗИРОВАННЫЕ МОДЕЛИ БОССОВ =================' },
    @{ Path = 'js/70-ui/00-hud.js'; Marker = '/* ================= HUD ================= */' },
    @{ Path = 'js/70-ui/10-menu.js'; Marker = '/* ================= МЕНЮ ================= */' },
    @{ Path = 'js/80-run/00-rewards.js'; Marker = '/* ================= НАГРАДЫ ================= */' },
    @{ Path = 'js/80-run/10-map.js'; Marker = '/* ================= КАРТА ПОХОДА ================= */' },
    @{ Path = 'js/80-run/20-events.js'; Marker = '/* ================= КОМНАТЫ-СОБЫТИЯ ================= */' },
    @{ Path = 'js/80-run/30-room-transition.js'; Marker = '/* ================= ПЕРЕХОД В ЗАЛ ================= */' },
    @{ Path = 'js/80-run/40-screens.js'; Marker = '/* ================= ЭКРАНЫ ================= */' },
    @{ Path = 'js/90-input/00-keyboard.js'; Marker = '/* ================= ВВОД ================= */' },
    @{ Path = 'js/90-input/10-touch.js'; Marker = '/* ================= СЕНСОРНОЕ УПРАВЛЕНИЕ (ТЕЛЕФОН/ПЛАНШЕТ) ================= */' },
    @{ Path = 'js/99-main/00-loop.js'; Marker = '/* ================= ЦИКЛ ================= */' }
)

Write-Fragments $style.Text $styleParts
Write-Fragments $scriptText $scriptParts

Write-Output "Extracted source from $InputFile into $sourceRoot"
