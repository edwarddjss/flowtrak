import { type DefaultSession, type NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Initialize Supabase client for auth operations
const supabase = createClientComponentClient()

// Add custom properties to User and JWT
declare module "next-auth" {
  interface User {
    is_verified?: boolean
    is_admin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    is_verified?: boolean
    is_admin?: boolean
  }
}

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
      if (!user?.email) {
        console.error('No email provided by Google')
        return false
      }

      try {
        const { data: existingUser, error: queryError } = await supabase
          .from('profiles')
          .select()
          .eq('email', user.email)
          .single()

        if (queryError && queryError.code !== 'PGRST116') {
          console.error('Error querying user:', queryError)
          return false
        }

        if (!existingUser) {
          const { error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                email: user.email,
                name: user.name || '',
                avatar_url: user.image || '',
                auth_provider: 'google',
              },
            ])

          if (createError) {
            console.error('Error creating user:', createError)
            return false
          }
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async jwt({ token, user, trigger }) {
      if (trigger === "signIn" && user?.id) {
        token.sub = user.id
        token.is_verified = user.is_verified
        token.is_admin = user.is_admin
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
        session.user.is_verified = token.is_verified as boolean | undefined
        session.user.is_admin = token.is_admin as boolean | undefined
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
}
