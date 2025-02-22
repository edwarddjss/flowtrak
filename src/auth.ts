import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      try {
        if (account?.provider === "google") {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", user.email)
            .single()

          if (profileError && profileError.code !== "PGRST116") {
            console.error("Error checking profile:", profileError)
            return false
          }

          if (!profile) {
            // Generate a UUID for the user if one doesn't exist
            const userId = user.id || crypto.randomUUID()
            
            const { error: insertError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: userId,
                  email: user.email,
                  is_verified: true,
                  is_admin: false,
                },
              ])

            if (insertError) {
              console.error("Error creating profile:", insertError)
              return false
            }

            // Assign the generated ID back to the user
            user.id = userId
          } else {
            // Use the existing profile ID
            user.id = profile.id
          }
        }
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})
