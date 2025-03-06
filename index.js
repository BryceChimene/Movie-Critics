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

app.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}.`);
});