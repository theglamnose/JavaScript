
echo off

rem Batch file for invoking java application with viewer.
rem Usage:
rem    run.bat <arguments>

set Name=DTS
set Args=

rem -----------------------------------------

set JavaRunTime=java
set ClassDir=Class

%JavaRunTime% -cp %ClassDir% %Name% %Args%

pause