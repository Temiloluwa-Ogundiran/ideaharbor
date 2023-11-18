import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDb } from "@utils/database";

import User from "@models/user";
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      await connectToDb();
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      session.user.id = sessionUser._id.toString();
      return session;
    },

    //always return session, It took me two days to fix this bug

    async signIn({ profile }) {
      try {
        await connectToDb();
        const userExists = await User.findOne({
          email: profile.email,
        });
        

        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.split(" ").join("").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export { handler as GET, handler as POST };
