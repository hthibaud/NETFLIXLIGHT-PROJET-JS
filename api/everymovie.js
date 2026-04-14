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
      moviesContainer.className = 'grid grid-cols-1 gap-6';
      moviesContainer.innerHTML = '';

      const card = document.createElement('div');
      card.className = "bg-slate-800 p-8 rounded-lg shadow-lg w-full";

      // Top section: image left, info right
      const topSection = document.createElement('div');
      topSection.className = "grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-6";

      // Image block
      const imageCol = document.createElement('div');
      imageCol.className = "flex justify-center lg:justify-start";

      if (movie.poster_path) {
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        img.alt = movie.title;
        img.className = "rounded-lg shadow-md w-72 h-auto object-cover";
        imageCol.appendChild(img);
      }

      topSection.appendChild(imageCol);

      // Info block
      const infoCol = document.createElement('div');
      infoCol.className = "space-y-6";

      const title = document.createElement('h3');
      title.textContent = movie.title;
      title.className = "font-dosis text-4xl font-bold text-fuchsia-300";
      infoCol.appendChild(title);

      const quickInfoGrid = document.createElement('div');
      quickInfoGrid.className = "grid grid-cols-1 sm:grid-cols-2 gap-4";

      const genreDateBox = document.createElement('div');
      genreDateBox.className = "bg-slate-700 p-5 rounded-xl border-l-4 border-fuchsia-500 h-full";

      if (movie.genres && movie.genres.length > 0) {
        const genresTitle = document.createElement('p');
        genresTitle.textContent = '🎬 Genre';
        genresTitle.className = "font-dosis text-sm font-bold text-fuchsia-300 mb-2";
        genreDateBox.appendChild(genresTitle);

        const genres = document.createElement('p');
        genres.textContent = movie.genres.map(g => g.name).join(', ');
        genres.className = "font-dosis text-sm text-gray-100 mb-4 leading-tight";
        genreDateBox.appendChild(genres);
      }

      if (movie.release_date) {
        const releaseInfo = document.createElement('p');
        releaseInfo.textContent = `📅 ${movie.release_date}`;
        releaseInfo.className = "font-dosis text-sm text-gray-200";
        genreDateBox.appendChild(releaseInfo);
      }

      quickInfoGrid.appendChild(genreDateBox);

      const actionsBox = document.createElement('div');
      actionsBox.className = "bg-slate-700 p-5 rounded-xl border-l-4 border-fuchsia-500 flex flex-col justify-between gap-4";

      const actionLabel = document.createElement('p');
      actionLabel.textContent = 'Acteurs principaux';
      actionLabel.className = "font-dosis text-sm font-bold text-fuchsia-300";
      actionsBox.appendChild(actionLabel);

      const castGrid = document.createElement('div');
      castGrid.className = "grid grid-cols-2 gap-3";

      if (movie.credits && movie.credits.cast && movie.credits.cast.length > 0) {
        const topCast = movie.credits.cast.slice(0, 4);
        topCast.forEach(actor => {
          const actorCard = document.createElement('div');
          actorCard.className = "text-center";

          if (actor.profile_path) {
            const actorImg = document.createElement('img');
            actorImg.src = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;
            actorImg.alt = actor.name;
            actorImg.className = "w-16 h-16 rounded-full object-cover mb-1 border-2 border-fuchsia-400 mx-auto";
            actorCard.appendChild(actorImg);
          }

          const actorName = document.createElement('p');
          actorName.textContent = actor.name;
          actorName.className = "font-dosis text-xs text-white";
          actorCard.appendChild(actorName);

          castGrid.appendChild(actorCard);
        });
      }

      actionsBox.appendChild(castGrid);

      // Bouton "Afficher plus"
      if (movie.credits && movie.credits.cast && movie.credits.cast.length > 4) {
        const moreBtn = document.createElement('button');
        moreBtn.textContent = 'Afficher plus';
        moreBtn.className = "font-dosis text-sm text-fuchsia-400 hover:text-fuchsia-300 underline mt-2 self-center";
        moreBtn.id = 'show-more-cast';
        actionsBox.appendChild(moreBtn);
      }

      actionsBox.appendChild(castGrid);
      quickInfoGrid.appendChild(actionsBox);
      infoCol.appendChild(quickInfoGrid);

      if (movie.overview) {
        const descSection = document.createElement('div');
        descSection.className = "bg-slate-700 p-6 rounded-xl border-l-4 border-fuchsia-500";

        const descTitle = document.createElement('h4');
        descTitle.textContent = 'Description du film';
        descTitle.className = "font-dosis text-xl font-bold text-fuchsia-300 mb-3";
        descSection.appendChild(descTitle);

        const overview = document.createElement('p');
        overview.textContent = movie.overview;
        overview.className = "font-dosis text-sm text-gray-100 leading-relaxed";
        descSection.appendChild(overview);

        infoCol.appendChild(descSection);
      }

      topSection.appendChild(infoCol);
      card.appendChild(topSection);

      // Additional details section
      const detailsSection = document.createElement('div');
      detailsSection.className = "bg-slate-700 p-6 rounded-xl border-l-4 border-fuchsia-500";

      const detailsTitle = document.createElement('h4');
      detailsTitle.textContent = 'Détails supplémentaires';
      detailsTitle.className = "font-dosis text-xl font-bold text-fuchsia-300 mb-4";
      detailsSection.appendChild(detailsTitle);

      const detailsGrid = document.createElement('div');
      detailsGrid.className = "grid grid-cols-2 md:grid-cols-4 gap-4";

      // Note moyenne
      if (movie.vote_average) {
        const ratingBox = document.createElement('div');
        ratingBox.className = "text-center";

        const ratingIcon = document.createElement('p');
        ratingIcon.textContent = '⭐';
        ratingIcon.className = "text-2xl mb-1";
        ratingBox.appendChild(ratingIcon);

        const ratingValue = document.createElement('p');
        ratingValue.textContent = `${movie.vote_average.toFixed(1)}/10`;
        ratingValue.className = "font-dosis text-sm font-bold text-white";
        ratingBox.appendChild(ratingValue);

        const ratingLabel = document.createElement('p');
        ratingLabel.textContent = 'Note';
        ratingLabel.className = "font-dosis text-xs text-gray-300";
        ratingBox.appendChild(ratingLabel);

        detailsGrid.appendChild(ratingBox);
      }

      // Durée
      if (movie.runtime) {
        const runtimeBox = document.createElement('div');
        runtimeBox.className = "text-center";

        const runtimeIcon = document.createElement('p');
        runtimeIcon.textContent = '⏱️';
        runtimeIcon.className = "text-2xl mb-1";
        runtimeBox.appendChild(runtimeIcon);

        const runtimeValue = document.createElement('p');
        runtimeValue.textContent = `${movie.runtime} min`;
        runtimeValue.className = "font-dosis text-sm font-bold text-white";
        runtimeBox.appendChild(runtimeValue);

        const runtimeLabel = document.createElement('p');
        runtimeLabel.textContent = 'Durée';
        runtimeLabel.className = "font-dosis text-xs text-gray-300";
        runtimeBox.appendChild(runtimeLabel);

        detailsGrid.appendChild(runtimeBox);
      }

      // Langue originale
      if (movie.original_language) {
        const languageBox = document.createElement('div');
        languageBox.className = "text-center";

        const languageIcon = document.createElement('p');
        languageIcon.textContent = '🌍';
        languageIcon.className = "text-2xl mb-1";
        languageBox.appendChild(languageIcon);

        const languageValue = document.createElement('p');
        languageValue.textContent = movie.original_language.toUpperCase();
        languageValue.className = "font-dosis text-sm font-bold text-white";
        languageBox.appendChild(languageValue);

        const languageLabel = document.createElement('p');
        languageLabel.textContent = 'Langue';
        languageLabel.className = "font-dosis text-xs text-gray-300";
        languageBox.appendChild(languageLabel);

        detailsGrid.appendChild(languageBox);
      }

      // Popularité
      if (movie.popularity) {
        const popularityBox = document.createElement('div');
        popularityBox.className = "text-center";

        const popularityIcon = document.createElement('p');
        popularityIcon.textContent = '🔥';
        popularityIcon.className = "text-2xl mb-1";
        popularityBox.appendChild(popularityIcon);

        const popularityValue = document.createElement('p');
        popularityValue.textContent = Math.round(movie.popularity);
        popularityValue.className = "font-dosis text-sm font-bold text-white";
        popularityBox.appendChild(popularityValue);

        const popularityLabel = document.createElement('p');
        popularityLabel.textContent = 'Popularité';
        popularityLabel.className = "font-dosis text-xs text-gray-300";
        popularityBox.appendChild(popularityLabel);

        detailsGrid.appendChild(popularityBox);
      }

      detailsSection.appendChild(detailsGrid);
      card.appendChild(detailsSection);

      // Full cast section (hidden by default)
      if (movie.credits && movie.credits.cast && movie.credits.cast.length > 4) {
        const fullCastSection = document.createElement('div');
        fullCastSection.className = "bg-slate-700 p-6 rounded-xl border-l-4 border-fuchsia-500 hidden";
        fullCastSection.id = 'full-cast-section';

        const fullCastTitle = document.createElement('h4');
        fullCastTitle.textContent = 'Distribution complète';
        fullCastTitle.className = "font-dosis text-xl font-bold text-fuchsia-300 mb-4";
        fullCastSection.appendChild(fullCastTitle);

        const fullCastGrid = document.createElement('div');
        fullCastGrid.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

        movie.credits.cast.forEach(actor => {
          const actorCard = document.createElement('div');
          actorCard.className = "bg-slate-600 p-3 rounded-lg";

          const actorHeader = document.createElement('div');
          actorHeader.className = "flex items-center gap-3 mb-2";

          if (actor.profile_path) {
            const actorImg = document.createElement('img');
            actorImg.src = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;
            actorImg.alt = actor.name;
            actorImg.className = "w-12 h-12 rounded-full object-cover border-2 border-fuchsia-400";
            actorHeader.appendChild(actorImg);
          }

          const actorInfo = document.createElement('div');
          actorInfo.className = "flex-1";

          const actorName = document.createElement('p');
          actorName.textContent = actor.name;
          actorName.className = "font-dosis text-sm font-bold text-white";
          actorInfo.appendChild(actorName);

          if (actor.character) {
            const characterName = document.createElement('p');
            characterName.textContent = `rôle: ${actor.character}`;
            characterName.className = "font-dosis text-xs text-gray-300";
            actorInfo.appendChild(characterName);
          }

          actorHeader.appendChild(actorInfo);
          actorCard.appendChild(actorHeader);
          fullCastGrid.appendChild(actorCard);
        });

        fullCastSection.appendChild(fullCastGrid);

        // Bouton "Afficher moins"
        const lessBtn = document.createElement('button');
        lessBtn.textContent = 'Afficher moins';
        lessBtn.className = "font-dosis text-sm text-fuchsia-400 hover:text-fuchsia-300 underline mt-4 block mx-auto";
        lessBtn.id = 'show-less-cast';
        fullCastSection.appendChild(lessBtn);

        card.appendChild(fullCastSection);
      }

      moviesContainer.appendChild(card);

      // Add event listeners for cast toggle
      const showMoreBtn = document.getElementById('show-more-cast');
      const showLessBtn = document.getElementById('show-less-cast');
      const fullCastSection = document.getElementById('full-cast-section');

      if (showMoreBtn && fullCastSection) {
        showMoreBtn.addEventListener('click', () => {
          fullCastSection.classList.remove('hidden');
          showMoreBtn.style.display = 'none';
        });
      }

      if (showLessBtn && fullCastSection) {
        showLessBtn.addEventListener('click', () => {
          fullCastSection.classList.add('hidden');
          if (showMoreBtn) showMoreBtn.style.display = 'block';
        });
      }
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

