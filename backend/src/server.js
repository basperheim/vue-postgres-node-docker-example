const express = require("express");
const app = express();
const connection = require("./db/connect");
const routes = require("./routes");
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`\nReceived request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use((req, res, next) => {
  req.db = connection;
  next();
});

app.use(express.json());
app.use("/", routes);

// Start the Express server
app.listen(port, () => {
  console.log(`\nBackend is running on port ${port}`);
  console.dir({ NODE_ENV: process.env.NODE_ENV || "unknown" });
});
