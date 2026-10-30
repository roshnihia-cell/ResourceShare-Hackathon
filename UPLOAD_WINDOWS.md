# Upload ResourceShare from Windows

Target: https://github.com/roshnihia-cell/ResourceShare-Hackathon
Account: **Sanjana1513** (accepted collaborator access is required).
New branch: **resourceshare-updated-hackathon**.

The project is ready; GitHub upload has not been performed from ChatGPT because the GitHub app is unavailable in this session. The existing public demo remains https://resourceshare-sanjana-hackathon.electhill.chatgpt.site/ .

## Step 1 — Extract

Download `ResourceShare_Final_GitHub_Ready.zip`. Right-click it and choose **Extract All**. Open the extracted **ResourceShare-Hackathon** folder. You should see `package.json`, `README.md` and `Upload-ToGitHub.ps1`.

## Step 2 — Open PowerShell here

In File Explorer, click the address bar, type `powershell`, and press Enter. PowerShell opens in this folder. Do not open it inside `src`.

## Step 3 — Check the two required programs

Run these commands one at a time:

```powershell
git --version
node --version
```

Use Git for Windows and Node.js 22 or newer. If either command is not found, install the corresponding program from its official website, reopen PowerShell, and repeat the checks.

## Step 4 — Start the upload helper

This command runs only the supplied script in this one PowerShell process; it does not change your saved execution policy:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\Upload-ToGitHub.ps1
```

The script creates a NEW sibling checkout. It never edits your existing local repository. It clones the remote default branch, refuses to reuse an existing submission branch, and overlays reviewed project files while preserving unrelated files. It runs `npm ci`, `npm test`, and `npm run build`. If you have no Git commit identity configured, it asks for your name/email. You may use the private commit email shown in GitHub Settings > Emails.

If Git opens a sign-in window, select **Sanjana1513**, not the repository owner's account. If it uses the wrong cached account or returns 403, stop and share the error text without credentials. A personal access token is never required to be pasted into this chat.

## Step 5 — Review and upload

The script displays changed files and asks you to type **UPLOAD**. Only the new branch is pushed. If the branch already exists, the helper stops for review; it does not overwrite it, force-push, merge, or delete anything. No remote files change before you type UPLOAD.

## Step 6 — Confirm success

Wait for **VERIFIED: Your commit exists on the separate GitHub branch.**

The script compares the local commit SHA to the remote branch SHA. Only that success message confirms upload. Then open:

https://github.com/roshnihia-cell/ResourceShare-Hackathon/tree/resourceshare-updated-hackathon

Select the new branch in GitHub and check `src/App.jsx`, `src/booking.js`, `README.md`, and `package.json`. Share the branch URL with judges so they see the updated code. The default branch stays unchanged. Do not merge until the team has reviewed it.

## Equivalent Git operations

These are the Git operations the helper performs, with copying/testing between branch creation and commit. Use the helper above to avoid path mistakes:

```powershell
git clone https://github.com/roshnihia-cell/ResourceShare-Hackathon.git ResourceShare-Submission
cd ResourceShare-Submission
git switch -c resourceshare-updated-hackathon
# Copy the reviewed package contents into this clone, excluding .git, node_modules, dist and .env files.
# The supplied helper performs an explicit allowlisted copy and stages only those files.
npm.cmd ci
npm.cmd test
npm.cmd run build
git status --short
git add -- .gitignore .openai README.md TEST_CHECKLIST.md UPLOAD_WINDOWS.md Upload-ToGitHub.ps1 index.html netlify.toml package.json package-lock.json src tests vercel.json vite.config.js
git commit -m "Prepare ResourceShare hackathon demo and deployment"
git push -u origin resourceshare-updated-hackathon
```

Do not run `git push --force`, delete remote branches, or copy an extracted `.git` folder. The ZIP intentionally contains no `.git` folder, dependency directory, generated build, private environment file, or credentials.

## Deploy this branch elsewhere if required

In Vercel or Netlify, import the repository and choose `resourceshare-updated-hackathon` as the deployment branch. Framework: Vite. Build: `npm run build`. Output: `dist`. Node: 22+. No environment variables or backend are needed for this browser-local prototype. The included `netlify.toml` and `vercel.json` contain the build settings. Verify the resulting URL before submitting it. No Vercel or Netlify deployment is claimed here; the existing verified demo is hosted with Sites.
