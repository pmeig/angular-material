@echo off

SETLOCAL EnableDelayedExpansion
set tgz=
:loop
  call npm run build -- %1
  cd dist\%1
  call npm pack
  for /f %%i in ('dir /A:-D /B /S *.tgz') do set tgz=%tgz% %%i
  cd ..\..
  shift
  if not "%1" == "" goto loop
npm i !tgz!
ENDLOCAL
