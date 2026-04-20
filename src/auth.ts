import type { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/server/db/prisma'

const showcaseAdminEmail = process.env.SHOWCASE_ADMIN_EMAIL?.trim().toLowerCase()
const showcaseAdminPassword = process.env.SHOWCASE_ADMIN_PASSWORD
const emailServer = process.env.EMAIL_SERVER
const emailFrom = process.env.EMAIL_FROM

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    id: 'credentials',
    name: 'Showcase Admin',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase() ?? ''
      const password = credentials?.password ?? ''

      if (!showcaseAdminEmail || !showcaseAdminPassword) {
        return null
      }

      if (email !== showcaseAdminEmail || password !== showcaseAdminPassword) {
        return null
      }

      const user = await prisma.user.upsert({
        where: { email: showcaseAdminEmail },
        update: {
          emailVerified: new Date(),
        },
        create: {
          email: showcaseAdminEmail,
          name: 'Showcase Admin',
          emailVerified: new Date(),
        },
      })

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? 'Showcase Admin',
      }
    },
  }),
]

if (emailServer && emailFrom) {
  providers.unshift(
    EmailProvider({
      server: emailServer,
      from: emailFrom,
    }),
  )
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    // JWT strategy allows adding a lightweight credentials-based showcase login.
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        ;(token as any).userId = (user as any).id
        ;(token as any).isShowcaseAdmin =
          typeof user.email === 'string' && user.email.toLowerCase() === showcaseAdminEmail
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = (token as any).userId
        ;(session.user as any).isShowcaseAdmin = Boolean((token as any).isShowcaseAdmin)
      }

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}