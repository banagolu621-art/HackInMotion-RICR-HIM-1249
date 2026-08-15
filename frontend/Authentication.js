document.addEventListener("DOMContentLoaded", function () {

    const API_BASE = "https://hackinmotion-ricr-him-1249.onrender.com";

    // ==========================================
    // SIGN UP
    // ==========================================

    const signupForm = document.getElementById("signupForm");

    signupForm?.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;

        const message = document.getElementById("signupMessage");

        message.textContent = "Creating account...";

        try {

            const response = await fetch(
                `${API_BASE}/api/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                message.textContent =
                    data.detail || data.message || "Registration failed.";
                return;
            }

            message.textContent =
                data.message || "Account created successfully!";

            // Save only returned user information
            if (data.user) {
                localStorage.setItem(
                    "smartMedicineUser",
                    JSON.stringify(data.user)
                );
            }

            localStorage.setItem(
                "smartMedicineLoggedIn",
                "true"
            );

            setTimeout(function () {
                window.location.href = "index.html";
            }, 700);

        } catch (error) {

            console.error("Signup error:", error);

            message.textContent =
                "Unable to connect to server. Please try again.";

        }

    });


    // ==========================================
    // LOGIN
    // ==========================================

    const loginForm = document.getElementById("loginForm");

    loginForm?.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        message.textContent = "Logging in...";

        try {

            const response = await fetch(
                `${API_BASE}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                message.textContent =
                    data.detail || data.message || "Invalid email or password.";

                return;
            }

            message.textContent =
                data.message || "Login successful!";

            if (data.user) {
                localStorage.setItem(
                    "smartMedicineUser",
                    JSON.stringify(data.user)
                );
            }

            localStorage.setItem(
                "smartMedicineLoggedIn",
                "true"
            );

            setTimeout(function () {
                window.location.href = "index.html";
            }, 700);

        } catch (error) {

            console.error("Login error:", error);

            message.textContent =
                "Unable to connect to server. Please try again.";

        }

    });

});