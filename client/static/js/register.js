document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // The page can't reload itself

        // Grab the values of the inputs
        const name = document.getElementById('regName').value;
        const user = document.getElementById('regUser').value;
        const pass = document.getElementById('regPass').value;
        const msgBox = document.getElementById('regMessage');

        // Loading effect *style*
        msgBox.textContent = "Creating account...";
        msgBox.className = "mt-4 text-center font-dosis font- text-fuchsia-500";

        try {
            // send the data to the server (route /api/register)
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // sending the pseudo and password (ignoring name and mail for now)
                body: JSON.stringify({ username: user, password: pass })
            });

            const data = await response.json();

            // Print result
            if (data.success) {
                msgBox.textContent = data.message;
                msgBox.className = "mt-4 text-center font-dosis font text-green-500";
                // 2 seconds timeout 
                setTimeout(() => {
                    window.location.href = '/'; 
                }, 2000);
            } else {
                msgBox.textContent = data.message;
                msgBox.className = "mt-4 text-center font-dosis font text-red-400";
            }

        } catch (error) {
            console.error('Erreur:', error);
            msgBox.textContent = "Server error. Is the server running?";
            msgBox.className = "mt-4 text-center font-dosis font text-red-400";
        }
    });