const express = require('express');
const path = require('path');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const port = 3000;

//Configuration of the data base for the users
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) console.error("Erreur DB:", err);
    else {
        console.log("connected to the database (file users.db created!)");
        // creating the table if it does not exist yet
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);
    }
});

// To read the forms
app.use(express.json()); 
//API route for movies
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// route pour récupérer les films populaires
app.get('/api/movies', async (req, res) => {
    const page = req.query.page || 1;
    const language = 'fr-FR';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_TOKEN}&language=${language}&page=${page}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.results); // envoie les films au client
    } catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer les films' });
    }
});

// Serves the static files
app.use('/static', express.static(path.join(__dirname, '../client/static')));

// Serves hte api/javascript files
app.use('/api', express.static(path.join(__dirname, '../api')));

// Main route creation
app.get('/', (req, res) => {
    // auth.entification.html -> first file loaded when you launch the server
    res.sendFile(path.join(__dirname, '../client/templates/authentification.html'));
});

// route to display all the movies of the API
app.get('/allmovies', (req, res) => {
    // route to allmovies.html for the button "browse"
    res.sendFile(path.join(__dirname, '../client/templates/allmovies.html'));
});

app.get('/account_creation', (req, res) => {
    // route to allmovies.html for the button "browse"
    res.sendFile(path.join(__dirname, '../client/templates/account_creation.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/templates/index.html'));
});

//Sign in for the users
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    // inserting in SQL
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function(err) {
        if (err) return res.json({ success: false, message: "This pseudo already exists!" });
        res.json({ success: true, message: "Account created! log-in now!"});
    });
});

// login for the user
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // verifies if the password and the username are matching
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, user) => {
        if (!user) return res.json({ success: false, message: "Wrong pseudo or password" });
        res.json({ success: true, message: "Welcome " + user.username, username: user.username });
    });
});

// server launch
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});