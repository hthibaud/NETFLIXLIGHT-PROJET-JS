document.addEventListener('DOMContentLoaded', () => {
    const type = window.location.pathname.includes('fav') ? 'favorites' : 'watchlist';
    loadCollection(type);
});

async function loadCollection(type) {
    const pseudo = localStorage.getItem('userPseudo');
    const container = document.getElementById('movies-container');
    
    if (!pseudo || !container) return;

    try {
        const res = await fetch(`/api/${type}/${pseudo}`);
        const movies = await res.json();

        container.innerHTML = ""; 

        if (movies.length === 0) {
            container.innerHTML = `<p class="text-slate-400 text-xl font-dosis">Your ${type} list is empty.</p>`;
            return;
        }

        movies.forEach(movie => {
            const card = document.createElement('div');
            card.className = "min-w-[300px] relative bg-slate-800 p-3 rounded-lg flex flex-col items-center group shadow-2xl";
            
            card.innerHTML = `
                <div class="relative w-full">
                    <img src="${movie.movie_poster}" class="rounded-lg mb-2 w-full shadow-md">
                    
                    <button class="remove-btn absolute top-2 right-2 bg-red-600/90 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg" 
                            title="Remove from ${type}">
                        ✕
                    </button>
                </div>
                <h3 class="font-dosis text-sm text-fuchsia-300 text-center truncate w-full mt-2">${movie.movie_title}</h3>
            `;

            const removeBtn = card.querySelector('.remove-btn');
            removeBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                
                const movieData = { id: movie.movie_id }; 
                
                await removeFromCollection(type, movieData);
                loadCollection(type); 
            });

            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading collection:", err);
    }
}

async function removeFromCollection(type, movie) {
  const username = localStorage.getItem("userPseudo");

  try {
    const res = await fetch(`/api/${type}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        movie_id: movie.id
      }),
    });

    const data = await res.json();
    if (data.success) {
      console.log(data.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}