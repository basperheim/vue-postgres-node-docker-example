const redisPool = require("../db/redis/connect");

const getTestRoute = async (req, res) => {
  try {
    res.status(200).json({ message: "test" });
  } catch (err) {
    console.error("Error connecting to PostgreSQL:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

const getUsersTest = async (req, res) => {
  const db = req.db;

  db.query("SELECT * FROM users")
    .then((rows) => {
      console.log(rows);
      res.status(200).json({ data: rows || [], message: "Users returned" });
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).json({ error: err.message || "Internal server error" });
    });
};

const getRedisTest = async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ error: "Missing key query parameter" });
    }

    // Use the Redis connection pool to perform Redis operations
    const result = await redisPool.get(key);
    res.json({ data: result });
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const setRedisTest = async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || !value) {
      return res.status(400).json({ error: "Missing key or value in the request body" });
    }

    let jsonObj;
    if (typeof value === "string" && value.length) {
      try {
        jsonObj = JSON.parse(value);
      } catch (err) {
        console.error(err);
      }
    }

    // Use the Redis connection pool to set the key-value pair in Redis
    await redisPool.set(key, jsonObj || value);

    // res.json({ message: "Key-value pair has been set in Redis" });
    res.status(201).json({ message: "Key-value pair has been set in Redis" });
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * ! EXAMPLE PSEUDO CODE TO FETCH BLOB IMAGE FOR FE
 * ! NOT TESTED YET
 * @param {*} req
 * @param {*} res
 * @returns
 */
const fetchImageTest = async (req, res) => {
  const db = req.db;
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: "Missing key query parameter" });
  }

  // Check Redis first
  try {
    const redisImage = await redisPool.get(key);
    if (redisImage) {
      res.contentType("image/jpeg"); // Adjust content type as needed
      res.send(redisImage);
      return; // Return early if found in Redis
    }
  } catch (error) {
    console.error("Redis error:", error);
  }

  // If not found in Redis, fetch from PostgreSQL
  try {
    const queryResult = await db.findOne("templates", "key_column", key);
    if (queryResult) {
      // Assuming `imageData` is the image blob column in the database
      const imageData = queryResult.imageData;

      // Send the image as a response
      res.contentType("image/jpeg"); // Adjust content type as needed
      res.send(imageData);

      // Store the image in Redis for future requests
      redisPool.set(key, imageData);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { getTestRoute, setRedisTest, getUsersTest, getRedisTest };
