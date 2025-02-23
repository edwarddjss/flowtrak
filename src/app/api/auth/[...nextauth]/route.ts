import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"

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

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      try {
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('email', user.email)
          .single()

        if (!existingUser) {
          const { error: createError } = await supabase
            .from('users')
            .insert([
              {
                email: user.email,
                name: user.name,
                avatar_url: user.image,
                auth_provider: 'google',
              },
            ])

          if (createError) throw createError
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    signOut: "/auth/signout"
  },
  session: {
    strategy: "jwt"
  }
})

export { handler as GET, handler as POST }
