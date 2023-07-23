// routes/authRoutes.js


// routes/authRoutes.js

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Register a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistrationInput'
 *     responses:
 *       201:
 *         description: The newly registered user.
 *       400:
 *         description: Bad request. Invalid data provided.
 *       500:
 *         description: Internal server error.
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticate the user and get an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginInput'
 *     responses:
 *       200:
 *         description: A JWT token for user authentication.
 *       401:
 *         description: Unauthorized. Invalid credentials.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistrationInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, user]
 *       example:
 *         username: new_user
 *         password: new_password
 *         role: user
 * 
 *     UserLoginInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         username: existing_user
 *         password: existing_password
 */

// Your route handlers for user authentication


const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'user', password: 'user', role: 'user' },
];

const jwt = require('jsonwebtoken');
const config = require('../config');

// Login and get a JWT token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username,"   data is here ",password);
  const user = await User.findOne({ username });
  const pass = await User.findOne({password});
  console.log(user);

  if (!user && !pass) { 
    return res.sendStatus(401);
  }

  const token = jwt.sign({ username: user.username, role: user.role }, config.jwtSecret);
  res.json({ token });
});



// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser  = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = new User({ username, password, role }); // data base 
    const newUser = await user.save(); // save data to dB
    res.status(201).send("user created successfully");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
