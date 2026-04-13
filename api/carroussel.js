let page = 1;
let language = 'fr-FR';

console.log("d:", document.getElementById('upcoming'));

//Upcoming movies, Popular movies, Top rated movies API calls

async function fetchMovies(category, containerId) {
  try {
    const res = await fetch(`/api/movies?category=${category}&page=${page}`);
    const movies = await res.json();

    const container = document.getElementById(containerId);
    container.innerHTML = '';

    movies.forEach(movie => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `
        min-w-[180px]
        bg-slate-800 p-3 rounded-lg shadow-lg 
        flex flex-col items-center 
        hover:scale-105 transition transform
      `;

      // image
      if (movie.poster_path) {
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        img.alt = movie.title;
        img.className = "rounded-lg shadow-md mb-2";
        card.appendChild(img);
      }

      // titre
      const title = document.createElement('h3');
      title.textContent = movie.title;
      title.className = "font-dosis text-sm font-bold text-fuchsia-300 text-center";
      card.appendChild(title);

      card.addEventListener('click', () => {
        window.location.href = `/movie_details?id=${movie.id}`;
      });

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
  }
}

document.getElementById('avatarBtn').addEventListener('click', () => {
  window.location.href = '/profile'
});

fetchMovies('upcoming', 'upcoming');
fetchMovies('popular', 'popular');
fetchMovies('top_rated', 'top-rated');
fetchMovies('now_playing', 'now_playing');





//Genres API call

// FETCH MOVIES BY GENRE
async function fetchMoviesByGenre(genreId, containerId) {
  try {
    const res = await fetch(`/api/movies/genre?genre=${genreId}&page=${page}`);
    const movies = await res.json();

    const container = document.getElementById(containerId);
    container.innerHTML = '';

    movies.forEach(movie => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `
        min-w-[180px]
        bg-slate-800 p-3 rounded-lg shadow-lg 
        flex flex-col items-center 
        hover:scale-105 transition transform
      `;

      // image
      if (movie.poster_path) {
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        img.alt = movie.title;
        img.className = "rounded-lg shadow-md mb-2";
        card.appendChild(img);
      }

      // titre
      const title = document.createElement('h3');
      title.textContent = movie.title;
      title.className = "font-dosis text-sm font-bold text-fuchsia-300 text-center";
      card.appendChild(title);

      card.addEventListener('click', () => {
        window.location.href = `/movie_details?id=${movie.id}`;
      });

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
  }
}

fetchMoviesByGenre(28, 'action'); // Action
fetchMoviesByGenre(35, 'comedy'); // Comedy
fetchMoviesByGenre(18, 'drama');  // Drama