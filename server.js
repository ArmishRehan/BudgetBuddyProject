const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

// MySQL Database connection setup
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "072043armish", // Update with your MySQL password
    database: "budgetdb"
});

// Connect to the database
connection.connect(function(error) {
    if (error) {
        console.error("Error connecting to the database:", error);
        return;
    }
    console.log("Connected to the database successfully");
});

// Configure session middleware
app.use(
    session({
        secret: "yourSecretKey",  // Replace with a strong secret key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }  // Set secure: true for production with HTTPS
    })
);

// Serve static files (like HTML, CSS, JS, etc.)
app.use(express.static(__dirname));

// Middleware for parsing incoming JSON and URL-encoded data
app.use(express.json()); // For handling JSON requests
app.use(express.urlencoded({ extended: true })); // For handling form submissions (URL-encoded)

// Serve the login page
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Handle the login request
app.post("/", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log("Received username:", username);

    // Query the database to check credentials
    connection.query(
        "SELECT * FROM userslogin WHERE user_name = ? AND user_pass = ?",
        [username, password],
        function(error, results) {
            if (error) {
                console.error("Error executing query:", error);
                return res.status(500).send("Database query error");
            }

            if (results.length > 0) {
                req.session.user_id = results[0].user_id;  // Store user_id in session
                console.log("Login successful, user ID:", req.session.user_id);
                res.redirect("/dashboard.html");  // Redirect to dashboard after successful login
            } else {
                console.log("Invalid credentials for username:", username);
                res.redirect("/");  // Redirect back to login page
            }
        }
    );
});

// Handle the signup request
app.post("/signup", function(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    console.log("Received name:", name);
    console.log("Received email:", email);

    // Check if passwords match
    if (password !== confirmPassword) {
        console.log("Passwords do not match");
        return res.status(400).send("Passwords do not match");
    }

    // Insert user into the database with plain text password
    connection.query(
        "INSERT INTO userslogin (user_name, user_pass, user_email) VALUES (?, ?, ?)",
        [name, password, email],
        function(error, results) {
            if (error) {
                console.error("Error inserting user into database:", error);
                return res.status(500).send("Database error");
            }

            console.log("User successfully signed up:", name);
            res.redirect("/");  // Redirect to login page after successful sign-up
        }
    );
});

// Add transaction route
app.post("/api/transactions", function(req, res) {
    // Log the entire request body to debug
    console.log("Request body:", req.body);

    const { type, date, amount, category, description } = req.body;

    // Check if the user is logged in
    if (!req.session.user_id) {
        console.log("User not logged in.");
        return res.status(403).send({ success: false, message: "You must be logged in to add transactions." });
    }

    const userId = req.session.user_id;

    // Validate input fields
    if (!type || !date || !amount || !description) {
        console.log("Missing required fields in transaction data.");
        return res.status(400).send({ success: false, message: "All fields are required." });
    }

    // Insert the transaction into the database
    const query = "INSERT INTO user_transactions (user_id, type, category, date, amount, description) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [userId, type, category, date, amount, description];

    connection.query(query, values, function(error, results) {
        if (error) {
            console.error("Error inserting into database:", error);
            return res.status(500).send({ success: false, message: "Error adding record." });
        }

        console.log("Transaction saved successfully:", results);
        res.send({ success: true, message: "Transaction added successfully." });
    });
});


// Route to fetch total balance, expenses, and income
app.get("/api/stats", function(req, res) {
    if (!req.session.user_id) {
        return res.status(403).send({ success: false, message: "You must be logged in to view stats." });
    }

    const userId = req.session.user_id;

    // SQL query to fetch total balance, total income, and total expenses
    const query = `
        SELECT 
            (SELECT IFNULL(SUM(amount), 0) FROM user_transactions WHERE type = 'Income' AND user_id = ?) AS total_income,
            (SELECT IFNULL(SUM(amount), 0) FROM user_transactions WHERE type = 'Expense' AND user_id = ?) AS total_expenses
    `;

    connection.query(query, [userId, userId], function(error, results) {
        if (error) {
            console.error("Error fetching stats:", error);
            return res.status(500).send({ success: false, message: "Error fetching stats." });
        }

        // Extract the data from results
        const totalIncome = results[0].total_income || 0;
        const totalExpenses = results[0].total_expenses || 0;
        const totalBalance = totalIncome - totalExpenses;

        // Send the data as a response
        res.json({
            total_balance: totalBalance,
            total_income: totalIncome,
            total_expenses: totalExpenses
        });
    });
});


//recent transactions wala
// Get recent expense transactions
app.get("/api/recent-transactions", function(req, res) {
    if (!req.session.user_id) {
        return res.status(403).send({ success: false, message: "You must be logged in to view transactions." });
    }

    const userId = req.session.user_id;

    const query = `
        SELECT transaction_id, date, amount, category
        FROM user_transactions
        WHERE type = 'Expense' AND user_id = ?
        ORDER BY date DESC
        LIMIT 5
    `;

    connection.query(query, [userId], function(error, results) {
        if (error) {
            console.error("Error fetching recent transactions:", error);
            return res.status(500).send({ success: false, message: "Error fetching transactions." });
        }

        res.json({
            success: true,
            transactions: results
        });
    });
});



// Server listening on port
app.listen(3000, function() {
    console.log("Server is running on port 3000");
});