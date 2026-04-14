let page = 1;
let sort = 'popularity.desc';
let language = 'en-US';
let currentSearch = '';

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

function toggleSearchAndPagination(visible) {
  const ids = ['searchInput', 'searchBtn', 'prev-top', 'next-top', 'prev-bottom', 'next-bottom'];
  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = visible ? '' : 'none';
    }
  });
}

function setPageTitle(title) {
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) {
    titleEl.textContent = title;
  }
}

async function fetchMovies(searchQuery = '') {
  currentSearch = searchQuery;
  try {
    let res;
    if (movieId) {
      toggleSearchAndPagination(false);
      res = await fetch(`/api/movie/${movieId}`);
      const movie = await res.json();
      setPageTitle(movie.title || 'Détails du film');
      const moviesContainer = document.getElementById('movies');
      moviesContainer.innerHTML = '';

      const card = document.createElement('div');
      card.className = "bg-slate-800 p-6 rounded-lg shadow-lg flex gap-8 max-w-6xl mx-auto";

      // Image column
      const imageCol = document.createElement('div');
      imageCol.className = "flex-shrink-0";

      if (movie.poster_path) {
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        img.alt = movie.title;
        img.className = "rounded-lg shadow-md w-64 h-96 object-cover";
        imageCol.appendChild(img);
      }

      card.appendChild(imageCol);

      // Details column
      const detailsCol = document.createElement('div');
      detailsCol.className = "flex-1 flex flex-col gap-5";

      // Section: Title
      const titleSection = document.createElement('div');
      titleSection.className = "bg-slate-700 p-4 rounded-lg";
      const title = document.createElement('h3');
      title.textContent = movie.title;
      title.className = "font-dosis text-3xl font-bold text-fuchsia-300";
      titleSection.appendChild(title);
      detailsCol.appendChild(titleSection);

      // Section: Info (Release date + Genres)
      const infoSection = document.createElement('div');
      infoSection.className = "bg-slate-700 p-4 rounded-lg";

      if (movie.release_date) {
        const release = document.createElement('p');
        release.textContent = `📅 Date de sortie: ${movie.release_date}`;
        release.className = "font-dosis text-sm text-gray-200 mb-2";
        infoSection.appendChild(release);
      }

      if (movie.genres && movie.genres.length > 0) {
        const genres = document.createElement('p');
        genres.textContent = `🎬 Genres: ${movie.genres.map(g => g.name).join(', ')}`;
        genres.className = "font-dosis text-sm text-gray-200";
        infoSection.appendChild(genres);
      }

      detailsCol.appendChild(infoSection);

      // Section: Description
      if (movie.overview) {
        const descSection = document.createElement('div');
        descSection.className = "bg-slate-700 p-4 rounded-lg";

        const descTitle = document.createElement('h4');
        descTitle.textContent = 'Synopsis';
        descTitle.className = "font-dosis text-sm font-bold text-fuchsia-300 mb-2";
        descSection.appendChild(descTitle);

        const overview = document.createElement('p');
        overview.textContent = movie.overview;
        overview.className = "font-dosis text-xs text-gray-100 leading-relaxed";
        descSection.appendChild(overview);

        detailsCol.appendChild(descSection);
      }

      // Section: Casting
      if (movie.credits && movie.credits.cast && movie.credits.cast.length > 0) {
        const castSection = document.createElement('div');
        castSection.className = "bg-slate-700 p-4 rounded-lg";
        
        const castTitle = document.createElement('h4');
        castTitle.textContent = 'Casting';
        castTitle.className = "font-dosis text-sm font-bold text-fuchsia-300 mb-3";
        castSection.appendChild(castTitle);

        const castGrid = document.createElement('div');
        castGrid.className = "flex flex-wrap gap-3";

        const topCast = movie.credits.cast.slice(0, 6);
        topCast.forEach(actor => {
          const actorCard = document.createElement('div');
          actorCard.className = "text-center flex flex-col items-center";

          if (actor.profile_path) {
            const actorImg = document.createElement('img');
            actorImg.src = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;
            actorImg.alt = actor.name;
            actorImg.className = "w-16 h-16 rounded-full object-cover mb-1 border-2 border-fuchsia-400";
            actorCard.appendChild(actorImg);
          }

          const actorName = document.createElement('p');
          actorName.textContent = actor.name;
          actorName.className = "font-dosis text-xs text-white truncate w-20";
          actorCard.appendChild(actorName);

          castGrid.appendChild(actorCard);
        });

        castSection.appendChild(castGrid);
        detailsCol.appendChild(castSection);
      }

      card.appendChild(detailsCol);
      moviesContainer.appendChild(card);
    } else {
      if (searchQuery) {
        res = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}&page=${page}`);
      } else {
        res = await fetch(`/api/movies?page=${page}`);
      }
      const movies = await res.json();

      const moviesContainer = document.getElementById('movies');
      moviesContainer.innerHTML = '';
      if (searchQuery) {
        setPageTitle(`Résultats pour : ${searchQuery}`);
        console.log('Recherche:', searchQuery, movies);
      } else {
        setPageTitle('Tous les films');
      }

      if (!movies || movies.length === 0) {
        const message = document.createElement('p');
        message.className = "font-dosis text-lg text-white text-center col-span-full";
        message.textContent = searchQuery ? `Aucun film trouvé pour « ${searchQuery} »` : 'Aucun film disponible.';
        moviesContainer.appendChild(message);
        return;
      }

      movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = "bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition transform cursor-pointer";
        card.style.cursor = 'pointer';

        // image
        if (movie.poster_path) {
          const img = document.createElement('img');
          img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
          img.alt = movie.title;
          img.className = "rounded-lg shadow-md mb-4";
          card.appendChild(img);
        }
        
        //title
        const title = document.createElement('h3');
        title.textContent = movie.title;
        title.className = "font-dosis text-xl font-bold text-fuchsia-300 text-center";
        card.appendChild(title);

        card.addEventListener('click', () => {
          window.location.href = `${window.location.pathname}?id=${movie.id}`;
        });

        moviesContainer.appendChild(card);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// pagination
const prevTop = document.getElementById('prev-top');
const nextTop = document.getElementById('next-top');
const prevBottom = document.getElementById('prev-bottom');
const nextBottom = document.getElementById('next-bottom');

if (prevTop) {
  prevTop.addEventListener('click', () => {
    if (page > 1) {
      page--;
      fetchMovies(currentSearch);
    }
  });
}

if (nextTop) {
  nextTop.addEventListener('click', () => {
    page++;
    fetchMovies(currentSearch);
  });
}

if (prevBottom) {
  prevBottom.addEventListener('click', () => {
    if (page > 1) {
      page--;
      fetchMovies(currentSearch);
    }
  });
}

if (nextBottom) {
  nextBottom.addEventListener('click', () => {
    page++;
    fetchMovies(currentSearch);
  });
}

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
      const backBtn = document.getElementById('backBtn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          window.location.href = '/allmovies';
        });
      }
    }
});

const avatarBtn = document.getElementById('avatarBtn');
if (avatarBtn) {
  avatarBtn.addEventListener('click', () => {
    window.location.href = '/profile';
  });
}

// Ensure DOM is ready before fetching movies
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const moviesContainer = document.getElementById("movies");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    if (searchInput && searchBtn) {
      searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (!query) {
          page = 1;
          fetchMovies();
          return;
        }
        page = 1;
        fetchMovies(query);
      });

      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          searchBtn.click();
        }
      });
    }

    if (movieId) {
      toggleSearchAndPagination(false);
    }

    fetchMovies();
  });
} else {
  const moviesContainer = document.getElementById("movies");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (!query) {
        page = 1;
        fetchMovies();
        return;
      }
      page = 1;
      fetchMovies(query);
    });

    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchBtn.click();
      }
    });
  }

  if (movieId) {
    toggleSearchAndPagination(false);
  }

  fetchMovies();
}

