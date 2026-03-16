const { URL } = require('node:url');

require('dotenv').config();

page = 1;

sort = 'popularity.desc';

language = 'fr-FR';

url =`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_TOKEN}&language=${language}&sort_by=${sort}&page=${page}`;

fetch(url)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));