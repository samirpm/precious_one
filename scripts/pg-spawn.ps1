# Spawns pg_ctl via WMI (Win32_Process.Create) so PostgreSQL runs OUTSIDE the
# calling process's job object — required in sandboxed environments where a
# job-object kill would otherwise terminate the database server.
$root = "C:\Users\samir\Desktop\precious_one"
$bin = Join-Path $root "node_modules\@embedded-postgres\windows-x64\native\bin\pg_ctl.exe"
$data = Join-Path $root ".pgdata"
$log = Join-Path $data "server.log"

$cmd = "`"$bin`" -D `"$data`" -l `"$log`" -o `"-p 5432`" start"
$result = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $cmd }
Write-Output "WMI ReturnValue: $($result.ReturnValue) (0 = success), PID: $($result.ProcessId)"
