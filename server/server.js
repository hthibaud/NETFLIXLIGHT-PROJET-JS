const express = require("express");
const path = require("path");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const port = 3000;

//Configuration of the data base for the users
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) console.error("Erreur DB:", err);
  else {
    console.log("connected to the database (file users.db created!)");
    // creating the table if it does not exist yet (with username/password)
    db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            mail TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            movie_id INTEGER,
            movie_title TEXT,
            movie_poster TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS watchlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            movie_id INTEGER,
            movie_title TEXT,
            movie_poster TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);
  }
});

// To read the forms
app.use(express.json());
//API route for movies
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.get("/api/movies", async (req, res) => {
  const page = req.query.page || 1;
  const category = req.query.category;
  const genre = req.query.genre;
  const language = "fr-FR";
  const apiKey = process.env.TMDB_TOKEN;

  let url;

  if (genre) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=${language}&page=${page}&with_genres=${genre}`;
  } else if (category) {
    url = `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&language=${language}&page=${page}`;
  } else {
    url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}&page=${page}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ error: "Impossible de récupérer les films" });
  }
});

// API route for single movie
app.get("/api/movie/:id", async (req, res) => {
  const id = req.params.id;
  const language = "fr-FR";

  const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_TOKEN}&language=${language}`;

  try {
    const response = await fetch(movieUrl);
    const movie = await response.json();
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Impossible de récupérer le film" });
  }
});

// API route for movies by genre
app.get("/api/movies/genre", async (req, res) => {
  const genreId = req.query.genre || 35;
  const page = req.query.page || 1;
  const language = "fr-FR";

  const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_TOKEN}&language=${language}&page=${page}&with_genres=${genreId}`;

  try {
    const response = await fetch(moviesUrl);
    const data = await response.json();
    res.json(data.results);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Impossible de récupérer les films par genre" });
  }
});

// Ajouter un film aux favoris
app.post("/api/favorites/add", (req, res) => {
  const { username, movie_id, title, poster } = req.body;

  // On cherche d'abord l'ID de l'utilisateur via son username
  db.get("SELECT id FROM users WHERE username = ?", [username], (err, user) => {
    if (!user) return res.json({ success: false });

    db.run(
      "INSERT INTO favorites (user_id, movie_id, movie_title, movie_poster) VALUES (?, ?, ?, ?)",
      [user.id, movie_id, title, poster],
      (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true, message: "Ajouté aux favoris !" });
      },
    );
  });
});

// get user favorites list
app.get("/api/favorites/:username", (req, res) => {
  const username = req.params.username;
  db.all(
    `
        SELECT f.* FROM favorites f 
        JOIN users u ON f.user_id = u.id 
        WHERE u.username = ?`,
    [username],
    (err, rows) => {
      if (err) return res.status(500).json([]);
      res.json(rows);
    },
  );
});

// get user's watchlist
app.get("/api/watchlist/:username", (req, res) => {
  const username = req.params.username;
  db.all(
    `SELECT w.* FROM watchlist w 
     JOIN users u ON w.user_id = u.id 
     WHERE u.username = ?`,
    [username],
    (err, rows) => {
      if (err) return res.status(500).json([]);
      res.json(rows); 
    }
  );
});

// Serves the static files
app.use("/static", express.static(path.join(__dirname, "../client/static")));

// Serves hte api/javascript files
app.use("/api", express.static(path.join(__dirname, "../api")));

// Main route creation
app.get("/", (req, res) => {
  // auth.entification.html -> first file loaded when you launch the server
  res.sendFile(
    path.join(__dirname, "../client/templates/authentification.html"),
  );
});

// route to display all the movies of the API
app.get("/allmovies", (req, res) => {
  // route to allmovies.html for the button "browse"
  res.sendFile(path.join(__dirname, "../client/templates/allmovies.html"));
});

// route to display all the faborites of the user
app.get("/favorites", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/templates/fav.html"));
});

// route to display the watchlist of the user
app.get("/watchlist", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/templates/watchlist.html"));
});

app.get("/account_creation", (req, res) => {
  // route to allmovies.html for the button "browse"
  res.sendFile(
    path.join(__dirname, "../client/templates/account_creation.html"),
  );
});

app.get("/carroussel", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/templates/carroussel.html"));
});

app.get("/movie_details", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/templates/movie_details.html"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/templates/index.html"));
});

//Sign in for the users
app.post("/api/register", (req, res) => {
  const { name, username, mail, password } = req.body;
  // inserting in SQL
  db.run(
    `INSERT INTO users (name, username, mail, password) VALUES (?, ?, ?, ?)`,
    [name, username, mail, password],
    function (err) {
      if (err)
        return res.json({
          success: false,
          message: "Pseudo, Name or Mail already used!",
        });
      res.json({ success: true, message: "Account created! log-in now!" });
    },
  );
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/templates/profile.html"));
});

// login for the user
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  // verifies if the password and the username are matching
  db.get(
    `SELECT * FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, user) => {
      if (!user)
        return res.json({
          success: false,
          message: "Wrong pseudo or password",
        });
      res.json({
        success: true,
        message: "Welcome " + user.username + "!",
        name: user.name,
        username: user.username,
        mail: user.mail,
      });
    },
  );
});

// Add a movie to the favorites list
app.post("/api/favorites/add", (req, res) => {
  const { username, movie_id, title, poster } = req.body;

  // Look for the user by their username
  db.get("SELECT id FROM users WHERE username = ?", [username], (err, user) => {
    if (!user) return res.json({ success: false });

    db.run(
      "INSERT INTO favorites (user_id, movie_id, movie_title, movie_poster) VALUES (?, ?, ?, ?)",
      [user.id, movie_id, title, poster],
      (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true, message: "Ajouté aux favoris !" });
      },
    );
  });
});

// server launch
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
