let page = 1;
let sort = 'popularity.desc';
let language = 'fr-FR';

async function fetchMovies() {
  try {
    const res = await fetch(`/api/movies?page=${page}`);
    const movies = await res.json();

    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = ''; // reset container
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
  } catch (err) {
    console.error(err);
  }
}

// pagination
document.getElementById('prev').addEventListener('click', () => {
  if (page > 1) {
    page--;
    fetchMovies();
  }
});
document.getElementById('next').addEventListener('click', () => {
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
        // window.location.href = '/';
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/';
        });
    }
});

document.getElementById('avatarBtn').addEventListener('click', () => {
  window.location.href = '/profile'
});

// fetch initial
fetchMovies();
