const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const pool = require ("./db");

// Create a new Express app
const app = express();

// Accept cross-origin requests from the frontend app
//app.use(cors({ origin: 'https://platformwithjuno.com' }));
app.use(cors({ origin: ['http://localhost:3000','https://platformwithjuno.com'] }));

// Set up Auth0 configuration
const authConfig = {
  domain: "dev-25oxk0gp.eu.auth0.com",
  audience: "https://api.withjuno.com"
};

// Define middleware that validates incoming bearer tokens
// using JWKS from dev-25oxk0gp.eu.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt, async (req, res) => {
  try {
    const experiences = await pool.query("SELECT * FROM experiences");
    res.json(experiences.rows);
/*     res.send({
      msg: "Your Access Token was successfully validated!"
    }); */
  } catch (err) {
    console.error(err.message);
  }
});

// Define an endpoint that can be called without an access token
app.get("/api/external/unsecure", async (req, res) => {
  try {
    const experiences = await pool.query("SELECT * FROM experiences");
    res.json(experiences.rows);
    /*res.send({
      msg: "Your Access Token was successfully validated!"
    }); */
  } catch (err) {
    console.error(err.message);
  }
});

// Start the app
app.listen(3001, () => console.log('API listening on 3001'));
