Add-Type -AssemblyName System.Drawing

$src = 'c:\Users\HP\OneDrive\Desktop\msuite\assets\americancard.png'
$dst = 'c:\Users\HP\OneDrive\Desktop\msuite\assets\americancard_nobg.png'

$bmp = New-Object System.Drawing.Bitmap($src)
$bmp2 = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$g = [System.Drawing.Graphics]::FromImage($bmp2)
$g.DrawImage($bmp, 0, 0)
$g.Dispose()

# Replace near-white pixels with transparent
for ($x = 0; $x -lt $bmp2.Width; $x++) {
    for ($y = 0; $y -lt $bmp2.Height; $y++) {
        $c = $bmp2.GetPixel($x, $y)
        if ($c.R -gt 220 -and $c.G -gt 220 -and $c.B -gt 220) {
            $bmp2.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}

$bmp2.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$bmp2.Dispose()

Write-Host "Done! Saved to $dst"
