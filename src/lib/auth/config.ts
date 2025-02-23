import { type DefaultSession, type NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Define our custom types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    is_verified?: boolean
    is_admin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

// Initialize Supabase client for auth operations
const supabase = createClientComponentClient()

export const authConfig: NextAuthConfig = {
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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.flowtrak.app' : undefined
      }
    }
  },
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
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ])

            if (insertError) {
              console.error("Error creating profile:", insertError)
              return false
            }

            // Assign the generated ID back to the user
            user.id = userId
            user.is_verified = true
            user.is_admin = false
          } else {
            // Use the existing profile ID and data
            user.id = profile.id
            user.is_verified = profile.is_verified
            user.is_admin = profile.is_admin
          }
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async jwt({ token, user }) {
      // Only set the id if we have a user with an id during sign in
      if (user && typeof user.id === 'string') {
        return {
          ...token,
          id: user.id
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: session.user?.email || null,
          name: session.user?.name || null,
          image: session.user?.image || null
        }
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}
