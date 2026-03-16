require('dotenv').config(); // Charge les variables d'environnement

const api_key = process.env.API_KEY;

//fetch('https://api.themoviedb.org/3/authentication', options)
fetch(`https://api.themoviedb.org/3/movie/550?api_key=${process.env.TMDB_TOKEN}`)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));