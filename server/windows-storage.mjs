import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const verifyAcl = Buffer.from(String.raw`
$ErrorActionPreference = 'Stop'
$directory = Get-Item -LiteralPath $env:MATALENS_ACL_DIRECTORY -Force
$current = [Security.Principal.WindowsIdentity]::GetCurrent().User
$trusted = @($current.Value, 'S-1-5-18', 'S-1-5-32-544')

function Assert-SafeItem($item) {
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    throw 'Reparse points are unsupported for private report storage.'
  }
}

function Assert-PrivateAcl($acl) {
  $rules = $acl.GetAccessRules($true, $true, [Security.Principal.SecurityIdentifier])
  $owner = $acl.GetOwner([Security.Principal.SecurityIdentifier]).Value
  if ($trusted -notcontains $owner -or $rules.Count -eq 0) {
    throw 'The storage owner or ACL cannot be verified.'
  }
  foreach ($rule in $rules) {
    if ($rule.AccessControlType -eq [Security.AccessControl.AccessControlType]::Allow -and $trusted -notcontains $rule.IdentityReference.Value) {
      throw 'The ACL grants access to another principal.'
    }
  }
}

Assert-SafeItem $directory
if ($env:MATALENS_ACL_NEW -eq '1') {
  $acl = [Security.AccessControl.DirectorySecurity]::new()
  $acl.SetOwner($current)
  $acl.SetAccessRuleProtection($true, $false)
  $inheritance = [Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [Security.AccessControl.InheritanceFlags]::ObjectInherit
  foreach ($sid in $trusted) {
    $principal = [Security.Principal.SecurityIdentifier]::new($sid)
    $rule = [Security.AccessControl.FileSystemAccessRule]::new(
      $principal, [Security.AccessControl.FileSystemRights]::FullControl,
      $inheritance, [Security.AccessControl.PropagationFlags]::None,
      [Security.AccessControl.AccessControlType]::Allow
    )
    $acl.AddAccessRule($rule)
  }
  Set-Acl -LiteralPath $directory.FullName -AclObject $acl
}
$acl = Get-Acl -LiteralPath $directory.FullName
if (!$acl.AreAccessRulesProtected) {
  throw 'The private store must have its own protected ACL.'
}
Assert-PrivateAcl $acl
$inheritedByFiles = $acl.GetAccessRules($true, $false, [Security.Principal.SecurityIdentifier]) | Where-Object {
  $_.IdentityReference.Value -eq $current.Value -and
    $_.AccessControlType -eq [Security.AccessControl.AccessControlType]::Allow -and
    ($_.InheritanceFlags -band [Security.AccessControl.InheritanceFlags]::ObjectInherit)
}
if (!$inheritedByFiles) {
  throw 'New SQLite files must inherit the service identity ACL.'
}

$databaseNames = @('cases.sqlite', 'cases.sqlite-wal', 'cases.sqlite-shm', 'cases.sqlite-journal')
foreach ($item in Get-ChildItem -LiteralPath $directory.FullName -Force) {
  if ($databaseNames -contains $item.Name) {
    Assert-SafeItem $item
    if ($item.PSIsContainer) { throw 'The report database must be a regular file.' }
    Assert-PrivateAcl (Get-Acl -LiteralPath $item.FullName)
  }
}
`, 'utf16le').toString('base64')

export function protectWindowsStore(directory, created) {
  try {
    const powershell = join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
    execFileSync(powershell, ['-NoProfile', '-NonInteractive', '-EncodedCommand', verifyAcl], {
      env: { ...process.env, MATALENS_ACL_DIRECTORY: directory, MATALENS_ACL_NEW: created ? '1' : '0' },
      stdio: 'pipe', timeout: 15_000, windowsHide: true,
    })
  } catch {
    throw new Error('Cannot verify private Windows storage. Choose a new MATALENS_DATA_DIR under a service-owned NTFS directory, or have an administrator verify the existing ACL.')
  }
}
