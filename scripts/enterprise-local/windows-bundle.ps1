# Source-only D5 planner. No registration, copying, PATH/registry changes or deletion.
[CmdletBinding()]
param(
  [Parameter(Mandatory)][ValidateSet('Install','Verify','Uninstall','Rollback')][string]$Action,
  [Parameter(Mandatory)][string]$BundleRoot,
  [Parameter(Mandatory)][string]$TargetRoot
)
$ErrorActionPreference = 'Stop'
foreach ($candidate in @($BundleRoot, $TargetRoot)) {
  if (-not [IO.Path]::IsPathFullyQualified($candidate)) { throw 'Absolute explicit paths required' }
}
[ordered]@{
  action = $Action
  source = [IO.Path]::GetFullPath($BundleRoot)
  target = [IO.Path]::GetFullPath($TargetRoot)
  dryRun = $true
  status = 'BLOCKED'
  reason = 'D5_IDENTITY_REGISTRATION_POLICY_PENDING'
  plannedChecks = @('exact artifact hashes/runtime inputs', 'private host registration ownership', 'upstream coexistence', 'owned rollback journal')
  mutations = @()
} | ConvertTo-Json -Depth 3
exit 1
