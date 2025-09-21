@echo off

if exist ngp-material*.tgz del ngp-material*.tgz
SETLOCAL EnableDelayedExpansion
:loop
  call npm run build -- %1
  if exist dist\%1 (
    cd dist\%1
    call npm pack
    for /f %%i in ('dir /A:-D /B /S *.tgz') do set tgz=%%i
    cd ..\..
    call npm i !tgz!
  )
  shift
  if not "%1" == "" goto loop
ENDLOCAL
