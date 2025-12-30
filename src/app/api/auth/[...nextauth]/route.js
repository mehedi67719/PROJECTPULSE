import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch("https://projectpules-server.vercel.app/api/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();

          if (res.ok && data.success && data.user) {
           
            return {
              id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.image,
              role: data.user.role, 
            };
          }
        } catch (error) {
          console.error("NextAuth Login Error:", error);
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
   
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

 
      if (token?.email && !token.role) {
        try {
          const res = await fetch(`https://projectpules-server.vercel.app/api/user-role?email=${token.email}`);
          const data = await res.json();
          if (data?.role) {
            token.role = data.role;
          }
        } catch (error) {
          console.error("Role Fetch Error:", error);
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role; 
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: '/Authintaction/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };