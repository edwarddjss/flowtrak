-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow admins to read all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow admins to update all profiles" ON profiles;

-- Create simplified, more permissive policies
CREATE POLICY "Public profiles read access"
ON profiles FOR SELECT
USING (true);  -- Allow reading all profiles

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
