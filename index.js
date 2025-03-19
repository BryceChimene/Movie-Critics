import express from 'express';
import pg from 'pg';

// Environment Variable Import
import dotenv from 'dotenv';
dotenv.config();

// Declare Variables
const serverPort = process.env.SERVER_PORT;
const app = express();
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;

// Declare express
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.json());

// Connect to DB
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "critic",
    password: dbPassword,
    port: dbPort,
});
db.connect();

// Return users' name
async function getAllUserNames(){
    try{
        const res = await db.query("SELECT name FROM users");
        return res.rows;
    } catch (err){
        console.error("ERROR executing query", err.stack);
        return [];
    }
};

// Get Homescreen
app.get('/', async (req, res) => {
    const users = await getAllUserNames();
    console.log("Users: ", users);
    
    res.render('login/index', {users: users});
});

// Manage Profiles
app.get('/manage-profiles', async (req, res) => {
    const users = await getAllUserNames();

    res.render('login/manage_users', {users: users});
});

// Update Profile
app.post('/update-profile', async (req, res) => {
    const { originalName, newProfileName } = req.body;

    if (!newProfileName) {
        return res.json({ success: false, message: "Profile name cannot be empty." });
    }

    try {
        // Check if the new profile name already exists
        const existingUser = await db.query(
            "SELECT name FROM users WHERE LOWER(name) = LOWER($1)",
            [newProfileName]
        );

        if (existingUser.rows.length > 0) {
            return res.json({ success: false, message: "Profile name already exists." });
        }

        // Update profile name in the database
        await db.query(
            "UPDATE users SET name = $1 WHERE LOWER(name) = LOWER($2)",
            [newProfileName, originalName]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("ERROR updating profile:", err.stack);
        res.json({ success: false, message: "An error occurred while updating the profile." });
    }
});


// Create new Profile
app.post('/add-profile', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.json({ success: false, message: "Profile name cannot be empty." });
    }
    

    try {
        // Check if the name already exists
        const existingUser = await db.query("SELECT name FROM users WHERE LOWER(name) = LOWER($1)", [name]);

        if (existingUser.rows.length > 0) {
            return res.json({ success: false, message: "Profile name already exists." });
        }

        // Insert new profile into the database
        await db.query("INSERT INTO users (name) VALUES ($1)", [name]);

        res.json({ success: true });
    } catch (err) {
        console.error("ERROR inserting profile:", err.stack);
        res.json({ success: false, message: "An error occurred while adding the profile." });
    }
});



app.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}.`);
});