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
      const div = document.createElement('div');
      div.textContent = movie.title;
      moviesContainer.appendChild(div);
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

// fetch initial
fetchMovies();

// fetch initial
fetchMovies();
