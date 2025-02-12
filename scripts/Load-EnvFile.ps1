function Load-EnvFile {
    param(
        [string]$envPath = ".env"
    )

    if (Test-Path $envPath) {
        $content = Get-Content $envPath

        # First pass: Load all variables into a hashtable
        $envVars = @{}
        foreach ($line in $content) {
            if ($line.Trim() -and !$line.StartsWith("#")) {
                $key, $value = $line.Split('=', 2)
                if ($key -and $value) {
                    $key = $key.Trim()
                    $value = $value.Trim()
                    # Remove surrounding quotes if they exist
                    $value = $value -replace '^["'']|["'']$'
                    $envVars[$key] = $value
                }
            }
        }

        # Second pass: Resolve variables and set environment variables
        foreach ($key in $envVars.Keys) {
            $value = $envVars[$key]

            # Resolve variables in the value
            $resolvedValue = $value
            foreach ($envKey in $envVars.Keys) {
                $resolvedValue = $resolvedValue -replace "\$\{$envKey\}", $envVars[$envKey]
            }

            # Set the environment variable
            [Environment]::SetEnvironmentVariable($key, $resolvedValue, 'Process')
            Write-Host "Loaded $key"
        }
    }
    else {
        Write-Warning "Environment file not found at: $envPath"
    }
}
