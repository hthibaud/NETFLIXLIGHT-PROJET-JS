const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

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

app.use('/api', express.static(path.join(__dirname, '../api')));

// Serves the static files
app.use('/static', express.static(path.join(__dirname, '../client/static')));

// Main route creation
app.get('/', (req, res) => {
    // index.html -> first file loaded when you launch the server
    res.sendFile(path.join(__dirname, '../client/templates/index.html'));
});

// route to display all the movies of the API
app.get('/allmovies', (req, res) => {
    // route to allmovies.html for the button "browse"
    res.sendFile(path.join(__dirname, '../client/templates/allmovies.html'));
});

// server launch
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});