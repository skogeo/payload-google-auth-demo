import express from 'express'
import payload from 'payload'
import passport from "passport";
import session from "express-session";
import jwt from "jsonwebtoken";
import getCookieExpiration from 'payload/dist/utilities/getCookieExpiration'
import MongoStore from 'connect-mongo'
import GoogleOAuthStrategy from './authStrategies/GoogleOAuthStrategy';

require('dotenv').config()
const app = express()

// this is called to initialize the auth processs
app.get("/oauth2/authorize", passport.authenticate("googleOauth"));

// this is the callback called by google and here we need to initialize the session for our user with the jwt
app.get(
  "/oauth/google/callback",
  // Initialize session middleware with configuration options
  session({
    resave: false,  // Prevents resaving session if not modified
    saveUninitialized: false,  // Prevents saving uninitialized sessions
    secret: process.env.PAYLOAD_SECRET || 'default_secret', // Secret for signing the session ID cookie
    store: process.env.MONGODB_URI ? MongoStore.create({ mongoUrl: process.env.MONGODB_URI }) : undefined, // Session store configuration
  }),

  // Passport middleware to handle OAuth2 authentication
  passport.authenticate("googleOauth", { failureRedirect: "/login" }),

  // Callback function executed after successful authentication
  function (req, res) {
    // Access configuration for the 'users' collection
    const collectionConfig = payload.collections["users"].config;

    // Select the fields from the user object to include in the JWT
    let fieldsToSign = {
      // @ts-ignore
      email: req.user.email,  // User's email
      // @ts-ignore
      id: req.user.id,  // User's ID
      collection: "users",  // Collection to which the user belongs
    };

    // Sign the JWT with selected fields
    const token = jwt.sign(fieldsToSign, payload.secret, {
      expiresIn: collectionConfig.auth.tokenExpiration,  // Set token expiration as per configuration
    });

    // Set a cookie in the response with the JWT
    res.cookie(`${payload.config.cookiePrefix}-token`, token, {
      path: "/",  // Cookie path
      httpOnly: true,  // HttpOnly flag for security
      expires: getCookieExpiration(collectionConfig.auth.tokenExpiration),  // Cookie expiration time
      secure: collectionConfig.auth.cookies.secure,  // Secure flag (for HTTPS)
      sameSite: collectionConfig.auth.cookies.sameSite,  // SameSite attribute
      domain: collectionConfig.auth.cookies.domain || undefined,  // Cookie domain
    });

    // Redirect user to the admin dashboard after successful authentication
    res.redirect("/admin");
  }
);

// Redirect root to Admin panel
// app.get('/', (_, res) => {
//   res.redirect('/admin')
// })


// Configure Passport with Google OAuth Strategy
passport.use("googleOauth", GoogleOAuthStrategy);

// Serialize the user to the session
// Only the user ID is stored in the session for efficiency.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user from the session
// This is used to retrieve the full user information based on the stored ID.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await payload.findByID({ collection: "users", id });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Add your own express routes here

  app.listen(3000)
}

start()
