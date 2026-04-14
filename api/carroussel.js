let page = 1;
let language = "fr-FR";

console.log("d:", document.getElementById("upcoming"));

//Upcoming movies, Popular movies, Top rated movies API calls
async function fetchMovies(category, containerId) {
  try {
    const res = await fetch(`/api/movies?category=${category}&page=${page}`);
    const movies = await res.json();

    const container = document.getElementById(containerId);
    container.innerHTML = "";

    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.className =
        "w-[300px] relative group bg-slate-800 p-3 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition transform flex-shrink-0 cursor-pointer";

      const imgContainer = document.createElement("div");
      imgContainer.className = "relative w-full";

      if (movie.poster_path) {
        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        img.className = "rounded-lg shadow-md mb-2 w-full";
        imgContainer.appendChild(img);
      }

      const overlay = document.createElement("div");
      overlay.className =
        "absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20";

      overlay.innerHTML = `
    <button class="fav-btn bg-black/60 p-2 rounded-full hover:bg-fuchsia-600 text-white transition-colors" title="Add to Favorites">
      <i data-lucide="star" class="w-5 h-5"></i>
    </button>
    <button class="watch-btn bg-black/60 p-2 rounded-full hover:bg-fuchsia-600 text-white transition-colors" title="Add to Watchlist">
      <i data-lucide="bookmark" class="w-5 h-5"></i>
    </button>
`;

      lucide.createIcons();

      imgContainer.appendChild(overlay);
      card.appendChild(imgContainer);

      const title = document.createElement("h3");
      title.textContent = movie.title;
      title.className = "font-dosis text-sm text-fuchsia-300 text-center mt-2";
      card.appendChild(title);

      card.addEventListener("click", (e) => {
        const isButton = e.target.closest("button");

        if (isButton) {
          e.stopPropagation();

          if (isButton.title === "Add to Favorites") {
            addToCollection("favorites", movie);
          } else if (isButton.title === "Add to Watchlist") {
            addToCollection("watchlist", movie);
          }
          return;
        }

        window.location.href = `/allmovies?id=${movie.id}`;
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("avatarBtn").addEventListener("click", () => {
  window.location.href = "/profile";
});

document.getElementById("avatar2Btn").addEventListener("click", () => {
  window.location.href = "/profile";
});

fetchMovies("upcoming", "upcoming");
fetchMovies("popular", "popular");
fetchMovies("top_rated", "top-rated");
fetchMovies("now_playing", "now_playing");
fetchMoviesByGenre(28, "action"); // Action
fetchMoviesByGenre(35, "comedy"); // Comedy
fetchMoviesByGenre(18, "drama"); // Drama

//Genres API call

// FETCH MOVIES BY GENRE
async function fetchMoviesByGenre(genreId, containerId) {
  try {
    const res = await fetch(`/api/movies?genre=${genreId}&page=${page}`);
    const movies = await res.json();

    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.className = `
        min-w-[300px] relative group
        bg-slate-800 p-3 rounded-lg shadow-lg 
        flex flex-col items-center 
        hover:scale-105 transition transform
      `;

      const imgContainer = document.createElement("div");
      imgContainer.className = "relative w-full";

      if (movie.poster_path) {
        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        img.className = "rounded-lg shadow-md mb-2";
        card.appendChild(img);
        imgContainer.appendChild(img);
      }

      const overlay = document.createElement("div");
      overlay.className =
        "absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300";

      overlay.innerHTML = `
    <button class="fav-btn bg-black/60 p-2 rounded-full hover:bg-fuchsia-600 text-white transition-colors" title="Add to Favorites">
      <i data-lucide="star" class="w-5 h-5"></i>
    </button>
    <button class="watch-btn bg-black/60 p-2 rounded-full hover:bg-fuchsia-600 text-white transition-colors" title="Add to Watchlist">
      <i data-lucide="bookmark" class="w-5 h-5"></i>
    </button>
`;

      lucide.createIcons();

      imgContainer.appendChild(overlay);
      card.appendChild(imgContainer);

      const title = document.createElement("h3");
      title.textContent = movie.title;
      title.className =
        "font-dosis text-sm text-fuchsia-400 text-center whitespace-normal";
      card.appendChild(title);

      card.addEventListener("click", (e) => {
        const isButton = e.target.closest("button");

        if (isButton) {
          e.stopPropagation();

          if (isButton.title === "Add to Favorites") {
            addToCollection("favorites", movie);
          } else if (isButton.title === "Add to Watchlist") {
            addToCollection("watchlist", movie);
          }
          return;
        }

        window.location.href = `/allmovies?id=${movie.id}`;
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erreur genre:", err);
  }
}

const favBtn = document.getElementById("fav-detail-btn");
const watchBtn = document.getElementById("watch-detail-btn");

if (favBtn) {
  favBtn.addEventListener("click", () => addToCollection("favorites", movie));
}

if (watchBtn) {
  watchBtn.addEventListener("click", () => addToCollection("watchlist", movie));
}

async function addToCollection(type, movie) {
  const username = localStorage.getItem("userPseudo");
  if (!username) {
    alert("Log into your account to add films!");
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
      alert(data.message);
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error("Erreur fetch:", err);
  }
}

async function removeFromCollection(type, movie) {
  const username = localStorage.getItem("userPseudo");
  if (!username) {
    alert("Log into your account to remove films!");
    return;
  }

  try {
    const res = await fetch(`/api/${type}/remove`, {
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
      alert(data.message);
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error("Erreur fetch:", err);
  }
}
