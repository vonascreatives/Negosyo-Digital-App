-- Generated Websites Table
CREATE TABLE IF NOT EXISTS generated_websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE UNIQUE,
  template_name TEXT NOT NULL,
  extracted_content JSONB NOT NULL,
  customizations JSONB DEFAULT '{}'::jsonb,
  html_content TEXT,
  css_content TEXT,
  storage_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_generated_websites_submission ON generated_websites(submission_id);
CREATE INDEX IF NOT EXISTS idx_generated_websites_status ON generated_websites(status);

-- RLS Policies
ALTER TABLE generated_websites ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own generated websites
CREATE POLICY "Users can view their own generated websites"
  ON generated_websites FOR SELECT
  TO authenticated
  USING (
    submission_id IN (
      SELECT id FROM submissions WHERE creator_id = auth.uid()
    )
  );

-- Allow admins to view all generated websites
CREATE POLICY "Admins can view all generated websites"
  ON generated_websites FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to insert/update/delete generated websites
CREATE POLICY "Admins can manage generated websites"
  ON generated_websites FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Storage bucket for generated websites
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-websites', 'generated-websites', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Allow authenticated uploads to generated-websites"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'generated-websites');

CREATE POLICY "Allow public read access to generated-websites"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'generated-websites');

CREATE POLICY "Allow admins to delete from generated-websites"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'generated-websites' AND
    EXISTS (SELECT 1 FROM creators WHERE id = auth.uid() AND role = 'admin')
  );
