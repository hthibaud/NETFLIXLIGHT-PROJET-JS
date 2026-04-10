async function fetchHeroMovies() {
  try {
    const res = await fetch(`/api/movies?page=1&sort_by=popularity.desc`);
    const movies = await res.json();

    const slider = document.getElementById('hero-slider');
    slider.innerHTML = '';

    movies.slice(0, 10).forEach((movie, i) => {
      if (!movie.backdrop_path) return;

      const slide = document.createElement('div');
      slide.className = `
        hero-slide absolute inset-0 bg-cover bg-center
        transition-opacity duration-1000
        ${i === 0 ? 'opacity-100' : 'opacity-0'}
      `;

      slide.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

      // overlay contenu
      const overlay = document.createElement('div');
      overlay.className = "absolute inset-0 bg-black/50 flex flex-col justify-center items-start p-10";

      const title = document.createElement('h2');
      title.textContent = movie.title;
      title.className = "font-sekuya text-5xl text-fuchsia-400 mb-4";

      const overview = document.createElement('p');
      overview.textContent = movie.overview.substring(0, 150) + "...";
      overview.className = "font-dosis text-white max-w-xl";

      overlay.appendChild(title);
      overlay.appendChild(overview);
      slide.appendChild(overlay);

      slider.appendChild(slide);
    });

    startHeroSlider();

  } catch (err) {
    console.error(err);
  }
}

function startHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  let index = 0;

  setInterval(() => {
    slides[index].classList.replace('opacity-100', 'opacity-0');

    index = (index + 1) % slides.length;

    slides[index].classList.replace('opacity-0', 'opacity-100');
  }, 6000);
}

fetchHeroMovies();