import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const response = await axios.post(`http://localhost:3002/api/login`, {
          email: credentials.email,
          password: credentials.password,
        });
        const user = response.data.user;
        if (response && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("BEFORE JWT USER:", user, "BEFORE JWT TOKEN:",  token);
      if (user) {
        token.id = user.id; // Ensure ID is being set
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.token;
      }
      // console.log("AFTER JWT USER:", user, "AFTER JWT TOKEN:",  token);
      return token;
    },
    async session({ session, token }) {
      // console.log("BEFORE SESSION SESSION", session, "BEFORE SESSION TOKEN",  token);
      session.user.id = token.id as string;
      session.user.name = token.name;
      session.user.email = token.email as string;
      session.user.token = token.accessToken as string;

      // console.log("AFTER SESSION SESSION", session, "AFTER SESSION TOKEN",  token);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: "hwefu8Y&BHJBbf87fnHuhf78"
});
