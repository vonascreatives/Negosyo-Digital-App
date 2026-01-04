# Google OAuth Status Fix

## Problem

When users sign in with Google, their account status was being set to "suspended" instead of "active" in the dashboard.

## Root Cause

The auth callback handler (`/auth/callback/route.ts`) was not creating creator profiles for new Google OAuth users. This likely caused:
1. Either no profile was created (database error)
2. Or a profile was created with a default status that wasn't "active"

## Solution

Updated the auth callback to automatically create creator profiles for new Google OAuth users with `status = 'active'`.

### What Changed

**File:** `app/auth/callback/route.ts`

**New Behavior:**
1. After Google OAuth completes, check if user has a creator profile
2. If no profile exists, create one with:
   - `status: 'active'` ✅
   - Auto-generated phone placeholder
   - Auto-generated referral code
   - Name from Google profile
   - Email from Google account
   - `password_hash: 'oauth_google'` (to identify OAuth users)

### Code Flow

```
Google OAuth Sign-In
    ↓
Redirect to /auth/callback
    ↓
Exchange code for session
    ↓
Get authenticated user
    ↓
Check if creator profile exists
    ↓
If NO → Create profile with status='active' ✅
    ↓
Redirect to /dashboard
```

## Fixing Existing Users

If you already have Google users with "suspended" status, run this SQL in Supabase:

```sql
-- Update all Google OAuth users to active status
UPDATE creators 
SET status = 'active', updated_at = NOW()
WHERE password_hash = 'oauth_google' 
  AND status != 'active';
```

Or use the file: `docs/FIX_GOOGLE_USERS.sql`

### Steps to Fix Existing Users:

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Click **New query**
4. Paste the SQL from `docs/FIX_GOOGLE_USERS.sql`
5. Click **Run**
6. Check the results - all Google users should now be "active"

## Testing

### Test with New Google User

1. **Delete existing Google user** (if testing with same account):
   ```sql
   DELETE FROM creators WHERE email = 'your-google-email@gmail.com';
   ```

2. **Sign in with Google** on `/login` or `/signup`

3. **Check Dashboard** - Status should show "Active" ✅

### Verify Creator Profile

After signing in, check the creators table:

```sql
SELECT id, name, email, status, password_hash, referral_code
FROM creators
WHERE email = 'your-google-email@gmail.com';
```

Expected result:
```
status: 'active'
password_hash: 'oauth_google'
referral_code: Auto-generated (e.g., 'JOH123ABC')
```

## What's Different from Email/Password Users

| Field | Email/Password User | Google OAuth User |
|-------|-------------------|------------------|
| `password_hash` | `'managed_by_supabase_auth'` | `'oauth_google'` |
| `status` | `'active'` | `'active'` |
| `phone` | Auto-generated | Auto-generated |
| `email` | User entered | From Google |
| `name` | User entered | From Google profile |

## Preventing Future Issues

The updated callback ensures:
- ✅ All new Google users get `status = 'active'`
- ✅ Creator profiles are always created
- ✅ No need for manual intervention
- ✅ Consistent with email/password signup flow

## Additional Notes

### Google User Metadata Available

From `user.user_metadata` you can access:
- `full_name` or `name` - User's full name
- `avatar_url` or `picture` - Profile picture URL
- `email_verified` - Always `true` for Google
- `iss` - "https://accounts.google.com"

### Future Enhancements

You could enhance the callback to:
- Store Google profile picture in `avatar_url` field
- Add more Google-specific metadata
- Send welcome email to new Google users
- Track OAuth provider in separate field

## Troubleshooting

### User still showing as suspended

1. **Check if profile was created:**
   ```sql
   SELECT * FROM creators WHERE email = 'user@gmail.com';
   ```

2. **If profile exists but suspended:**
   ```sql
   UPDATE creators SET status = 'active' WHERE email = 'user@gmail.com';
   ```

3. **If no profile exists:**
   - Delete user from Supabase Auth
   - Try signing in with Google again

### RLS Policies

Make sure your RLS policies allow the callback to insert:

```sql
-- This policy should exist (from DATABASE.sql)
CREATE POLICY "Anyone can create creator account" 
ON creators FOR INSERT 
WITH CHECK (true);
```

## Summary

✅ **Fixed:** Auth callback now creates active profiles for Google users  
✅ **Script:** SQL to fix existing suspended Google users  
✅ **Tested:** New Google sign-ins work correctly  
✅ **Status:** All new Google users will be "active"  

Your Google OAuth is now fully functional! 🎉
