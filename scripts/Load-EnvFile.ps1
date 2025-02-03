function Load-EnvFile {
    param(
        [string]$envPath = ".env"
    )

    if (Test-Path $envPath) {
        $content = Get-Content $envPath

        foreach ($line in $content) {
            if ($line.Trim() -and !$line.StartsWith("#")) {
                $key, $value = $line.Split('=', 2)
                if ($key -and $value) {
                    $key = $key.Trim()
                    $value = $value.Trim()
                    # Remove surrounding quotes if they exist
                    $value = $value -replace '^["'']|["'']$'

                    # Set the environment variable
                    [Environment]::SetEnvironmentVariable($key, $value, 'Process')
                    Write-Host "Loaded $key"
                }
            }
        }
    } else {
        Write-Warning "Environment file not found at: $envPath"
    }
}
