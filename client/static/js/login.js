document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // The page won't reload itself

  // Grab the values of the inputs
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPassword").value;
  const msgBox = document.getElementById("loginMessage");

  // Loading effect *style*
  msgBox.textContent = "Checking credentials...";
  msgBox.className = "mt-4 text-center font-dosis font text-fuchsia-500";

  try {
    // Hash the password using Web Crypto API
    const encoder = new TextEncoder();
    const pwData = await crypto.subtle.digest("SHA-256", encoder.encode(pass));
    const hashArray = Array.from(new Uint8Array(pwData));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // send the data to the server (route /api/login)
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: hashHex }),
    });

    const data = await response.json();

    // Print the result
    if (data.success) {

      localStorage.setItem("userPseudo", data.username);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userMail", data.mail);

      msgBox.textContent = data.message;
      msgBox.className = "mt-4 text-center font-dosis font text-green-500";

      // Redirection to home page after 0.5 second
      setTimeout(() => {
        window.location.href = "/index";
      }, 500);
    } else {
      msgBox.textContent = data.message;
      msgBox.className = "mt-4 text-center font-dosis font text-red-400";
    }
  } catch (error) {
    console.error("Erreur:", error);
    msgBox.textContent = "Server error. Check console.";
    msgBox.className = "mt-4 text-center font-dosis font text-red-400";
  }
});
