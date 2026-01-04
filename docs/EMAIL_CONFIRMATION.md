# Email Confirmation Settings - Supabase

## Problem: "Email not confirmed" error on login

When you create a new account and try to login, you're getting an error saying the email is not confirmed.

## Solution: Disable Email Confirmation in Supabase

### **Step-by-Step Instructions**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Login to your account

2. **Select Your Project**
   - Click on your `negosyo-digital` project

3. **Navigate to Email Settings**
   - Click **Authentication** in the left sidebar
   - Click **Providers**
   - Click **Email** (should already be enabled)

4. **Disable Email Confirmation**
   - Find the setting: **"Confirm email"**
   - Toggle it to **OFF** (disabled)
   - Click **Save** at the bottom

5. **Test Your App**
   - Try signing up with a new account
   - You should be able to login immediately without email confirmation

---

## Alternative: Auto-Confirm Emails

If you want to keep the setting but auto-confirm emails for development:

### Option A: Use Supabase CLI (Advanced)
```bash
# In your Supabase dashboard, go to Settings > API
# Enable "Auto confirm users"
```

### Option B: Confirm User Manually
In Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Find your user
3. Click on the user
4. Manually confirm the email

---

## For Production

When you're ready to deploy to production, you should:

1. **Enable email confirmation** for security
2. **Set up email templates** in Supabase
3. **Configure SMTP settings** for sending emails
4. **Create confirmation page** at `/auth/callback`

But for development, turning off email confirmation makes testing much easier!

---

## Quick Reference

**Current Setting Location:**
```
Supabase Dashboard
  → Authentication
    → Providers  
      → Email
        → Confirm email: OFF ✓
```

**Result:**
- ✅ Users can login immediately after signup
- ✅ No email confirmation required
- ✅ Faster development workflow

---

## Already Created Users

If you already created a user and can't login:

**Option 1: Delete and Recreate**
1. Go to Authentication → Users
2. Delete the unconfirmed user
3. Sign up again

**Option 2: Manually Confirm**
1. Go to Authentication → Users
2. Click on the user
3. Toggle "Email Confirmed" to ON
4. Save

---

After making this change, you should be able to signup and login without any email confirmation! 🚀
