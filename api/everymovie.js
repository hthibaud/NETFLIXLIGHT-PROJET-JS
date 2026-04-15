let page = 1;
let sort = "popularity.desc";
let language = "en-US";
let currentSearch = "";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

function toggleSearchAndPagination(visible) {
  const ids = [
    "searchInput",
    "searchBtn",
    "prev-top",
    "next-top",
    "prev-bottom",
    "next-bottom",
  ];
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = visible ? "" : "none";
    }
  });
}

//sets the pages titles
function setPageTitle(title) {
  const titleEl = document.getElementById("pageTitle");
  if (titleEl) {
    titleEl.textContent = title;
  }
}

//fetches movies and shows detailed infos
async function fetchMovies(searchQuery = "") {
  currentSearch = searchQuery;
  try {
    let res;
    if (movieId) {
      toggleSearchAndPagination(false);
      res = await fetch(`/api/movie/${movieId}`);
      const movie = await res.json();
      setPageTitle(movie.title || "Détails du film");
      const moviesContainer = document.getElementById("movies");
      moviesContainer.className = "grid grid-cols-1 gap-6";
      moviesContainer.innerHTML = "";

      const card = document.createElement("div");
      card.className = "bg-slate-800 p-8 rounded-lg shadow-lg w-full";

      // Top section: image left, info right
      const topSection = document.createElement("div");
      topSection.className =
        "grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-6";

      // Image block
      const imageCol = document.createElement("div");
      imageCol.className = "flex justify-center lg:justify-start";

      if (movie.poster_path) {
        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        img.alt = movie.title;
        img.className = "rounded-lg shadow-md w-72 h-auto object-cover";
        imageCol.appendChild(img);
      }

      topSection.appendChild(imageCol);

      // Info block
      const infoCol = document.createElement("div");
      infoCol.className = "space-y-6";

      const titleContainer = document.createElement("div");
      titleContainer.className = "flex flex-wrap items-center gap-4 mb-4";

      const title = document.createElement("h3");
      title.textContent = movie.title;
      title.className = "font-dosis text-4xl font-bold text-fuchsia-400";
      titleContainer.appendChild(title);

      const btnGroup = document.createElement("div");
      btnGroup.className = "flex gap-2";

      // shows the icons "star" for favorites and the icon for watchlist
      btnGroup.innerHTML = `
  <button id="fav-detail-btn" class="bg-slate-700 hover:bg-fuchsia-600 text-white p-2 rounded-lg transition-all shadow-md group" title="Add to Favorites">
    <i data-lucide="star" class="w-6 h-6 group-hover:fill-current"></i>
  </button>
  <button id="watch-detail-btn" class="bg-slate-700 hover:bg-fuchsia-600 text-white p-2 rounded-lg transition-all shadow-md group" title="Add to Watchlist">
    <i data-lucide="bookmark" class="w-6 h-6 group-hover:fill-current"></i>
  </button>
`;

      // adds the title + the infos in the details infos container
      titleContainer.appendChild(btnGroup);
      infoCol.appendChild(titleContainer);

      const quickInfoGrid = document.createElement("div");
      quickInfoGrid.className = "grid grid-cols-1 sm:grid-cols-2 gap-4";

      const genreDateBox = document.createElement("div");
      genreDateBox.className =
        "bg-slate-700 p-5 rounded-xl border-l-4 border-fuchsia-400 h-full";

      if (movie.genres && movie.genres.length > 0) {
        const genresTitle = document.createElement("p");
        genresTitle.textContent = "Genre";
        genresTitle.className =
          "font-dosis text-2xl font-bold text-fuchsia-400 mb-2";
        genreDateBox.appendChild(genresTitle);

        const genres = document.createElement("p");
        genres.textContent = movie.genres.map((g) => g.name).join(", ");
        genres.className =
          "font-dosis text-sm text-gray-100 mb-4 leading-tight";
        genreDateBox.appendChild(genres);
      }
        // prints the date in the detailed infos
      if (movie.release_date) {
        const releaseInfo = document.createElement("p");
        releaseInfo.textContent = `Release date: ${movie.release_date}`;
        releaseInfo.className = "font-dosis text-sm text-gray-200";
        genreDateBox.appendChild(releaseInfo);
      }

      quickInfoGrid.appendChild(genreDateBox);

      const actionsBox = document.createElement("div");
      actionsBox.className =
        "bg-slate-700 p-5 rounded-xl border-l-4 border-fuchsia-400 flex flex-col justify-between gap-4";

      // prints the main actors in the detailed infos
      const actionLabel = document.createElement("p");
      actionLabel.textContent = "Main actors";
      actionLabel.className = "font-dosis text-2xl font-bold text-fuchsia-400";
      actionsBox.appendChild(actionLabel);

      const castGrid = document.createElement("div");
      castGrid.className = "grid grid-cols-2 gap-3";

      if (
        movie.credits &&
        movie.credits.cast &&
        movie.credits.cast.length > 0
      ) {
        const topCast = movie.credits.cast.slice(0, 4);
        topCast.forEach((actor) => {
          const actorCard = document.createElement("div");
          actorCard.className = "text-center";

          if (actor.profile_path) {
            const actorImg = document.createElement("img");
            actorImg.src = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;
            actorImg.alt = actor.name;
            actorImg.className =
              "w-16 h-16 rounded-full object-cover mb-1 border-2 border-fuchsia-400 mx-auto";
            actorCard.appendChild(actorImg);
          }

          const actorName = document.createElement("p");
          actorName.textContent = actor.name;
          actorName.className = "font-dosis text-xs text-white";
          actorCard.appendChild(actorName);

          castGrid.appendChild(actorCard);
        });
      }

      actionsBox.appendChild(castGrid);

      // "show more infos" button
      if (
        movie.credits &&
        movie.credits.cast &&
        movie.credits.cast.length > 4
      ) {
        const moreBtn = document.createElement("button");
        moreBtn.textContent = "Show more";
        moreBtn.className =
          "font-dosis text-sm text-fuchsia-400 hover:text-fuchsia-300 underline mt-2 self-center";
        moreBtn.id = "show-more-cast";
        actionsBox.appendChild(moreBtn);
      }

      actionsBox.appendChild(castGrid);
      quickInfoGrid.appendChild(actionsBox);
      infoCol.appendChild(quickInfoGrid);

      if (movie.overview) {
        const descSection = document.createElement("div");
        descSection.className =
          "bg-slate-700 p-6 rounded-xl border-l-4 border-fuchsia-400";
        
        // prints the synopsys of the movie in the detailed infos
        const descTitle = document.createElement("h4");
        descTitle.textContent = "Synopsys";
        descTitle.className =
          "font-dosis text-2xl font-bold text-fuchsia-400 mb-3";
        descSection.appendChild(descTitle);

        const overview = document.createElement("p");
        overview.textContent = movie.overview;
        overview.className = "font-dosis text-sm text-gray-100 leading-relaxed";
        descSection.appendChild(overview);

        infoCol.appendChild(descSection);
      }

      topSection.appendChild(infoCol);
      card.appendChild(topSection);

      // Additional details section
      const detailsSection = document.createElement("div");
      detailsSection.className =
        "bg-slate-700 p-6 rounded-xl border-l-4 border-fuchsia-400";

      const detailsTitle = document.createElement("h4");
      detailsTitle.textContent = "More infos";
      detailsTitle.className =
        "font-dosis text-2xl font-bold text-fuchsia-400 mb-4";
      detailsSection.appendChild(detailsTitle);

      const detailsGrid = document.createElement("div");
      detailsGrid.className = "grid grid-cols-2 md:grid-cols-4 gap-4";

      // Additional details section
      const moreGrid = document.createElement("div");
      moreGrid.className = "grid grid-cols-2 md:grid-cols-4 gap-4";

      // Injects the HtML with the lucid icons
      moreGrid.innerHTML = `
        <div class="text-center flex flex-col items-center">
          <i data-lucide="star" class="text-yellow-400 w-8 h-8 mb-2"></i>
          <p class="font-dosis text-sm font-bold text-white">${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}/10</p>
          <p class="font-dosis text-xs text-gray-300">Mark</p>
        </div>

        <div class="text-center flex flex-col items-center">
          <i data-lucide="clock" class="text-slate-300 w-8 h-8 mb-2"></i>
          <p class="font-dosis text-sm font-bold text-white">${movie.runtime || "N/A"} min</p>
          <p class="font-dosis text-xs text-gray-300">Duration</p>
        </div>

        <div class="text-center flex flex-col items-center">
          <i data-lucide="languages" class="text-blue-400 w-8 h-8 mb-2"></i>
          <p class="font-dosis text-sm font-bold text-white">${movie.original_language ? movie.original_language.toUpperCase() : "??"}</p>
          <p class="font-dosis text-xs text-gray-300">Language</p>
        </div>

        <div class="text-center flex flex-col items-center">
          <i data-lucide="flame" class="text-orange-500 w-8 h-8 mb-2"></i>
          <p class="font-dosis text-sm font-bold text-white">${movie.popularity ? Math.round(movie.popularity) : "0"}</p>
          <p class="font-dosis text-xs text-gray-300">Popularity</p>
        </div>
      `;

      detailsSection.appendChild(moreGrid);
      card.appendChild(detailsSection);

      // Full cast section (hidden by default)
      if (
        movie.credits &&
        movie.credits.cast &&
        movie.credits.cast.length > 4
      ) {
        const fullCastSection = document.createElement("div");
        fullCastSection.className =
          "bg-slate-700 p-6 rounded-xl border-l-4 border-fuchsia-400 hidden";
        fullCastSection.id = "full-cast-section";

        const fullCastTitle = document.createElement("h4");
        fullCastTitle.textContent = "Full distribution";
        fullCastTitle.className =
          "font-dosis text-xl font-bold text-fuchsia-400 mb-4";
        fullCastSection.appendChild(fullCastTitle);

        const fullCastGrid = document.createElement("div");
        fullCastGrid.className =
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

        movie.credits.cast.forEach((actor) => {
          const actorCard = document.createElement("div");
          actorCard.className = "bg-slate-600 p-3 rounded-lg";

          const actorHeader = document.createElement("div");
          actorHeader.className = "flex items-center gap-3 mb-2";

          if (actor.profile_path) {
            const actorImg = document.createElement("img");
            actorImg.src = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;
            actorImg.alt = actor.name;
            actorImg.className =
              "w-12 h-12 rounded-full object-cover border-2 border-fuchsia-400";
            actorHeader.appendChild(actorImg);
          }

          const actorInfo = document.createElement("div");
          actorInfo.className = "flex-1";

          const actorName = document.createElement("p");
          actorName.textContent = actor.name;
          actorName.className = "font-dosis text-sm font-bold text-white";
          actorInfo.appendChild(actorName);

          if (actor.character) {
            const characterName = document.createElement("p");
            characterName.textContent = `Role: ${actor.character}`;
            characterName.className = "font-dosis text-xs text-gray-300";
            actorInfo.appendChild(characterName);
          }

          actorHeader.appendChild(actorInfo);
          actorCard.appendChild(actorHeader);
          fullCastGrid.appendChild(actorCard);
        });

        fullCastSection.appendChild(fullCastGrid);

        // "show less" button
        const lessBtn = document.createElement("button");
        lessBtn.textContent = "Show less";
        lessBtn.className =
          "font-dosis text-sm text-fuchsia-400 hover:text-fuchsia-300 underline mt-4 block mx-auto";
        lessBtn.id = "show-less-cast";
        fullCastSection.appendChild(lessBtn);

        card.appendChild(fullCastSection);
      }

      moviesContainer.appendChild(card);
      lucide.createIcons();

      const favDetailBtn = document.getElementById("fav-detail-btn");
      const watchDetailBtn = document.getElementById("watch-detail-btn");

      if (favDetailBtn) {
        favDetailBtn.addEventListener("click", (e) => {
          e.stopPropagation(); 
          addToCollection("favorites", movie);
        });
      }

      if (watchDetailBtn) {
        watchDetailBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          addToCollection("watchlist", movie);
        });
      }

      // Add event listeners for cast toggle
      const showMoreBtn = document.getElementById("show-more-cast");
      const showLessBtn = document.getElementById("show-less-cast");
      const fullCastSection = document.getElementById("full-cast-section");

      if (showMoreBtn && fullCastSection) {
        showMoreBtn.addEventListener("click", () => {
          fullCastSection.classList.remove("hidden");
          showMoreBtn.style.display = "none";
        });
      }

      if (showLessBtn && fullCastSection) {
        showLessBtn.addEventListener("click", () => {
          fullCastSection.classList.add("hidden");
          if (showMoreBtn) showMoreBtn.style.display = "block";
        });
      }
    } else {
      if (searchQuery) {
        res = await fetch(
          `/api/search?query=${encodeURIComponent(searchQuery)}&page=${page}`,
        );
      } else {
        res = await fetch(`/api/movies?page=${page}`);
      }
      const movies = await res.json();

      const moviesContainer = document.getElementById("movies");
      moviesContainer.innerHTML = "";
      if (searchQuery) {
        setPageTitle(`Results for : ${searchQuery}`);
        console.log("Search:", searchQuery, movies);
      } else {
        setPageTitle("All movies");
      }

      if (!movies || movies.length === 0) {
        const message = document.createElement("p");
        message.className =
          "font-dosis text-lg text-white text-center col-span-full";
        message.textContent = searchQuery
          ? `No movie found for « ${searchQuery} »`
          : "Aucun film disponible.";
        moviesContainer.appendChild(message);
        return;
      }

      movies.forEach((movie) => {
        const card = document.createElement("div");
        card.className =
          "bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition transform cursor-pointer";
        card.style.cursor = "pointer";

        // image
        if (movie.poster_path) {
          const img = document.createElement("img");
          img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
          img.alt = movie.title;
          img.className = "rounded-lg shadow-md mb-4";
          card.appendChild(img);
        }

        //title
        const title = document.createElement("h3");
        title.textContent = movie.title;
        title.className = "font-dosis text-xl text-fuchsia-300 text-center";
        card.appendChild(title);

        card.addEventListener("click", () => {
          window.location.href = `${window.location.pathname}?id=${movie.id}`;
        });

        moviesContainer.appendChild(card);
        lucide.createIcons();
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// pagination
const prevTop = document.getElementById("prev-top");
const nextTop = document.getElementById("next-top");
const prevBottom = document.getElementById("prev-bottom");
const nextBottom = document.getElementById("next-bottom");

if (prevTop) {
  prevTop.addEventListener("click", () => {
    if (page > 1) {
      page--;
      fetchMovies(currentSearch);
    }
  });
}

if (nextTop) {
  nextTop.addEventListener("click", () => {
    page++;
    fetchMovies(currentSearch);
  });
}

if (prevBottom) {
  prevBottom.addEventListener("click", () => {
    if (page > 1) {
      page--;
      fetchMovies(currentSearch);
    }
  });
}

if (nextBottom) {
  nextBottom.addEventListener("click", () => {
    page++;
    fetchMovies(currentSearch);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const pseudo = localStorage.getItem("userPseudo") || "Guest";
  if (pseudo) {
    const welcomeMessage = document.getElementById("welcome-msg");
    if (welcomeMessage) {
      welcomeMessage.textContent = `Nice to see you again, ${pseudo} !`;
    }
  } else {
    //window.location.href = '/';
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "/";
    });
  }

  if (movieId) {
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.href = "/allmovies";
      });
    }
  }
});

const avatarBtn = document.getElementById("avatarBtn");
if (avatarBtn) {
  avatarBtn.addEventListener("click", () => {
    window.location.href = "/profile";
  });
}

// Ensure DOM is ready before fetching movies
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const moviesContainer = document.getElementById("movies");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    if (searchInput && searchBtn) {
      searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (!query) {
          page = 1;
          fetchMovies();
          return;
        }
        page = 1;
        fetchMovies(query);
      });

      searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
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
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (!query) {
        page = 1;
        fetchMovies();
        return;
      }
      page = 1;
      fetchMovies(query);
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
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


// adds movies to the collection (either favorites or watchlist)
async function addToCollection(type, movie) {
  const username = localStorage.getItem("userPseudo");
  if (!username || username === "Guest") {
    alert("Please log in to add movies to your lists!");
    return;
  }

  try {
    const res = await fetch(`/api/${type}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        movie_id: movie.id,
        title: movie.title,
        poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert(`${movie.title} ${data.message}`);
    } else {
      alert("Error: " + (data.message || "Could not add movie"));
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Connection error to the server");
  }
}
