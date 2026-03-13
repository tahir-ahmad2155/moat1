
Add-Type -AssemblyName System.Drawing

$imagePath = "c:\Users\HP\OneDrive\Desktop\msuite\assets\MOAT Logo.png"
if (!(Test-Path $imagePath)) {
    Write-Host "Image not found"
    exit
}

$bitmap = [System.Drawing.Bitmap]::FromFile($imagePath)
$width = $bitmap.Width
$height = $bitmap.Height
$pixels = @{}

# Sample every 10th pixel to be faster
for ($x = 0; $x -lt $width; $x += 10) {
    for ($y = 0; $y -lt $height; $y += 10) {
        $color = $bitmap.GetPixel($x, $y)
        if ($color.A -ne 0) { # Ignore transparent pixels
            $hex = "#{0:X2}{1:X2}{2:X2}" -f $color.R, $color.G, $color.B
            if ($pixels.ContainsKey($hex)) {
                $pixels[$hex]++
            } else {
                $pixels[$hex] = 1
            }
        }
    }
}

$bitmap.Dispose()

# Sort by frequency descending
$mostFrequent = $pixels.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5
$mostFrequent
