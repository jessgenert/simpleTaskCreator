# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
$newpath = $env:APPDATA + '\npm;'
$env:PATH += $newpath
[environment]::setEnvironmentVariable('PATH',$env:PATH,'User')
echo $env:PATH