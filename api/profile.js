document.addEventListener('DOMContentLoaded', async () => {
    const pseudo = localStorage.getItem('userPseudo') || "Guest";
    const name = localStorage.getItem('userName') || "undefined";
    const mail = localStorage.getItem('userMail') || "undefined";
    
    const bannerPseudo = document.getElementById('banner-pseudo');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileName = document.getElementById('profile-name');
    const profileMail = document.getElementById('profile-mail');
    const favoritesContainer = document.getElementById('favorites-container');
    const watchlistContainer = document.getElementById('watchlist-container');
    const favBtn = document.getElementById('favBtn');
    const watchlistBtn = document.getElementById('watchlistBtn');

    


    if (bannerPseudo) {
        bannerPseudo.textContent = `Your profile, ${pseudo}`;
        profileName.textContent = `${name}`;
        profileMail.textContent = `${mail}`;

    }

    if (favBtn) {
        favBtn.addEventListener('click', () => {
            window.location.href = '/favorites'
        });
    }

        if (watchlistBtn) {
        watchlistBtn.addEventListener('click', () => {
            window.location.href = '/watchlist'
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/';
        });
    }

    try {
        const res = await fetch(`/api/favorites/${pseudo}`);
        const favorites = await res.json();

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = "<p class='text-slate-400'>You don't have any favorites yet.</p>";
        }

        favorites.forEach(movie => {
            const card = document.createElement('div');
            card.className = "w-[250px] bg-slate-800 p-3 rounded-lg flex flex-col items-center";
            card.innerHTML = `
                <img src="${movie.movie_poster}" class="rounded-lg mb-2 w-full">
                <h3 class="font-dosis text-sm text-fuchsia-300 text-center">${movie.movie_title}</h3>
            `;
            favoritesContainer.appendChild(card);
        });

    } catch (err) {
        console.error("Erreur watchlist:", err);
    }

    try {
        const res = await fetch(`/api/watchlist/${pseudo}`);
        const watchlist = await res.json();

        if (watchlist.length === 0) {
            watchlistContainer.innerHTML = "<p class='text-slate-400'>Your watchlist is empty.</p>";
        }

        watchlist.forEach(movie => {
            const card = document.createElement('div');
            card.className = "w-[250px] bg-slate-800 p-3 rounded-lg flex flex-col items-center";
            card.innerHTML = `
                <img src="${movie.movie_poster}" class="rounded-lg mb-2 w-full">
                <h3 class="font-dosis text-sm text-fuchsia-300 text-center">${movie.movie_title}</h3>
            `;
            watchlistContainer.appendChild(card);
        });     
        
    } catch (err) {
        console.error("Erreur watchlist:", err);
    }
});