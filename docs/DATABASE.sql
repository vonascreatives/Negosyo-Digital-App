-- Users table (creators/agents)
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50),
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  password_hash TEXT NOT NULL, -- Hashed password for Supabase Auth
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_by UUID REFERENCES creators(id),
  balance DECIMAL(8,2) DEFAULT 0,
  total_earnings DECIMAL(8,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, suspended
  role VARCHAR(20) DEFAULT 'creator', -- creator, admin
  payout_method VARCHAR(50),
  payout_details TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Business submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES creators(id) NOT NULL,

  -- Business info
  business_name VARCHAR(200) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  owner_phone VARCHAR(20) NOT NULL,
  owner_email VARCHAR(100),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,

  -- Files
  photos JSONB, -- array of photo URLs
  video_url VARCHAR(500),
  audio_url VARCHAR(500),
  transcript TEXT,

  -- Generated content
  website_url VARCHAR(500),
  website_code TEXT,

  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  -- draft, submitted, in_review, website_generated,
  -- pending_payment, paid, completed, rejected

  -- Payment
  amount DECIMAL(8,2) DEFAULT 1000,
  payment_reference VARCHAR(100),
  paid_at TIMESTAMP,

  -- Creator payout
  creator_payout DECIMAL(8,2),
  payout_requested_at TIMESTAMP, -- NEW: When creator requested payout
  creator_paid_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_creators_email ON creators(email);
CREATE INDEX idx_creators_phone ON creators(phone);
CREATE INDEX idx_creators_referral_code ON creators(referral_code);
CREATE INDEX idx_submissions_creator_id ON submissions(creator_id);
CREATE INDEX idx_submissions_status ON submissions(status);

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_creators_updated_at 
BEFORE UPDATE ON creators
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at 
BEFORE UPDATE ON submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creators table

-- Allow users to read their own profile
CREATE POLICY "Users can view own creator profile" 
ON creators FOR SELECT 
USING (auth.uid()::text = id::text);

-- Allow users to update their own profile (except password_hash)
CREATE POLICY "Users can update own creator profile" 
ON creators FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Allow anyone to create a new creator account (for signup)
CREATE POLICY "Anyone can create creator account" 
ON creators FOR INSERT 
WITH CHECK (true);

-- Allow public to view active creators (for referral lookups)
CREATE POLICY "Public can view active creators for referrals" 
ON creators FOR SELECT 
USING (status = 'active');

-- RLS Policies for submissions table

-- Allow users to view their own submissions
CREATE POLICY "Creators can view own submissions" 
ON submissions FOR SELECT 
USING (auth.uid()::text = creator_id::text);

-- Allow users to create submissions
CREATE POLICY "Creators can create submissions" 
ON submissions FOR INSERT 
WITH CHECK (auth.uid()::text = creator_id::text);

-- Allow users to update their own submissions
CREATE POLICY "Creators can update own submissions" 
ON submissions FOR UPDATE 
USING (auth.uid()::text = creator_id::text);

-- Allow users to delete their own draft submissions
CREATE POLICY "Creators can delete own draft submissions" 
ON submissions FOR DELETE 
USING (auth.uid()::text = creator_id::text AND status = 'draft');

-- ==========================================
-- ADMIN POLICIES
-- ==========================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM creators 
    WHERE id::text = auth.uid()::text 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow admins to view all creators
CREATE POLICY "Admins can view all creators" 
ON creators FOR SELECT 
USING (is_admin());

-- Allow admins to update any creator
CREATE POLICY "Admins can update any creator" 
ON creators FOR UPDATE 
USING (is_admin());

-- Allow admins to view all submissions
CREATE POLICY "Admins can view all submissions" 
ON submissions FOR SELECT 
USING (is_admin());

-- Allow admins to update any submission
CREATE POLICY "Admins can update any submission" 
ON submissions FOR UPDATE 
USING (is_admin());

-- Allow admins to delete any submission
CREATE POLICY "Admins can delete any submission" 
ON submissions FOR DELETE 
USING (is_admin());

UPDATE creators 
SET role = 'admin' 
WHERE email = 'your@email.com';