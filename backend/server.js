require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("./db");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;


// ====================
// MIDDLEWARE
// ====================

app.use(cors());
app.use(express.json());


// ====================
// HOME ROUTE
// ====================

app.get("/", (req, res) => {
    res.send("TaskFlow Backend is running!");
});


// ====================
// SIGNUP
// ====================

app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users
             (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Signup error:", error.message);

        res.status(500).json({
            message: "Signup failed"
        });
    }
});


// ====================
// LOGIN
// ====================

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Login failed"
        });
    }
});
// ====================
// GET LOGGED-IN USER
// ====================

app.get("/api/me", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email
             FROM users
             WHERE id = $1`,
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching user:", error.message);

        res.status(500).json({
            message: "Failed to fetch user"
        });
    }
});

app.get("/api/admin/dashboard", authMiddleware, async (req, res) => {
    try {
        // Check if logged-in user is the admin
        const userResult = await pool.query(
            "SELECT email FROM users WHERE id = $1",
            [req.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userEmail = userResult.rows[0].email;

        if (userEmail !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        // Get all users
        const usersResult = await pool.query(
            `SELECT id, name, email, created_at
             FROM users
             ORDER BY created_at DESC`
        );

        // Get all tasks with their user's name/email
        const tasksResult = await pool.query(
            `SELECT
                tasks.id,
                tasks.title,
                tasks.description,
                tasks.completed,
                tasks.created_at,
                users.name,
                users.email
             FROM tasks
             JOIN users
             ON tasks.user_id = users.id
             ORDER BY tasks.created_at DESC`
        );

        res.json({
            users: usersResult.rows,
            tasks: tasksResult.rows
        });

    } catch (error) {
        console.error("Admin dashboard error:", error.message);

        res.status(500).json({
            message: "Failed to load admin dashboard"
        });
    }
});

// ==================================================
// TASK ROUTES
// ==================================================


// ====================
// GET ALL USER TASKS
// ====================

app.get("/api/tasks", authMiddleware, async (req, res) => {
    try {

        console.log("Logged in user ID:", req.userId);

        const result = await pool.query(
            `SELECT *
             FROM tasks
             WHERE user_id = $1
             ORDER BY id DESC`,
            [req.userId]
        );

        res.json(result.rows);

    } catch (error) {

        console.error(
            "Error fetching tasks:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
});


// ====================
// CREATE TASK
// ====================

app.post("/api/tasks", authMiddleware, async (req, res) => {
    try {

        const {
            title,
            description,
            priority
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks
             (user_id, title, description, priority)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                req.userId,
                title,
                description,
                priority || "medium"
            ]
        );

        res.status(201).json({
            message: "Task created successfully",
            task: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Error creating task:",
            error.message
        );

        res.status(500).json({
            message: "Failed to create task"
        });
    }
});


// ====================
// UPDATE TASK COMPLETION
// ====================

app.patch("/api/tasks/:id", authMiddleware, async (req, res) => {
    try {

        const { id } = req.params;
        const { completed } = req.body;

        if (typeof completed !== "boolean") {
            return res.status(400).json({
                message: "completed must be true or false"
            });
        }

        const result = await pool.query(
            `UPDATE tasks
             SET completed = $1
             WHERE id = $2
             AND user_id = $3
             RETURNING *`,
            [
                completed,
                id,
                req.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task status updated successfully",
            task: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Error updating task status:",
            error.message
        );

        res.status(500).json({
            message: "Failed to update task status"
        });
    }
});


// ====================
// DELETE TASK
// ====================

app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM tasks
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [
                id,
                req.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully",
            task: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Error deleting task:",
            error.message
        );

        res.status(500).json({
            message: "Failed to delete task"
        });
    }
});


// ====================
// UPDATE TASK DETAILS
// ====================

app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
    try {

        const { id } = req.params;

        const {
            title,
            description,
            priority
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const result = await pool.query(
            `UPDATE tasks
             SET title = $1,
                 description = $2,
                 priority = $3
             WHERE id = $4
             AND user_id = $5
             RETURNING *`,
            [
                title,
                description,
                priority,
                id,
                req.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task updated successfully",
            task: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Error updating task:",
            error.message
        );

        res.status(500).json({
            message: "Failed to update task"
        });
    }
});


// ====================
// DATABASE CONNECTION TEST
// ====================

pool.query("SELECT NOW()", (err, result) => {

    if (err) {

        console.log(
            "Database connection failed:",
            err.message
        );

    } else {

        console.log(
            "Database connected successfully!"
        );

        console.log(result.rows[0]);
    }
});


// ====================
// START SERVER
// ====================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});