document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêche la page de se recharger toute seule

        // Grab the values of the inputs
        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;
        const msgBox = document.getElementById('loginMessage');

        // Loading effect *style*
        msgBox.textContent = "Checking credentials...";
        msgBox.className = "mt-4 text-center font-dosis font-bold text-slate-400";

        try {
            // send the data to the server (route /api/login)
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: pass })
            });

            const data = await response.json();

            // Print the result
            if (data.success) {
                msgBox.textContent = "✅ " + data.message;
                msgBox.className = "mt-4 text-center font-dosis font-bold text-green-400";

                // Redirection to the page of all movies after 1 second
                setTimeout(() => {
                    window.location.href = '/allmovies'; 
                }, 1000);
            } else {
                msgBox.textContent = "NOPE" + data.message;
                msgBox.className = "mt-4 text-center font-dosis font-bold text-red-400";
            }

        } catch (error) {
            console.error('Erreur:', error);
            msgBox.textContent = "Server error. Check console.";
            msgBox.className = "mt-4 text-center font-dosis font-bold text-red-400";
        }
    });