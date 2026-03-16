const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serves the static files
app.use('/static', express.static(path.join(__dirname, '../client/static')));

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

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/templates/index.html'));
});


// server launch
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});