import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async session({ session, token }) {
      // Attach the user ID from the token to the session
      session.user.id = token.id; // Add user ID to the session
      return session; // Return the modified session
    },
    async jwt({ token, user }) {
      if (user) {
        // Check if the user ID already exists in the token
        if (!token.id) {
          // Generate a new unique ID if it's the user's first sign-in
          token.id = user.id || Math.random().toString(36).substring(2, 15); // Use a random ID if user.id is not available
        }
      }
      return token; // Return the modified token
    },
  },
});
