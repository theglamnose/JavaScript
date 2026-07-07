
echo off

set Name=DTS

rem -----------------------------------------

set JavaExt=.java
set JavaCompiler=javac
set CompileOptions=-Xlint:unchecked
set ClassDir=Class
set ClassExt=.class

del %ClassDir%\*%ClassExt%

echo Compiling %Name% ...
%JavaCompiler% %CompileOptions% -d %ClassDir% %Name%%JavaExt%
echo Done.

pause