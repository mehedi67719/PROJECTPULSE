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
      // ১. এই credentials অবজেক্টটি যোগ করা খুব জরুরি
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("NextAuth Authorize - Received Credentials:", credentials);
        
        // ইমেইল বা পাসওয়ার্ড না থাকলে শুরুতেই আটকে দিবে
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password in NextAuth");
          return null;
        }

        try {
          const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();
          console.log("NextAuth: Backend Response ->", data);

          if (res.ok && data.success) {
            return {
              id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.image,
            };
          }
        } catch (error) {
          console.error("NextAuth: Fetch error ->", error.message);
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/Authintaction/login', 
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };