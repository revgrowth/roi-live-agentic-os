param(
    [ValidateSet("success", "info", "warning", "error")]
    [string]$Variant = "info",
    [string]$Title = "Agentic OS",
    [string]$Subtitle = "",
    [string]$Message = "",
    [string]$Attribution = "Agentic OS",
    [ValidateSet("short", "long")]
    [string]$Duration = "short"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Invoke-InWindowsPowerShell {
    if ($PSVersionTable.PSEdition -eq "Desktop" -and $PSVersionTable.PSVersion.Major -le 5) {
        return
    }

    $powershellExe = Join-Path $env:WINDIR "System32\WindowsPowerShell\v1.0\powershell.exe"
    if (-not (Test-Path $powershellExe)) {
        throw "Windows PowerShell 5.1 was not found at $powershellExe"
    }

    $forwardArgs = @(
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", $PSCommandPath,
        "-Variant", $Variant,
        "-Title", $Title,
        "-Subtitle", $Subtitle,
        "-Message", $Message,
        "-Attribution", $Attribution,
        "-Duration", $Duration
    )

    $output = & $powershellExe @forwardArgs 2>&1
    $exitCode = $LASTEXITCODE
    if ($output) {
        $output | ForEach-Object { Write-Output $_ }
    }
    exit $exitCode
}

Invoke-InWindowsPowerShell

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

$projectDir = Split-Path -Parent $PSScriptRoot
$assetVersion = "v1"
$assetRoot = Join-Path $env:LOCALAPPDATA "AgenticOS\notifications\$assetVersion"
$shortcutPath = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Agentic OS Notifications.lnk"
$appId = "AgenticOS.Notifications"
$appDisplayName = "Agentic OS"
$powershellExe = Join-Path $env:WINDIR "System32\WindowsPowerShell\v1.0\powershell.exe"

$variantConfig = @{
    success = @{
        StartColor  = "#0F4D38"
        EndColor    = "#0AA36C"
        AccentColor = "#DCFCE7"
        ChipColor   = "#064E3B"
        Sound       = "ms-winsoundevent:Notification.Default"
        HeroLabel   = "TASK COMPLETE"
    }
    info = @{
        StartColor  = "#102C63"
        EndColor    = "#2F6BFF"
        AccentColor = "#DBEAFE"
        ChipColor   = "#172554"
        Sound       = "ms-winsoundevent:Notification.IM"
        HeroLabel   = "STAY IN FLOW"
    }
    warning = @{
        StartColor  = "#6B3B06"
        EndColor    = "#F59E0B"
        AccentColor = "#FEF3C7"
        ChipColor   = "#78350F"
        Sound       = "ms-winsoundevent:Notification.Reminder"
        HeroLabel   = "ACTION NEEDED"
    }
    error = @{
        StartColor  = "#63171B"
        EndColor    = "#E11D48"
        AccentColor = "#FFE4E6"
        ChipColor   = "#881337"
        Sound       = "ms-winsoundevent:Notification.Mail"
        HeroLabel   = "NEEDS ATTENTION"
    }
}

function ConvertTo-Color {
    param([Parameter(Mandatory = $true)][string]$Hex)

    return [System.Drawing.ColorTranslator]::FromHtml($Hex)
}

function ConvertTo-XmlText {
    param([AllowEmptyString()][string]$Text)

    if ($null -eq $Text) {
        return ""
    }

    return [System.Security.SecurityElement]::Escape($Text)
}

function New-RoundedRectPath {
    param(
        [Parameter(Mandatory = $true)][System.Drawing.RectangleF]$Rect,
        [Parameter(Mandatory = $true)][float]$Radius
    )

    $diameter = [Math]::Min($Radius * 2, [Math]::Min($Rect.Width, $Rect.Height))
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $arc = New-Object System.Drawing.RectangleF($Rect.X, $Rect.Y, $diameter, $diameter)

    $path.AddArc($arc, 180, 90)
    $arc.X = $Rect.Right - $diameter
    $path.AddArc($arc, 270, 90)
    $arc.Y = $Rect.Bottom - $diameter
    $path.AddArc($arc, 0, 90)
    $arc.X = $Rect.X
    $path.AddArc($arc, 90, 90)
    $path.CloseFigure()
    return $path
}

function New-NotificationLogo {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (Test-Path $Path) {
        return
    }

    $bitmap = New-Object System.Drawing.Bitmap 96, 96
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $backgroundRect = New-Object System.Drawing.Rectangle 0, 0, 96, 96
    $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $backgroundRect, (ConvertTo-Color "#0F172A"), (ConvertTo-Color "#1D4ED8"), 50
    $graphics.FillEllipse($backgroundBrush, 4, 4, 88, 88)

    $overlayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(52, 255, 255, 255))
    $graphics.FillEllipse($overlayBrush, 18, 14, 56, 34)

    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 255, 255, 255), 2.5)
    $graphics.DrawEllipse($borderPen, 4, 4, 88, 88)

    $font = New-Object System.Drawing.Font("Segoe UI Semibold", 28, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 248, 250, 252))
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $graphics.DrawString("AO", $font, $textBrush, (New-Object System.Drawing.RectangleF(0, 1, 96, 92)), $format)

    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)

    $format.Dispose()
    $textBrush.Dispose()
    $font.Dispose()
    $borderPen.Dispose()
    $overlayBrush.Dispose()
    $backgroundBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

function New-NotificationHero {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][hashtable]$Palette,
        [Parameter(Mandatory = $true)][string]$VariantName
    )

    if (Test-Path $Path) {
        return
    }

    $width = 364
    $height = 180
    $bitmap = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $heroRect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
    $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $heroRect, (ConvertTo-Color $Palette.StartColor), (ConvertTo-Color $Palette.EndColor), 20
    $graphics.FillRectangle($backgroundBrush, $heroRect)

    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(34, 255, 255, 255))
    $graphics.FillEllipse($glowBrush, $width - 180, -40, 220, 220)
    $graphics.FillEllipse($glowBrush, -70, 60, 170, 170)

    $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(28, 255, 255, 255), 2)
    for ($offset = -120; $offset -lt 420; $offset += 24) {
        $graphics.DrawLine($linePen, $offset, $height, $offset + 100, 0)
    }

    $chipRect = New-Object System.Drawing.RectangleF(22, 22, 122, 28)
    $chipPath = New-RoundedRectPath -Rect $chipRect -Radius 14
    $chipBrush = New-Object System.Drawing.SolidBrush((ConvertTo-Color $Palette.ChipColor))
    $graphics.FillPath($chipBrush, $chipPath)

    $chipFont = New-Object System.Drawing.Font("Segoe UI Semibold", 12, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $chipTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
    $chipFormat = New-Object System.Drawing.StringFormat
    $chipFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $chipFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
    $graphics.DrawString($Palette.HeroLabel, $chipFont, $chipTextBrush, $chipRect, $chipFormat)

    $headlineFont = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $headlineBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 248, 250, 252))
    $graphics.DrawString("Agentic OS", $headlineFont, $headlineBrush, 24, 64)

    $subFont = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(224, 248, 250, 252))
    $graphics.DrawString("Native desktop alerts that feel deliberate.", $subFont, $subBrush, 26, 102)

    $accentBrush = New-Object System.Drawing.SolidBrush((ConvertTo-Color $Palette.AccentColor))
    $graphics.FillEllipse($accentBrush, $width - 82, 24, 36, 36)
    $graphics.FillEllipse($accentBrush, $width - 48, 42, 12, 12)

    $variantFont = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.DrawString($VariantName.ToUpperInvariant(), $variantFont, $accentBrush, 26, 130)

    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)

    $variantFont.Dispose()
    $accentBrush.Dispose()
    $subBrush.Dispose()
    $subFont.Dispose()
    $headlineBrush.Dispose()
    $headlineFont.Dispose()
    $chipFormat.Dispose()
    $chipTextBrush.Dispose()
    $chipFont.Dispose()
    $chipBrush.Dispose()
    $chipPath.Dispose()
    $linePen.Dispose()
    $glowBrush.Dispose()
    $backgroundBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

function Ensure-NotificationAssets {
    New-Item -ItemType Directory -Force -Path $assetRoot | Out-Null

    $logoPath = Join-Path $assetRoot "agentic-os-logo.png"
    New-NotificationLogo -Path $logoPath

    foreach ($name in $variantConfig.Keys) {
        $heroPath = Join-Path $assetRoot "hero-$name.png"
        New-NotificationHero -Path $heroPath -Palette $variantConfig[$name] -VariantName $name
    }

    return @{
        LogoPath = $logoPath
        HeroPath = Join-Path $assetRoot "hero-$Variant.png"
    }
}

