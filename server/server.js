const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serves the static files
app.use('/static', express.static(path.join(__dirname, '../client/static')));

// Main route creation
app.get('/', (req, res) => {
    // On envoie le fichier index.html qui se trouve dans le dossier templates
    res.sendFile(path.join(__dirname, '../client/templates/index.html'));
});

// server launch
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});