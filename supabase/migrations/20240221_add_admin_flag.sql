-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create policy to allow admins to update is_verified status
CREATE POLICY "Allow admins to update profiles"
ON profiles
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
);

-- Make yourself an admin (replace with your user ID)
-- UPDATE profiles SET is_admin = true WHERE id = 'your-user-id';