function Ensure-ShortcutInterop {
    if ("DesktopToastShortcut" -as [type]) {
        return
    }

    Add-Type -Language CSharp @"
using System;
using System.Runtime.InteropServices;
using System.Text;

[ComImport]
[Guid("00021401-0000-0000-C000-000000000046")]
internal class CShellLink
{
}

[ComImport]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
[Guid("000214F9-0000-0000-C000-000000000046")]
internal interface IShellLinkW
{
    void GetPath([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pszFile, int cchMaxPath, IntPtr pfd, int fFlags);
    void GetIDList(out IntPtr ppidl);
    void SetIDList(IntPtr pidl);
    void GetDescription([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pszName, int cchMaxName);
    void SetDescription([MarshalAs(UnmanagedType.LPWStr)] string pszName);
    void GetWorkingDirectory([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pszDir, int cchMaxPath);
    void SetWorkingDirectory([MarshalAs(UnmanagedType.LPWStr)] string pszDir);
    void GetArguments([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pszArgs, int cchMaxPath);
    void SetArguments([MarshalAs(UnmanagedType.LPWStr)] string pszArgs);
    void GetHotkey(out short pwHotkey);
    void SetHotkey(short wHotkey);
    void GetShowCmd(out int piShowCmd);
    void SetShowCmd(int iShowCmd);
    void GetIconLocation([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pszIconPath, int cchIconPath, out int iIcon);
    void SetIconLocation([MarshalAs(UnmanagedType.LPWStr)] string pszIconPath, int iIcon);
    void SetRelativePath([MarshalAs(UnmanagedType.LPWStr)] string pszPathRel, int dwReserved);
    void Resolve(IntPtr hwnd, int fFlags);
    void SetPath([MarshalAs(UnmanagedType.LPWStr)] string pszFile);
}

[ComImport]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
[Guid("0000010b-0000-0000-C000-000000000046")]
internal interface IPersistFile
{
    void GetClassID(out Guid pClassID);
    void IsDirty();
    void Load([MarshalAs(UnmanagedType.LPWStr)] string pszFileName, uint dwMode);
    void Save([MarshalAs(UnmanagedType.LPWStr)] string pszFileName, bool fRemember);
    void SaveCompleted([MarshalAs(UnmanagedType.LPWStr)] string pszFileName);
    void GetCurFile([MarshalAs(UnmanagedType.LPWStr)] out string ppszFileName);
}

[ComImport]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
[Guid("886D8EEB-8CF2-4446-8D02-CDBA1DBDCF99")]
internal interface IPropertyStore
{
    void GetCount(out uint cProps);
    void GetAt(uint iProp, out PROPERTYKEY pkey);
    void GetValue(ref PROPERTYKEY key, out PROPVARIANT pv);
    void SetValue(ref PROPERTYKEY key, ref PROPVARIANT pv);
    void Commit();
}

[StructLayout(LayoutKind.Sequential, Pack = 4)]
internal struct PROPERTYKEY
{
    public Guid fmtid;
    public uint pid;

    public PROPERTYKEY(Guid format, uint propertyId)
    {
        fmtid = format;
        pid = propertyId;
    }
}

[StructLayout(LayoutKind.Explicit)]
internal struct PROPVARIANT
{
    [FieldOffset(0)]
    public ushort vt;

    [FieldOffset(8)]
    public IntPtr pointerValue;

    public PROPVARIANT(string value)
    {
        pointerValue = Marshal.StringToCoTaskMemUni(value);
        vt = 31;
    }
}

public static class DesktopToastShortcut
{
    private static readonly PROPERTYKEY AppIdKey = new PROPERTYKEY(new Guid("9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3"), 5);

    [DllImport("Ole32.dll")]
    private static extern int PropVariantClear(ref PROPVARIANT pvar);

    public static void EnsureShortcut(string shortcutPath, string targetPath, string arguments, string workingDirectory, string description, string appId, string iconPath)
    {
        var link = (IShellLinkW)new CShellLink();
        var key = AppIdKey;
        link.SetPath(targetPath);

        if (!string.IsNullOrEmpty(arguments))
        {
            link.SetArguments(arguments);
        }

        if (!string.IsNullOrEmpty(workingDirectory))
        {
            link.SetWorkingDirectory(workingDirectory);
        }

        if (!string.IsNullOrEmpty(description))
        {
            link.SetDescription(description);
        }

        if (!string.IsNullOrEmpty(iconPath))
        {
            link.SetIconLocation(iconPath, 0);
        }

        var propertyStore = (IPropertyStore)link;
        var appIdVariant = new PROPVARIANT(appId);

        try
        {
            propertyStore.SetValue(ref key, ref appIdVariant);
            propertyStore.Commit();
        }
        finally
        {
            PropVariantClear(ref appIdVariant);
        }

        ((IPersistFile)link).Save(shortcutPath, true);
    }
}
"@
}

function Ensure-StartMenuShortcut {
    param([Parameter(Mandatory = $true)][string]$ShortcutPath)

    Ensure-ShortcutInterop
    $shortcutDir = Split-Path -Parent $ShortcutPath
    New-Item -ItemType Directory -Force -Path $shortcutDir | Out-Null

    [DesktopToastShortcut]::EnsureShortcut(
        $ShortcutPath,
        $powershellExe,
        "-NoProfile",
        $projectDir,
        "Agentic OS desktop notifications",
        $appId,
        $powershellExe
    )
}

function Show-BalloonFallback {
    param(
        [Parameter(Mandatory = $true)][string]$FallbackTitle,
        [Parameter(Mandatory = $true)][string]$FallbackMessage
    )

    $notifyIcon = New-Object System.Windows.Forms.NotifyIcon
    try {
        $notifyIcon.Icon = [System.Drawing.SystemIcons]::Information
        $notifyIcon.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info
        $notifyIcon.BalloonTipTitle = $FallbackTitle
        $notifyIcon.BalloonTipText = $FallbackMessage
        $notifyIcon.Visible = $true
        $notifyIcon.ShowBalloonTip(5000)
        Start-Sleep -Milliseconds 1200
    } finally {
        $notifyIcon.Dispose()
    }
}

function Show-Toast {
    param(
        [Parameter(Mandatory = $true)][string]$ToastTitle,
        [Parameter(Mandatory = $true)][string]$ToastSubtitle,
        [Parameter(Mandatory = $true)][string]$ToastMessage,
        [Parameter(Mandatory = $true)][string]$HeroPath,
        [Parameter(Mandatory = $true)][string]$LogoPath
    )

    $escapedTitle = ConvertTo-XmlText $ToastTitle
    $escapedSubtitle = ConvertTo-XmlText $ToastSubtitle
    $escapedMessage = ConvertTo-XmlText $ToastMessage
    $escapedAttribution = ConvertTo-XmlText $Attribution
    $escapedHero = ConvertTo-XmlText $HeroPath
    $escapedLogo = ConvertTo-XmlText $LogoPath
    $sound = ConvertTo-XmlText $variantConfig[$Variant].Sound

    $xmlContent = @"
<toast duration="$Duration">
  <visual>
    <binding template="ToastGeneric">
      <image placement="hero" src="$escapedHero" />
      <image placement="appLogoOverride" hint-crop="circle" src="$escapedLogo" />
      <text>$escapedTitle</text>
      <text>$escapedSubtitle</text>
      <text>$escapedMessage</text>
      <text placement="attribution">$escapedAttribution</text>
    </binding>
  </visual>
  <audio src="$sound" />
</toast>
"@

    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
    [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom, ContentType = WindowsRuntime] | Out-Null

    $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
    $xml.LoadXml($xmlContent)

    $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show($toast)
}

$result = [ordered]@{
    ok            = $false
    delivery      = "none"
    variant       = $Variant
    app_id        = $appId
    title         = $Title
    subtitle      = $Subtitle
    duration      = $Duration
    shortcut_path = $shortcutPath
}

try {
    $assets = Ensure-NotificationAssets
    Ensure-StartMenuShortcut -ShortcutPath $shortcutPath
    Show-Toast -ToastTitle $Title -ToastSubtitle $Subtitle -ToastMessage $Message -HeroPath $assets.HeroPath -LogoPath $assets.LogoPath

    $result.ok = $true
    $result.delivery = "toast"
    $result.logo_path = $assets.LogoPath
    $result.hero_path = $assets.HeroPath
}
catch {
    $toastError = $_.Exception.Message
    $result.toast_error = $toastError

    try {
        Show-BalloonFallback -FallbackTitle "$Title - $Subtitle" -FallbackMessage $Message
        $result.ok = $true
        $result.delivery = "balloon"
    }
    catch {
        $result.fallback_error = $_.Exception.Message
    }
}

$result | ConvertTo-Json -Compress

if (-not $result.ok) {
    exit 1
}
