-- Permit Tracker is the template structure for future Fulatelier Micro SaaS tools.

CREATE TABLE IF NOT EXISTS permits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permit_number text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'expired', 'rejected')
  ),
  issued_date date,
  expiry_date date,
  notes text,
  documents jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE permits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own permits" ON permits;
CREATE POLICY "Users can view their own permits"
ON permits
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own permits" ON permits;
CREATE POLICY "Users can insert their own permits"
ON permits
FOR INSERT
TO authenticated
WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own permits" ON permits;
CREATE POLICY "Users can update their own permits"
ON permits
FOR UPDATE
TO authenticated
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own permits" ON permits;
CREATE POLICY "Users can delete their own permits"
ON permits
FOR DELETE
TO authenticated
USING (user_id = (select auth.uid()));

CREATE INDEX IF NOT EXISTS permits_user_status_expiry_idx
ON permits (user_id, status, expiry_date);

DROP TRIGGER IF EXISTS update_permits_updated_at ON permits;
CREATE TRIGGER update_permits_updated_at
BEFORE UPDATE ON permits
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
