const { URL } = require('node:url');
require('dotenv').config();


const page = 1;
const sort = 'popularity.desc';
const language = 'fr-FR';

// -- Popular movies -- {{.popular}} --

popular =`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_TOKEN}&language=${language}&page=${page}`;


// -- Every movie API -- {{.all}} --

// all =`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_TOKEN}&language=${language}&sort_by=${sort}&page=${page}`;


// fetch(all)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));



fetch(popular)
  .then(res => res.json())
  .then(data => {
    data.results.forEach(movie => {
      console.log(movie.title);
    });
  })
  .catch(err => console.error(err));