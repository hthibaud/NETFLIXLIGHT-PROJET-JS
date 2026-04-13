let page = 1;
let sort = 'popularity.desc';
let language = 'fr-FR';

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function fetchMovies() {
  try {
    let res;
    if (movieId) {
      res = await fetch(`/api/movie/${movieId}`);
      const movie = await res.json();
      const moviesContainer = document.getElementById('movies');
      moviesContainer.innerHTML = '';

      const card = document.createElement('div');
      card.className = "bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition transform max-w-md mx-auto";

      // image
      if (movie.poster_path) {
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        img.alt = movie.title;
        img.className = "rounded-lg shadow-md mb-4"; // cadre et ombre
        card.appendChild(img);
      }

      // titre
      const title = document.createElement('h3');
      title.textContent = movie.title;
      title.className = "font-dosis text-xl font-bold text-fuchsia-300 text-center mb-2";
      card.appendChild(title);

      // release date
      if (movie.release_date) {
        const release = document.createElement('p');
        release.textContent = `Date de sortie: ${movie.release_date}`;
        release.className = "font-dosis text-sm text-white text-center mb-2";
        card.appendChild(release);
      }

      // genres
      if (movie.genres && movie.genres.length > 0) {
        const genres = document.createElement('p');
        genres.textContent = `Genres: ${movie.genres.map(g => g.name).join(', ')}`;
        genres.className = "font-dosis text-sm text-white text-center mb-2";
        card.appendChild(genres);
      }

      // description
      if (movie.overview) {
        const overview = document.createElement('p');
        overview.textContent = movie.overview;
        overview.className = "font-dosis text-sm text-white text-center mt-2";
        card.appendChild(overview);
      }

      moviesContainer.appendChild(card);
    } else {
      res = await fetch(`/api/movies?page=${page}`);
      const movies = await res.json();

      const moviesContainer = document.getElementById('movies');
      moviesContainer.innerHTML = '';
      console.log(movies);

      movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = "bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition transform";

        // image
        if (movie.poster_path) {
          const img = document.createElement('img');
          img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
          img.alt = movie.title;
          img.className = "rounded-lg shadow-md mb-4"; // cadre et ombre
          card.appendChild(img);
        }

        // titre
        const title = document.createElement('h3');
        title.textContent = movie.title;
        title.className = "font-dosis text-xl font-bold text-fuchsia-300 text-center";
        card.appendChild(title);

        moviesContainer.appendChild(card);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// pagination
document.getElementById('prev-top').addEventListener('click', () => {
  if (page > 1) {
    page--;
    fetchMovies();
  }
});
document.getElementById('next-top').addEventListener('click', () => {
  page++;
  fetchMovies();
});

document.getElementById('prev-bottom').addEventListener('click', () => {
  if (page > 1) {
    page--;
    fetchMovies();
  }
});
document.getElementById('next-bottom').addEventListener('click', () => {
  page++;
  fetchMovies();
});

document.addEventListener('DOMContentLoaded', () => {
const pseudo = localStorage.getItem('userPseudo') || "Guest";    
    if (pseudo) {
        const welcomeMessage = document.getElementById('welcome-msg');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Nice to see you again, ${pseudo} !`;
        }
    } else {
        //window.location.href = '/';
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/';
        });
    }

    if (movieId) {
      document.getElementById('prev-top').style.display = 'none';
      document.getElementById('next-top').style.display = 'none';
      document.getElementById('prev-bottom').style.display = 'none';
      document.getElementById('next-bottom').style.display = 'none';
      document.getElementById('searchInput').style.display = 'none';
      document.getElementById('searchBtn').style.display = 'none';
    }
});

document.getElementById('avatarBtn').addEventListener('click', () => {
  window.location.href = '/profile'
});

fetchMovies();


const moviesContainer = document.getElementById("movies");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

