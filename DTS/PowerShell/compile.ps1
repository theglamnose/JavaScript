#!/usr/bin/env pwsh
 
$Name = "DTS"

# -----------------------------------------

$JavaExt = ".java"
$JavaCompiler = "javac"
$CompileOptions = "-Xlint:unchecked"
$ClassDir = "Class"
$ClassExt = ".class"

# Löschen der Class-Dateien
Remove-Item "$ClassDir/*$ClassExt" -ErrorAction SilentlyContinue

Write-Host "Compiling $Name ..."
& $JavaCompiler $CompileOptions -d $ClassDir "$Name$JavaExt"
Write-Host "Done."

Read-Host "Press Enter to continue..."
