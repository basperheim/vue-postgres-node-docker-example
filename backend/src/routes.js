const express = require("express");
const router = express.Router();

/**
 ** CUSTOM MIDDLEWARE
 */
const { verifyToken } = require("./middlewares/verify.token");

/**
 ** TESTS
 */
const { getTestRoute, getUsersTest, setRedisTest, getRedisTest } = require("./controllers/tests");
router.get("/test/users", verifyToken, getUsersTest);
router.get("/test", getTestRoute);
router.route("/test/redis").get(getRedisTest).post(setRedisTest);

/**
 ** USERS/AUTH
 */
const { registerUser, deleteUser, loginUser } = require("./controllers/auth");
router.put("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.delete("/auth/user", deleteUser);

/**
 ** CATCH-ALL
 */
router.use((req, res, next) => {
  console.log(`\nReceived request: ${req.method} ${req.originalUrl}`);
  if (process.env.NODE_ENV.includes("dev")) {
    res.status(404).json({ error: `${req.method} ${req.originalUrl} is not a valid API` });
  } else {
    res.status(400).json({ error: "Invalid route" });
  }
  next();
});

module.exports = router;
