# Modern React Portfolio

A responsive, animated portfolio website built with React, Vite, Tailwind CSS v4, Framer Motion, and Lucide React. The contact form submits to a separate Google spreadsheet through Google Apps Script; contact drafts are also saved in the current browser.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

The production files are generated in `dist/` and can be deployed to static hosting such as Vercel or Netlify.

## Customize
- Edit `src/data/portfolio.js` to update name, bio, projects, skills, links, and experience.
- Update the document title and description in `index.html`.
- Replace `public/resume.pdf` with your actual resume if you want to use the resume link. The resume link is not shown in the current UI.
- Replace demo project URLs (`https://example.com`) and social profile links before publishing.

## Google Sheets contact form

The contact form submits name, email, required phone number, optional subject, and message to a separate spreadsheet. The spreadsheet is created and owned by the Google account that runs the Apps Script setup; submissions are not sent until the visitor presses **Submit**.

1. Open [Google Apps Script](https://script.google.com/) and create a standalone project.
2. Replace its editor contents with [`google-apps-script/Code.gs`](./google-apps-script/Code.gs), then save.
3. Select and run `setupContactSpreadsheet` once. Approve Google's authorization prompt. In the execution log, copy the URL of the newly created spreadsheet.
4. In Apps Script, choose **Deploy > New deployment > Web app**. Set **Execute as** to your account and **Who has access** to **Anyone**, then deploy and authorize if prompted. Copy the deployed URL ending in `/exec`. If you already deployed this script, use **Deploy > Manage deployments > Edit**, select **New version**, and deploy the update; the `/exec` URL usually stays the same.
5. Copy `.env.example` to `.env.local` and set `VITE_GOOGLE_APPS_SCRIPT_URL` to that `/exec` URL. Restart `npm run dev`, or rebuild and redeploy the site for production.
6. Open the `/exec` URL in a browser. It should say the contact endpoint is online. Then submit a test message and verify it appears in the **Contact submissions** tab of the spreadsheet.

The web app must be accessible to anyone for public visitors to submit the form. The script validates fields, includes a basic bot honeypot, and stores values as text to prevent spreadsheet formula injection. The deployment URL is public, not a secret; do not put Google credentials or service-account keys in the frontend. Restrict spreadsheet sharing to trusted recipients, and consider adding stronger spam protection/rate limiting before public launch.

## Notes
All portfolio data is demo content. Replace sample identity, experience, project claims, and contact details with accurate information before publishing.
