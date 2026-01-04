# Authentication System - Updated for Custom Schema

## ✅ Changes Made

I've successfully aligned the authentication system with your existing database schema. Here's what was updated:

### 1. **Database Schema** (`docs/DATABASE.sql`)
   - ✅ Added `password_hash TEXT NOT NULL` field to `creators` table
   - ✅ Added comprehensive **Row Level Security (RLS)** policies for both tables:
     - **Creators table**:
       - Users can view their own profile
       - Users can update their own profile
       - Anyone can create an account (for signup)
       - Public can view active creators (for referrals)
     - **Submissions table**:
       - Creators can view their own submissions
       - Creators can create new submissions
       - Creators can update their own submissions
       - Creators can delete draft submissions
   - ✅ Added performance indexes on key fields
   - ✅ Added auto-update triggers for `updated_at` timestamps

### 2. **Signup Page** (`app/signup/page.tsx`)
   Updated to match your schema:
   - ✅ Collects **phone** (required), **name** (required), **email** (optional)
   - ✅ Password confirmation field added
   - ✅ Auto-generates unique `referral_code` from name
   - ✅ Creates user in Supabase Auth with email/password
   - ✅ Creates creator profile in `creators` table with:
     - `id` (uses Supabase Auth user ID)
     - `phone`, `name`, `email`
     - `password_hash` (placeholder, managed by Supabase)
     - `referral_code` (auto-generated)
     - `status` set to 'active'
   - ✅ Sets email to `{phone}@negosyo.digital` if no email provided

### 3. **Login Page** (`app/login/page.tsx`)
   Updated to support flexible login:
   - ✅ Accepts **phone number OR email** as identifier
   - ✅ If phone is entered, queries `creators` table to find associated email
   - ✅ Falls back to constructed email if needed
   - ✅ Logs in via Supabase Auth with email/password
   - ✅ Redirects to `/dashboard` on success

### 4. **Dashboard Page** (`app/dashboard/page.tsx`)
   Updated to display your schema fields:
   - ✅ Queries creators by `id` (not `auth_id`)
   - ✅ Displays creator `name` and `referral_code`
   - ✅ Shows **Balance**, **Total Earnings**, and **Submissions** count
   - ✅ Queries `submissions` table for accurate count
   - ✅ Shows **Phone**, **Email** (if exists), and **Status**
   - ✅ Status displayed as: Active (green), Pending (yellow), or Suspended
   - ✅ Quick action button to "Submit New Business"

### 5. **Middleware** (`middleware.ts`)
   - ✅ Restored to root directory
   - ✅ Protects all routes except `/login`, `/signup`, `/auth`
   - ✅ Redirects unauthenticated users to `/login`

## 🔐 How Authentication Works

### Signup Flow:
1. User enters: **name**, **phone**, **email** (optional), **password**
2. System generates unique `referral_code` from name
3. Supabase Auth creates user account
4. Creator profile created in `creators` table with user ID
5. User redirected to dashboard

### Login Flow:
1. User enters: **phone OR email**, **password**
2. If phone: system looks up email in `creators` table
3. Supabase Auth validates credentials
4. User redirected to dashboard

### Protected Routes:
- Middleware checks authentication on every request
- Unauthenticated users → redirect to `/login`
- Authenticated users → can access dashboard and other pages

## 📊 Database Schema Summary

### `creators` table:
- `id` (UUID, PK) - Links to Supabase Auth
- `phone` (VARCHAR, UNIQUE, NOT NULL)
- `name` (VARCHAR, NOT NULL)
- `email` (VARCHAR, optional)
- `password_hash` (TEXT, NOT NULL) - Managed by Supabase
- `referral_code` (VARCHAR, UNIQUE, NOT NULL)
- `referred_by` (UUID) - Self-reference
- `balance`, `total_earnings` (DECIMAL)
- `status` (VARCHAR) - pending, active, suspended
- `payout_method`, `payout_details`
- Timestamps: `created_at`, `updated_at`

### `submissions` table:
- All existing fields preserved
- RLS policies ensure creators only see their own data

## 🧪 Testing Guide

### Test Signup:
```
1. Go to /signup
2. Fill in:
   - Name: "Test Creator"
   - Phone: "09171234567"
   - Email: "test@example.com" (optional)
   - Password: "password123"
   - Confirm Password: "password123"
3. Submit
4. Check dashboard displays correctly
```

### Test Login with Phone:
```
1. Go to /login
2. Enter: 09171234567
3. Enter password
4. Verify login succeeds
```

### Test Login with Email:
```
1. Go to /login
2. Enter: test@example.com
3. Enter password
4. Verify login succeeds
```

### Test Protected Routes:
```
1. Log out
2. Try accessing /dashboard
3. Verify redirect to /login
```

## 🎯 Next Steps

1. **Set up Supabase**:
   - Add your credentials to `.env`
   - Run the SQL from `DATABASE.sql` in Supabase SQL Editor

2. **Test the auth flow**:
   - Try signup with phone only
   - Try signup with phone + email
   - Try login with both phone and email

3. **Build additional features**:
   - Profile editing page
   - Submissions list page
   - Earnings/payout page

## 🔑 Key Features

- ✅ Phone-based authentication (phone is unique identifier)
- ✅ Email optional (fallback to constructed email)
- ✅ Automatic referral code generation
- ✅ Row-level security for data protection
- ✅ Server-side auth validation
- ✅ Clean, modern black & white design
- ✅ Fully aligned with your database schema

Everything is ready to use! Just add your Supabase credentials and run the database setup.
