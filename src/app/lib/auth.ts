// src/app/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Sign in with email and password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email...'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password...'
        }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing credentials');
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            console.log('User not found');
            return null;
          }

          if (!user.hashedPassword) {
            console.log('User has no password');
            return null;
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

          if (!passwordMatch) {
            console.log('Password does not match');
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image
          };
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to token when user signs in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to session from token
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
};