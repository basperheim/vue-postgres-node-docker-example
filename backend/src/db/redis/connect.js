const Redis = require("ioredis");

const redisPool = new Redis({
  host: "172.28.1.3",
  port: 6379,
  // tls: false,
});

redisPool.on("error", (error) => {
  console.error("Redis connection error:", error);
});

module.exports = redisPool;
