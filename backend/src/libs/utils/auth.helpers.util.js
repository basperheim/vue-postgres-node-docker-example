const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const MS_IN_30_DAYS = 2.592e9;
const MS_IN_6_HOURS = 2.16e7;
const EXPIRATION = process.env.NODE_ENV === "development" ? MS_IN_30_DAYS : MS_IN_6_HOURS;

const { redErrorlogging, obscuredLogging } = require("./error.logging.util");

/**
 * Generates a JWT for auth
 * @param {string} userId
 * @returns {string} token
 */
const generateJWT = (userId, res) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + EXPIRATION, // 30 days or 6 hours
  };

  // Generate the JWT with the payload and secret key
  obscuredLogging(payload, "payload");
  const token = jwt.sign(payload, secretKey);

  res.cookie("jwt", token, {
    httpOnly: false,
    secure: false,
    sameSite: "none",
    domain: "/",
    maxAge: EXPIRATION,
  });

  return token;
};

module.exports = { generateJWT };
