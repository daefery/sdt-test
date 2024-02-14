import express from "express";
import UserModel from "../models/user.js";
import { sequelizeConnect } from "../configs/connect.js";
import { renderErrorResult } from "../functions/helper.js";

// Import required modules
const User = UserModel(sequelizeConnect);
// Initialize Express Router
const router = express.Router();

// GET /users - Retrieve all users
router.get("/", async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.findAll();

    // Send the users as a JSON response
    res.json(users);
  } catch (error) {
    // Render error result
    renderErrorResult(res, error);
  }
});

// POST /users - Create a new user
router.post("/", async (req, res) => {
  try {
    // Create a new user using the request body
    const response = await User.create(req.body);

    // Send a JSON response indicating success or failure
    return res.json({
      status: response ? "success" : "failed",
    });
  } catch (error) {
    // Render error result
    renderErrorResult(res, error);
  }
});

// PUT /users/:id - Update a user by ID
router.put("/:id", async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Update the user with the given ID using the request body
    const response = await User.update(req.body, { where: { id: id } });

    // Send a JSON response indicating success or failure
    return res.json({
      status: response ? "success" : "failed",
    });
  } catch (error) {
    // Render error result
    renderErrorResult(res, error);
  }
});

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Delete the user with the given ID
    const response = await User.destroy({ where: { id: id } });

    // Send a JSON response indicating success or failure
    return res.json({
      status: response ? "success" : "failed",
    });
  } catch (error) {
    // Render error result
    renderErrorResult(res, error);
  }
});

export default router;
