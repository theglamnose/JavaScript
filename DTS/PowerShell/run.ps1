#!/usr/bin/env pwsh

# -----------------------------------------

# Batch file for invoking java application.
# Usage:
#    pwsh run.ps1 <arguments>

$Name = "DTS"
$Args = ""

# -----------------------------------------

$JavaRunTime = "java"
$ClassDir = "Class"

& $JavaRunTime -cp $ClassDir $Name $Args

Read-Host "Press Enter to continue..."
