import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const handler = NextAuth({
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
        // Check if user exists in profiles
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", user.email)
          .single()

        if (error && error.code !== "PGRST116") {
          console.error("Error checking profile:", error)
          return false
        }

        // If user doesn't exist, create profile
        if (!profile) {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              email: user.email,
              id: user.id,
              is_verified: false,
              is_admin: false,
            })

          if (insertError) {
            console.error("Error creating profile:", insertError)
            return false
          }
        }
      }

      return true
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST }
