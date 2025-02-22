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

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

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
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                email: user.email,
                is_verified: true,
                is_admin: false,
              },
            ])

          if (insertError) {
            console.error("Error creating profile:", insertError)
            return false
          }
        }
      }

      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        token.user = session.user
      }
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
})
