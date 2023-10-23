const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const { redErrorlogging, obscuredLogging } = require("../libs/utils/error.logging.util");

/**
 * Verifies a JWT passed in the the header to protect routes.
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const verifyToken = (req, res, next) => {
  if (!req.cookies && !req?.headers?.authorization) {
    redErrorlogging("Token is missing from request", __filename);
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  const token = req.cookies.jwt.startsWith("Bearer ") ? req.cookies.jwt.split(" ")[1] : req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = { verifyToken };
