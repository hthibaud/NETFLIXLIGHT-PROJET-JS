document.addEventListener('DOMContentLoaded', () => {
    const pseudo = localStorage.getItem('userPseudo') || "Guest";
    
    const bannerPseudo = document.getElementById('banner-pseudo');
    const logoutBtn = document.getElementById('logoutBtn');

    if (bannerPseudo) {
        bannerPseudo.textContent = `Your profile, ${pseudo}`;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/';
        });
    }
});