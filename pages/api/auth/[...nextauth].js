import NextAuth from "next-auth";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    {
      id: "asana",
      name: "Asana",
      type: "oauth",
      scope: "default",
      token: "https://app.asana.com/-/oauth_token",
      authorization: "https://app.asana.com/-/oauth_authorize?scope=default",
      userinfo: "https://app.asana.com/api/1.0/users/me",
      async profile(profile, tokens) {
        return {
          id: profile.data.gid,
          name: profile.data?.name,
          image: profile.data?.photo.image_128x128,
        };
      },
      clientId: process.env.NEXT_CLIENT_ID,
      clientSecret: process.env.NEXT_CLIENT_SECRET,
    },
  ],

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    /**
     * @param  {object}  token     Decrypted JSON Web Token
     * @param  {object}  user      User object      (only available on sign in)
     * @param  {object}  account   Provider account (only available on sign in)
     * @param  {object}  profile   Provider profile (only available on sign in)
     * @param  {boolean} isNewUser True if new user (only available on sign in)
     * @return {object}            JSON Web Token that will be saved
     */

    async jwt({ token, user, account, profile, isNewUser }) {
      // Add access_token to the token right after sign in
      // Don't overwrite values to null or undefined when this is called on decoding an encrypted JWT
      // Initial sign in
      if (account && profile) {
        return {
          ...token,
          access_token: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refresh_token: account.refresh_token,
          picture: profile.data.photo.image_128x128,
        };
      }
      
      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },

    /**
     * @param  {object} session      Session object
     * @param  {object} token        User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */

    async session({ session, token }) {
      // Add access_token to session
      session.access_token = token.access_token;
      session.user.name = token.name;
      session.user.image = token.picture;
      session.error = token.error;
      return session;
    },
  },
  useSecureCookies: true,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: {
    // A secret to use for key generation - you should set this explicitly
    // Defaults to NextAuth.js secret if not explicitly specified.
    // This is used to generate the actual signingKey and produces a warning
    // message if not defined explicitly.
    secret: "INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw",
    // You can generate a signing key using `jose newkey -s 512 -t oct -a HS512`
    // This gives you direct knowledge of the key used to sign the token so you can use it
    // to authenticate indirectly (eg. to a database driver)
    signingKey: `{
      "kty": "oct",
      "kid": "9OW51e9v-W9ixVQEOC1exz05n0tVAsqYgg5ro_IC6O8",
      "alg": "HS512",
      "k": "M1CnZunp3ZAvj1eaqc0uHvhgAwjZ5aLCig16BBjFfTS54qz79npvNKb6huzbkpKEnzzQr8_yDH2yEp5Y9seDqw"
    }`,
    // If you chose something other than the default algorithm for the signingKey (HS512)
    // you also need to configure the algorithm
    verificationOptions: {
      algorithms: ["HS512"],
    },
    secureCookie: true,
    // Set to true to use encryption. Defaults to false (signing only).
    // similar to the above, you can generate an encryption key to use in your env. variables using:
    // `jose newkey -s 256 -t oct -a A256GCM`
    encryption: true,
    encryptionKey: process.env.NEXT_JWT_ENCRYPTION_KEY,

    decryptionKey: process.env.NEXT_JWT_ENCRYPTION_KEY,
    decryptionOptions: { algorithms: ["A256GCM"] },
  },
});

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  console.log("refreshing", token);
  try {
    const url =
      "https://app.asana.com/-/oauth_token?" +
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.NEXT_CLIENT_ID,
        client_secret: process.env.NEXT_CLIENT_SECRET,
        redirect_uri: process.env.NEXTAUTH_URL + "api/auth/asana",
        code: token.refresh_token,
        refresh_token: token.refresh_token,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    console.log(refreshedTokens);

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
