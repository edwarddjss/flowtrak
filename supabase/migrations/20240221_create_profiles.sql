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

-- Create policies
CREATE POLICY "Allow users to read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow admins to read all profiles"
ON profiles FOR SELECT
USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE is_admin = true
    )
);

CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admins to update all profiles"
ON profiles FOR UPDATE
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

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
