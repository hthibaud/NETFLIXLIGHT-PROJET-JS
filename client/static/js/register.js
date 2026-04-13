document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // The page can't reload itself

    // Grab the values of the inputs
    const name = document.getElementById("regName").value;
    const mail = document.getElementById("regMail").value;
    const user = document.getElementById("regUser").value;
    const pass = document.getElementById("regPass").value;
    const msgBox = document.getElementById("regMessage");

    // Loading effect *style*
    msgBox.textContent = "Creating account...";
    msgBox.className = "mt-4 text-center font-dosis font- text-fuchsia-500";

    try {
      // Hash the password using Web Crypto API
      const encoder = new TextEncoder();
      const pwData = await crypto.subtle.digest(
        "SHA-256",
        encoder.encode(pass),
      );
      const hashArray = Array.from(new Uint8Array(pwData));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // send the data to the server (route /api/register)
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({ name: name, username: user, mail: mail, password: hashHex }),
        
      });

      const data = await response.json();

      // Print result
      if (data.success) {

        msgBox.textContent = data.message;
        msgBox.className = "mt-4 text-center font-dosis font text-green-500";
        // 2 seconds timeout
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        msgBox.textContent = data.message;
        msgBox.className = "mt-4 text-center font-dosis font text-red-400";
      }
    } catch (error) {
      console.error("Erreur:", error);
      msgBox.textContent = "Server error. Is the server running?";
      msgBox.className = "mt-4 text-center font-dosis font text-red-400";
    }
  });
