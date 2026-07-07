#!/bin/bash


# Batch file for invoking java application.
# Usage:
#    run.bash <arguments>

Name="DTS"
Args=""

# -----------------------------------------

JavaRunTime="java"
ClassDir="Class"

$JavaRunTime -cp $ClassDir $Name $Args

read -p "Press Enter to continue..."
