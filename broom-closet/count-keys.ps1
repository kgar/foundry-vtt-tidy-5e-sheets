# Count the number of times a particular key from en.json 
# has been used in the file system, ignoring note_modules and JSON files.
# Use the resulting output to remove truly 0-reference localization keys.

function ConvertTo-FlatJson {
    param (
        [Parameter(Mandatory)]
        [object]$JsonObject,   # <-- loosened type

        [string]$Prefix = ""
    )

    $flat = @{}

    foreach ($prop in $JsonObject.PSObject.Properties) {
        $key = if ($Prefix) { "$Prefix.$($prop.Name)" } else { $prop.Name }

        if ($prop.Value -is [PSCustomObject] -or $prop.Value -is [System.Collections.IDictionary]) {
            # recurse into nested object
            $nested = ConvertTo-FlatJson -JsonObject $prop.Value -Prefix $key
            foreach ($n in $nested.GetEnumerator()) {
                $flat[$n.Key] = $n.Value
            }
        }
        else {
            $flat[$key] = $prop.Value
        }
    }

    return $flat
}

$lang = Get-Content -Raw -Path "..\public\lang\en.json" | ConvertFrom-Json
$json = ConvertTo-FlatJson -JsonObject $lang

# Load JSON keys
$keys = $json.Keys

# Initialize results
$results = @{}
foreach ($key in $keys) { $results[$key] = 0 }

# Define which file extensions to scan
$extensions = @(".ts", ".svelte")  # adjust as needed

# Recursively scan, skipping .json files and node_modules folder
Get-ChildItem -Path .. -Recurse -File |
Where-Object { 
    $extensions -contains $_.Extension -and 
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\broom-closet\\' -and
    $_.FullName -notmatch '\\dist\\' -and
    $_.FullName -notmatch '\\.git\\'
} |
ForEach-Object {
    try {
        $content = Get-Content -Raw $_.FullName -ErrorAction Stop
        if (![string]::IsNullOrEmpty($content)) {
            foreach ($key in $keys) {
                $count = ([regex]::Matches($content, [regex]::Escape($key))).Count
                $results[$key] += $count
            }
        }
    }
    catch {
        Write-Warning "Skipped file: $($_.FullName) ($($_.Exception.Message))"
    }
}

# Ensure the ignore folder exists
$folder = ".\output"
if (-not (Test-Path $folder)) {
    New-Item -ItemType Directory -Path $folder | Out-Null
}

# Export results in the same table format you see in PowerShell
$results.GetEnumerator() |
Sort-Object Value -Descending |
Format-Table Name, Value | 
Out-File ".\output\KeyCounts.txt"

Write-Host "Export complete. Results saved to KeyCounts.txt"