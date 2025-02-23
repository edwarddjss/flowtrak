import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
if (!process.env.GOOGLE_CLIENT_ID) throw new Error('Missing GOOGLE_CLIENT_ID')
if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error('Missing GOOGLE_CLIENT_SECRET')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
    async signIn({ user }) {
      if (!user?.email) {
        console.error('No email provided by Google')
        return false
      }

      try {
        const { data: existingUser, error: queryError } = await supabase
          .from('users')
          .select()
          .eq('email', user.email)
          .single()

        if (queryError && queryError.code !== 'PGRST116') {
          console.error('Error querying user:', queryError)
          return false
        }

        if (!existingUser) {
          const { error: createError } = await supabase
            .from('users')
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
    error: "/auth/error",
    signOut: "/auth/signout"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  debug: process.env.NODE_ENV === 'development'
} satisfies NextAuthConfig

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authConfig)
