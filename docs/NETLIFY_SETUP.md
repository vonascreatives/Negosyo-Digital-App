# Netlify Deployment Setup Guide

## 1. Get Your Netlify Access Token

1. Log in to [Netlify](https://app.netlify.com)
2. Click your avatar (top-right) → **User settings**
3. Go to **Applications** → **Personal access tokens**
4. Click **New access token**
5. Give it a name like `negosyo-digital-deploy`
6. **Copy the token immediately** (you won't see it again!)

> ⚠️ **Keep this token secret!** Never commit it to git.

---

## 2. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Netlify Deployment
NETLIFY_ACCESS_TOKEN=your_token_here
NETLIFY_TEAM_SLUG=          # Optional - leave empty for personal account
```

That's it! No domain purchase required.

---

## 3. How It Works

When you click "Publish Website":
1. A new Netlify site is created with subdomain: `businessname.netlify.app`
2. The generated HTML is deployed automatically
3. The published URL is saved to your database
4. Free SSL certificate is auto-provisioned by Netlify

---

## 4. Production Deployment

Add the environment variables to your hosting provider:

**Render:**
1. Go to your service → **Environment**
2. Add `NETLIFY_ACCESS_TOKEN`

**Vercel:**
1. Go to Project Settings → **Environment Variables**
2. Add `NETLIFY_ACCESS_TOKEN`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check your access token is valid |
| Site name taken | System auto-adds suffix (e.g., `mybusiness-abc123`) |
| SSL error | Wait 1-2 minutes for auto-provisioning |

---

## API Reference

**Endpoint:** `POST /api/publish-website`

**Request:**
```json
{ "submissionId": "uuid-here" }
```

**Response:**
```json
{
  "success": true,
  "url": "https://businessname.netlify.app",
  "siteId": "netlify-site-id"
}
```
