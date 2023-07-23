// routes/customerRoutes.js

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API endpoints for managing customers
 * /api/customers:
 *   get:
 *     tags: [Customers]
 *     summary: Get a list of customers
 *     description: Retrieve a list of customers from the database.
 *     responses:
 *       200:
 *         description: A list of customers.
 *       500:
 *         description: Internal server error.
 *   post:
 *     tags: [Customers]
 *     summary: Add a new customer
 *     description: Add a new customer to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerInput'
 *     responses:
 *       201:
 *         description: The newly created customer.
 *       400:
 *         description: Bad request. Invalid data provided.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerInput:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *       properties:
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: string
 *           enum: [admin, user]
 *       example:
 *         name: new_user
 *         category : regular
 *         price: 34
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


const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all customers
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log("hello hi")
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new customer
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const customer = new Customer(req.body);
  try {
    console.log("hello hi");
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Other CRUD operations and filters can be added here

module.exports = router;
