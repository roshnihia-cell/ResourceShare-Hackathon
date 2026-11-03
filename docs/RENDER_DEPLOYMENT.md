# Render Static Site: exact setup and verification

## Diagnosis

This branch is a React 18 / Vite 6 frontend. package.json defines dev, build, preview and test, but no start command or backend entry point. There are no server API routes or database dependencies. `npm ci && npm run build` produces dist/index.html and bundled assets.

A shell exit of 127 usually indicates that a requested executable could not be found. A successful build followed by startup failure suggests a Web Service startup configuration, but the exact failed command remains unconfirmed without the service's startup log. Do not add `serve`, `vite preview`, an invented server entry point, or a keep-alive process merely to hide a configuration mismatch.

Render Static Sites serve build output through their CDN and have no start process. Render's Blueprint syntax for a static site is `type: web` plus `runtime: static`; this is correct despite the word web.

## Required account action

Authorize the Render connection offered in ChatGPT so the existing workspace/service can be inspected and a Static Site created. No API key should be pasted into a chat or committed to GitHub. If the connection is not used, complete the following dashboard steps in your own account.

1. Open https://dashboard.render.com and sign in to the intended Render account.
2. Click **New +** then **Static Site**. Do not choose Web Service.
3. Select the connected GitHub repository `roshnihia-cell/ResourceShare-Hackathon`. If it is missing, use **Configure account** in the Git provider selector and grant access to that repository. Select the account with accepted repository access.
4. If using the public-repository option, paste the repository URL. Select branch `resourceshare-render-static-fix` explicitly.
5. Choose an unused site name. Leave Root Directory blank.
6. Set Build Command to `npm ci && npm run build`.
7. Set Publish Directory to `dist`.
8. Do not enter a Start Command. A genuine Static Site form does not require one.
9. Click **Create Static Site** (or **Deploy Static Site**, if that is the label shown).
10. Wait for the deployment to show **Live**. Copy the actual HTTPS URL Render assigns. Do not guess an onrender.com address from the name.
11. In **Redirects/Rewrites**, add Source `/*`, Destination `/index.html`, Action **Rewrite**. Save. The checked-in render.yaml includes the same rule for Blueprint deployments; dashboard-created sites still need their dashboard rule configured.
12. Open the assigned URL in a private/incognito window and run the static-demo checks below.

The repository's render.yaml is also ready for a separate **New + > Blueprint** deployment using this branch. Review its service creation before applying. A YAML file in GitHub alone is not proof that Render has created or updated a service.

## Verification checklist

- The deployment log shows a successful npm install and Vite build.
- The service type is Static Site, not a Node Web Service.
- The assigned HTTPS URL returns the ResourceShare application.
- CSS and JavaScript requests succeed; no broken resource cards or blank screen.
- A fresh private browser loads without requiring the team to sign in.
- A fictional booking is created, another name joins the queue, and release allocates FIFO.
- Cancellation, queue withdrawal, fairness calculation and audit JSON export work.
- Refresh preserves records only within the same browser/origin.
- An arbitrary SPA path such as /judge-check loads the index fallback.
- If these checks have not run against the actual Render URL, record Render as pending, not successful.

## Features this static deploy does not add

No real user registration/login, server roles, shared database, owner approval, date/time conflicts, qualification enforcement, check-in/out conditions, owner-verified return, secure pass, email delivery, Google OAuth or password reset is implemented here. The separate upgrade branch contains many of the lifecycle/database features, with its own honest feature-status report.

To run that full-stack application on Render, port or provision its Worker/D1 and trusted identity requirements using an appropriate server/database architecture. Copying its Worker build into a Static Site is insufficient. Do that on a separate development branch after the static deployment is verified.

## References

- https://render.com/docs/static-sites
- https://render.com/docs/blueprint-spec
- https://vite.dev/guide/static-deploy
