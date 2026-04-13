document.addEventListener('DOMContentLoaded', () => {
    const pseudo = localStorage.getItem('userPseudo') || "Guest";
    const name = localStorage.getItem('userName') || "undefined";
    const mail = localStorage.getItem('userMail') || "undefined";
    
    const bannerPseudo = document.getElementById('banner-pseudo');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileName = document.getElementById('profile-name');
    const profileMail = document.getElementById('profile-mail');


    if (bannerPseudo) {
        bannerPseudo.textContent = `Your profile, ${pseudo}`;
        profileName.textContent = `Your name : ${name}`;
        profileMail.textContent = `Your mail : ${mail}`;

    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/';
        });
    }
});