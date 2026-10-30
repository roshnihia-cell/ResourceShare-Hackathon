# Run from the extracted ResourceShare-Hackathon folder.
# No credentials are stored. No force pushes, deletions or default-branch changes.
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$repository = 'https://github.com/roshnihia-cell/ResourceShare-Hackathon.git'
$branch = 'resourceshare-updated-hackathon'
$source = $PSScriptRoot
$destination = Join-Path (Split-Path $source -Parent) ('ResourceShare-Submission-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
function Run-Git {
    & git @args
    if ($LASTEXITCODE -ne 0) { throw "Git failed. Nothing will be force-pushed. Read the error above." }
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Install Git for Windows, then reopen PowerShell and try again.' }
if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) { throw 'Install Node.js 22 or newer, then reopen PowerShell and try again.' }
if (-not (Test-Path (Join-Path $source 'src/App.jsx'))) { throw 'Extract the complete ZIP first. Keep this script beside package.json.' }
if (Test-Path $destination) { throw 'Destination exists. Wait one second and run again; it will use a new folder.' }
Write-Host 'STEP 1: Cloning the existing repository into a NEW folder.'
Write-Host 'If GitHub asks you to sign in, use Sanjana1513 (the collaborator account).'
Run-Git clone $repository $destination
Push-Location $destination
try {
    $remoteBranch = & git ls-remote --heads origin "refs/heads/$branch"
    if ($LASTEXITCODE -ne 0) { throw 'Could not check the remote branch. Check your GitHub sign-in.' }
    if ($remoteBranch) { throw "Branch $branch already exists. STOP: ask for help to inspect it. It has not been overwritten." }
    Write-Host "STEP 2: Creating $branch from the current repository default branch."
    Run-Git switch -c $branch
    # An explicit allowlist: never copy .git, node_modules, dist or private .env files.
    $items = @('.gitignore', '.openai', 'README.md', 'TEST_CHECKLIST.md', 'UPLOAD_WINDOWS.md', 'Upload-ToGitHub.ps1', 'index.html', 'netlify.toml', 'package.json', 'package-lock.json', 'src', 'tests', 'vercel.json', 'vite.config.js')
    Write-Host 'STEP 3: Copying the reviewed project files. Other repository files stay in place.'
    foreach ($item in $items) {
        $from = Join-Path $source $item
        if (-not (Test-Path $from)) { throw "Required file or folder missing: $item" }
        if ((Get-Item -Force $from).PSIsContainer) {
            $to = Join-Path $destination $item
            if (Test-Path $to -PathType Leaf) { throw "A file conflicts with folder $item. Stopping for manual review." }
            New-Item -ItemType Directory -Force -Path $to | Out-Null
            Get-ChildItem -LiteralPath $from -Force | ForEach-Object {
                Copy-Item -LiteralPath $_.FullName -Destination $to -Recurse -Force
            }
        } else {
            Copy-Item -LiteralPath $from -Destination (Join-Path $destination $item) -Force
        }
    }
    Write-Host 'STEP 4: Installing dependencies and checking the project.'
    & npm.cmd ci --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed. Nothing has been pushed.' }
    & npm.cmd test
    if ($LASTEXITCODE -ne 0) { throw 'Tests failed. Nothing has been pushed.' }
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Build failed. Nothing has been pushed.' }
    # Stage only individual files from the supplied package, not unrelated cloned content.
    $files = foreach ($item in $items) {
        $entry = Get-Item -LiteralPath (Join-Path $source $item) -Force
        if ($entry.PSIsContainer) {
            Get-ChildItem -LiteralPath $entry.FullName -File -Recurse -Force | ForEach-Object {
                $_.FullName.Substring($source.Length + 1).Replace('\', '/')
            }
        } else { $item }
    }
    foreach ($file in $files) { Run-Git add -- $file }
    Run-Git diff --cached --stat
    Run-Git status --short
    $changes = & git diff --cached --name-only
    if ($LASTEXITCODE -ne 0) { throw 'Could not inspect staged files.' }
    if (-not $changes) { throw 'No changed files to submit. Inspect the existing repository before continuing.' }
    $commitName = & git config user.name
    if (-not $commitName) {
        $commitName = Read-Host 'Name for your commit (for example Sanjana M)'
        if (-not $commitName.Trim()) { throw 'Commit name is required.' }
        Run-Git config --local user.name $commitName
    }
    $commitEmail = & git config user.email
    if (-not $commitEmail) {
        $commitEmail = Read-Host 'Git commit email (copy your private noreply email from GitHub Settings > Emails if preferred)'
        if (-not $commitEmail.Trim()) { throw 'Commit email is required.' }
        Run-Git config --local user.email $commitEmail
    }
    Run-Git commit -m 'Prepare ResourceShare hackathon demo and deployment'
    Write-Host "STEP 5: Ready to upload ONLY the new branch: $branch"
    Write-Host 'The default branch stays unchanged. Check the file list above.'
    $approval = Read-Host 'Type UPLOAD to push this branch, or anything else to stop'
    if ($approval -cne 'UPLOAD') {
        Write-Host "Stopped safely. The local commit is saved in $destination"
        return
    }
    # A second check avoids updating a branch created while tests were running.
    $remoteBranch = & git ls-remote --heads origin "refs/heads/$branch"
    if ($LASTEXITCODE -ne 0) { throw 'Remote check failed. Nothing has been pushed.' }
    if ($remoteBranch) { throw 'The branch now exists remotely. Stopping without overwriting it.' }
    Run-Git push -u origin "HEAD:refs/heads/$branch"
    Write-Host 'STEP 6: Confirming the remote commit.'
    $localCommit = (& git rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Could not read the local commit.' }
    $remoteResult = & git ls-remote --heads origin "refs/heads/$branch"
    if ($LASTEXITCODE -ne 0 -or -not $remoteResult) { throw 'Upload could not be verified. Check GitHub before retrying.' }
    $remoteCommit = ($remoteResult -split '\s+')[0]
    if ($remoteCommit -ne $localCommit) { throw 'Remote commit differs. Check GitHub before retrying.' }
    Write-Host 'VERIFIED: Your commit exists on the separate GitHub branch.'
    Write-Host 'https://github.com/roshnihia-cell/ResourceShare-Hackathon/tree/resourceshare-updated-hackathon'
    Write-Host 'Live demo: https://resourceshare-sanjana-hackathon.electhill.chatgpt.site/'
    Write-Host "Local checkout: $destination"
} finally {
    Pop-Location
}
