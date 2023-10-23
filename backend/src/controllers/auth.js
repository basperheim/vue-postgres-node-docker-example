const bcrypt = require("bcryptjs");

const { redErrorlogging } = require("../libs/utils/error.logging.util");
const { formatEmail } = require("../libs/utils/format.email.util");
const { allowPassword } = require("../libs/utils/data.validators.util");
const { generateJWT } = require("../libs/utils/auth.helpers.util");

/**
 * Registers a new user with the provided information.
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A response indicating success or failure.
 */
const registerUser = async (req, res) => {
  const db = req.db;
  const { email, first, last, password } = req.body;

  const validEmail = formatEmail(email);
  if (!validEmail) {
    return res.status(400).json({ error: "Email is not valid" });
  }

  // Check if the email already exists in the database
  const emailExists = await db.exists({ table: "users", col: "email", value: validEmail });
  if (emailExists) {
    return res.status(409).json({ error: "Email already in use" });
  }

  if (!first || !last) {
    return res.status(400).json({ error: "First and last name required" });
  }

  const validPassword = allowPassword(password);
  if (!validPassword) {
    return res.status(400).json({ error: "Password must be a min of 10 chars, and have upper and lowers" });
  }

  try {
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);

    const data = {
      first_name: first.trim(),
      last_name: last.trim(),
      email: validEmail,
      password: hash,
    };

    const newUser = await db.insertOne({ table: "users", data });
    if (!newUser) {
      return res.status(500).json({ error: "Unable to register user" });
    }

    return res.status(201).json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    redErrorlogging(error, __filename);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Deletes a user with the specified email address.
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A response indicating success or failure.
 */
const deleteUser = async (req, res) => {
  const db = req.db;
  const { email } = req.query;

  const validEmail = formatEmail(email);
  if (!validEmail) {
    return res.status(400).json({ error: "Email is not valid" });
  }

  try {
    // Check if the email exists in the database
    const emailExists = await db.exists({ table: "users", col: "email", value: validEmail });
    if (!emailExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Perform the deletion of the user
    const deletedUser = await db.deleteOne({ table: "users", col: "email", value: validEmail });
    if (!deletedUser) {
      return res.status(500).json({ error: "Failed to delete user" });
    }

    return res.status(200).json({ message: "User deleted successfully", data: deletedUser });
  } catch (error) {
    redErrorlogging(error, __filename);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Login a user with the specified email address and password.
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A response indicating success or failure.
 */
const loginUser = async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;

  // Validate the request body
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const validEmail = formatEmail(email);
  if (!validEmail) {
    return res.status(400).json({ error: "Email is not valid" });
  }

  try {
    // Check if the email exists in the database
    const userRecord = await db.findOne({ table: "users", col: "email", value: validEmail });
    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, userRecord.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // If the email and password are correct, generate a JWT
    const token = generateJWT(userRecord.id, res);

    // Return the JWT in the response
    return res.status(200).json({ message: "Login successful", data: { user: userRecord, token } });
  } catch (error) {
    redErrorlogging(error, __filename);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, deleteUser, loginUser };
