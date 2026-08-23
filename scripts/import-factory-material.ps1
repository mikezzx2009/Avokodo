param(
  [Parameter(Mandatory = $true)]
  [string]$SourceRoot
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$publicRoot = Join-Path $projectRoot "public\factory-material"
$manifestPath = Join-Path $projectRoot "lib\catalog-data.json"
$imageExtensions = @(".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif")
$videoExtensions = @(".mp4", ".mov", ".webm", ".m4v")
$supportedExtensions = $imageExtensions + $videoExtensions

if (-not (Test-Path -LiteralPath $SourceRoot -PathType Container)) {
  throw "Source folder does not exist: $SourceRoot"
}

if (Test-Path -LiteralPath $publicRoot) {
  throw "Import destination already exists: $publicRoot"
}

function ConvertTo-Slug([string]$value) {
  $slug = $value.ToLowerInvariant() -replace "[^a-z0-9]+", "-"
  return $slug.Trim("-")
}

function ConvertTo-Title([string]$value) {
  if ($value -ieq "3D print") {
    return "3D Print"
  }

  return (Get-Culture).TextInfo.ToTitleCase($value.ToLowerInvariant())
}

$categories = @()

foreach ($categoryDirectory in Get-ChildItem -LiteralPath $SourceRoot -Directory | Sort-Object Name) {
  $categorySlug = ConvertTo-Slug $categoryDirectory.Name
  $categoryGroups = @()

  $mediaFiles = Get-ChildItem -LiteralPath $categoryDirectory.FullName -Recurse -File |
    Where-Object {
      $supportedExtensions -contains $_.Extension.ToLowerInvariant() -and
      -not $_.Name.StartsWith("._")
    }

  foreach ($directoryGroup in $mediaFiles | Group-Object DirectoryName | Sort-Object Name) {
    $relativeDirectory = [System.IO.Path]::GetRelativePath(
      $categoryDirectory.FullName,
      $directoryGroup.Name
    )
    $relativeParts = if ($relativeDirectory -eq ".") {
      @("gallery")
    } else {
      @($relativeDirectory -split "[\\/]")
    }
    $groupSlug = ($relativeParts | ForEach-Object { ConvertTo-Slug $_ }) -join "/"
    $groupTitle = if ($relativeDirectory -eq ".") {
      "Gallery"
    } else {
      ($relativeParts | ForEach-Object { ConvertTo-Title $_ }) -join " / "
    }
    $destinationDirectory = Join-Path $publicRoot "$categorySlug\$($groupSlug -replace '/', '\')"
    New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null

    $media = @()
    $sortedFiles = @($directoryGroup.Group | Sort-Object Name)
    for ($index = 0; $index -lt $sortedFiles.Count; $index += 1) {
      $sourceFile = $sortedFiles[$index]
      $extension = $sourceFile.Extension.ToLowerInvariant()
      $kind = if ($imageExtensions -contains $extension) { "image" } else { "video" }
      $fileName = "{0:D3}{1}" -f ($index + 1), $extension
      $destinationPath = Join-Path $destinationDirectory $fileName
      Copy-Item -LiteralPath $sourceFile.FullName -Destination $destinationPath

      $media += [ordered]@{
        kind = $kind
        src = "/factory-material/$categorySlug/$groupSlug/$fileName"
      }
    }

    $categoryGroups += [ordered]@{
      slug = $groupSlug
      title = $groupTitle
      imageCount = @($media | Where-Object { $_.kind -eq "image" }).Count
      videoCount = @($media | Where-Object { $_.kind -eq "video" }).Count
      media = $media
    }
  }

  $allCategoryMedia = @($categoryGroups | ForEach-Object { $_.media })
  $preferredCover = $categoryGroups |
    Where-Object { $_.slug -eq "product" -or $_.slug.StartsWith("product/") } |
    ForEach-Object { $_.media } |
    Where-Object { $_.kind -eq "image" } |
    Select-Object -First 1
  if (-not $preferredCover) {
    $preferredCover = $allCategoryMedia |
      Where-Object { $_.kind -eq "image" } |
      Select-Object -First 1
  }

  $categories += [ordered]@{
    slug = $categorySlug
    title = ConvertTo-Title $categoryDirectory.Name
    imageCount = @($allCategoryMedia | Where-Object { $_.kind -eq "image" }).Count
    videoCount = @($allCategoryMedia | Where-Object { $_.kind -eq "video" }).Count
    cover = $preferredCover.src
    groups = $categoryGroups
  }
}

$manifest = [ordered]@{
  generatedFrom = Split-Path -Leaf $SourceRoot
  categories = $categories
}

$manifest | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $manifestPath -Encoding utf8

[pscustomobject]@{
  Categories = $categories.Count
  Images = @($categories | ForEach-Object { $_.imageCount } | Measure-Object -Sum).Sum
  Videos = @($categories | ForEach-Object { $_.videoCount } | Measure-Object -Sum).Sum
  Manifest = $manifestPath
  Assets = $publicRoot
}
