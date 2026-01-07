# Vercel Deployment Guide

## Prerequisites

1. **GitHub account** (Vercel integrates with GitHub).
2. **Vercel account** (free at https://vercel.com).

## Deployment Steps

### Option A: Deploy via GitHub (Recommended)

1. **Create a GitHub repository** for this project:
   ```powershell
   cd 'c:\Users\PC\OneDrive\Documents\Projects\Ime website'
   git init
   git add .
   git commit -m "Initial IME website redesign"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ime-website.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username and update the repo name as needed.

2. **Go to Vercel**: https://vercel.com/new

3. **Import from GitHub**:
   - Click "Import Project"
   - Select the `ime-website` repository
   - Vercel will auto-detect the `package.json`

4. **Configure Project**:
   - **Framework Preset**: Select "Other" (static site)
   - **Build Command**: `npm run images:optimize`
   - **Output Directory**: `.` (root folder)
   - **Install Command**: `npm install`

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (should take <1 minute)
   - Your site will be live at `https://ime-website-RANDOMHASH.vercel.app`

6. **Custom Domain** (optional):
   - In Vercel project settings, add your domain (e.g., `ime-school.com`)
   - Follow Vercel's DNS setup instructions

---

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```powershell
   vercel login
   ```
   (Opens browser to authenticate)

3. **Deploy from your project folder**:
   ```powershell
   cd 'c:\Users\PC\OneDrive\Documents\Projects\Ime website'
   vercel
   ```

4. **Follow prompts**:
   - Confirm project name
   - Select "." for project root
   - Choose "Other" for framework
   - Let Vercel build and deploy

5. **Output**: You'll get a live URL at the end.

---

### Option C: Manual Upload (Drag & Drop)

1. **Go to Vercel**: https://vercel.com/new
2. **Select "Import Project"** → **"From Git"** → Skip
3. **Drag and drop** the entire project folder onto Vercel
4. **Wait** for deployment to complete

---

## After Deployment

### Verify Site Works
- Visit your Vercel URL
- Test all pages: Home, About, Admissions, News, Contact
- Check mobile responsiveness (use DevTools)
- Verify images load (logo PNG/WebP/AVIF)

### Monitor Performance
- Vercel dashboard shows analytics and performance metrics
- Check "Deployments" tab for build logs if issues occur

### Update Site
After deployment, any commit to your GitHub `main` branch will auto-trigger a new build and deploy on Vercel (if using Option A).

To make changes:
```powershell
# Make edits to HTML/CSS/JS files
# Then:
git add .
git commit -m "Update: description of changes"
git push origin main
# Vercel will auto-deploy within seconds
```

---

## Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` settings match your project structure

### Images Not Loading
- Confirm `assets/images/` folder is included in git:
  ```powershell
  git add assets/images/
  git commit -m "Add images"
  git push
  ```
- Re-trigger build in Vercel: go to Deployments → click latest → "Redeploy"

### Custom Domain Issues
- Verify DNS records match Vercel's setup guide
- Allow 24–48 hours for DNS propagation

---

## Quick Reference

- **Vercel Project URL**: https://vercel.com/YOUR_USERNAME/ime-website
- **Live Site**: https://ime-website-HASH.vercel.app (or your custom domain)
- **Build Command**: `npm run images:optimize`
- **Environment Variables**: None needed (static site)
- **Redeploy Anytime**: Push to GitHub or click "Redeploy" in Vercel dashboard

---

## Support

- Vercel Docs: https://vercel.com/docs
- GitHub Integration: https://vercel.com/docs/concepts/git
- CLI Reference: https://vercel.com/cli
