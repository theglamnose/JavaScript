#!/bin/bash

Name="DTS" 

# -----------------------------------------

JavaExt=".java"
JavaCompiler="javac"
CompileOptions="-Xlint:unchecked"
ClassDir="Class"
ClassExt=".class"

rm -f "$ClassDir"/*"$ClassExt"

echo "Compiling $Name ..."
$JavaCompiler $CompileOptions -d "$ClassDir" "$Name$JavaExt"
echo "Done."

read -p "Press Enter to continue..."
