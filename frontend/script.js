/* =========================================================
   SMART MEDICINE SAFETY
   COMPLETE FRONTEND CONTROLLER
========================================================= */

const API_BASE = "http://127.0.0.1:5000";

let currentUser = null;
let selectedMedicines = [];
let suggestionTimer = null;


/* =========================================================
   MEDICINE SUGGESTION LIST
   Used for instant suggestions while typing
========================================================= */

const COMMON_MEDICINES = [
    "Paracetamol",
    "Paracetamol 500mg",
    "Paracetamol 650mg",
    "Ibuprofen",
    "Aspirin",
    "Amoxicillin",
    "Azithromycin",
    "Cetirizine",
    "Levocetirizine",
    "Pantoprazole",
    "Omeprazole",
    "Rabeprazole",
    "Esomeprazole",
    "Metformin",
    "Atorvastatin",
    "Rosuvastatin",
    "Amlodipine",
    "Losartan",
    "Telmisartan",
    "Enalapril",
    "Lisinopril",
    "Montelukast",
    "Diclofenac",
    "Naproxen",
    "Doxycycline",
    "Ciprofloxacin",
    "Metronidazole",
    "Clindamycin",
    "Amoxicillin Clavulanate",
    "Azithromycin 500mg",
    "Cetirizine 10mg",
    "Levocetirizine 5mg",
    "Pantoprazole 40mg",
    "Metformin 500mg",
    "Glimepiride",
    "Insulin",
    "Prednisolone",
    "Vitamin D3",
    "Calcium",
    "Iron",
    "Folic Acid",
    "ORS",
    "Domperidone",
    "Ondansetron",
    "Ranitidine",
    "Famotidine",
    "Salbutamol",
    "Budesonide",
    "Hydroxychloroquine",
    "Ivermectin"
];


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    loadMedicines();

    updateNavigation();

    renderMedicineList();

    setupNavigation();

    setupAuthentication();

    setupMedicineSearch();

    setupInteraction();

    setupSafety();

    setupProfile();

    setupSuggestionSystem();

});


/* =========================================================
   USER STORAGE
========================================================= */

function loadUser() {

    const savedUser =
        localStorage.getItem("smartMedicineUser");

    if (!savedUser) {

        currentUser = null;

        return;
    }

    try {

        currentUser = JSON.parse(savedUser);

    } catch (error) {

        console.error("Invalid saved user:", error);

        localStorage.removeItem("smartMedicineUser");

        currentUser = null;
    }
}


function saveUser(user) {

    currentUser = user;

    localStorage.setItem(
        "smartMedicineUser",
        JSON.stringify(user)
    );
}


function isLoggedIn() {

    return currentUser !== null;
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    document
        .getElementById("heroSearchBtn")
        ?.addEventListener("click", () => {

            scrollToSection("search-section");

            document
                .getElementById("medicineSearch")
                ?.focus();

        });


    document
        .getElementById("heroInteractionBtn")
        ?.addEventListener("click", () => {

            if (!requireLogin()) return;

            scrollToSection("interaction-section");

        });


    document
        .getElementById("loginNav")
        ?.addEventListener("click", openLogin);


    document
        .getElementById("signupNav")
        ?.addEventListener("click", openSignUp);


    document
        .getElementById("clearMedicinesBtn")
        ?.addEventListener("click", clearMedicines);

}


function scrollToSection(id) {

    const section =
        document.getElementById(id);

    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================================
   LOGIN PROTECTION
========================================================= */

function requireLogin() {

    if (isLoggedIn()) {

        return true;
    }

    openLogin();

    showLoginMessage(
        "Please login to use this feature."
    );

    return false;
}


/* =========================================================
   AUTHENTICATION
========================================================= */

function setupAuthentication() {

    document
        .getElementById("closeAuthModal")
        ?.addEventListener(
            "click",
            closeAuthModal
        );


    document
        .getElementById("switchToSignUp")
        ?.addEventListener(
            "click",
            openSignUp
        );


    /*
       Supports your old ID too.
       This means the page won't break if
       switchToRegister still exists.
    */

    document
        .getElementById("switchToRegister")
        ?.addEventListener(
            "click",
            openSignUp
        );


    document
        .getElementById("switchToLogin")
        ?.addEventListener(
            "click",
            openLogin
        );


    document
        .getElementById("loginForm")
        ?.addEventListener(
            "submit",
            handleLogin
        );


    document
        .getElementById("signupForm")
        ?.addEventListener(
            "submit",
            handleSignUp
        );


    /*
       Supports old registerForm ID.
    */

    document
        .getElementById("registerForm")
        ?.addEventListener(
            "submit",
            handleSignUp
        );


    document
        .getElementById("authModal")
        ?.addEventListener(
            "click",
            function (event) {

                if (event.target === this) {

                    closeAuthModal();

                }
            }
        );
}


/* =========================================================
   LOGIN MODAL
========================================================= */

function openLogin() {

    const modal =
        document.getElementById("authModal");

    const login =
        document.getElementById("loginContainer");

    const signup =
        document.getElementById("signupContainer") ||
        document.getElementById("registerContainer");


    if (!modal || !login) return;

    modal.classList.add("show");

    login.style.display = "block";

    if (signup) {

        signup.style.display = "none";

    }

    clearAuthMessages();
}


/* =========================================================
   SIGN UP MODAL
========================================================= */

function openSignUp() {

    const modal =
        document.getElementById("authModal");

    const login =
        document.getElementById("loginContainer");

    const signup =
        document.getElementById("signupContainer") ||
        document.getElementById("registerContainer");


    if (!modal || !signup) return;

    modal.classList.add("show");

    if (login) {

        login.style.display = "none";

    }

    signup.style.display = "block";

    clearAuthMessages();
}


function closeAuthModal() {

    document
        .getElementById("authModal")
        ?.classList.remove("show");

}


function clearAuthMessages() {

    const loginMessage =
        document.getElementById("loginMessage");

    const signupMessage =
        document.getElementById("signupMessage") ||
        document.getElementById("registerMessage");


    if (loginMessage) {

        loginMessage.textContent = "";

    }

    if (signupMessage) {

        signupMessage.textContent = "";

    }
}


/* =========================================================
   LOGIN
========================================================= */

async function handleLogin(event) {

    event.preventDefault();

    const email =
        document
            .getElementById("loginEmail")
            ?.value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            ?.value;

    const message =
        document.getElementById("loginMessage");


    if (!email || !password) {

        if (message) {

            message.style.color = "#dc2626";

            message.textContent =
                "Please enter email and password.";

        }

        return;
    }


    if (message) {

        message.style.color = "#64748b";

        message.textContent = "Logging in...";

    }


    try {

        const response =
            await fetch(
                `${API_BASE}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Invalid email or password."
            );
        }


        if (!data.user) {

            throw new Error(
                "Login response did not contain user information."
            );
        }


        saveUser(data.user);

        loadMedicines();

        updateNavigation();

        renderMedicineList();


        if (message) {

            message.style.color = "#16a34a";

            message.textContent =
                "Login successful!";

        }


        setTimeout(() => {

            closeAuthModal();

        }, 700);


        document
            .getElementById("loginForm")
            ?.reset();


    } catch (error) {

        console.error("Login error:", error);

        if (message) {

            message.style.color = "#dc2626";

            message.textContent =
                error.message ||
                "Unable to login.";

        }
    }
}


/* =========================================================
   SIGN UP
========================================================= */

async function handleSignUp(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("signupName")
            ?.value
            .trim()
        ||
        document
            .getElementById("registerName")
            ?.value
            .trim();


    const email =
        document
            .getElementById("signupEmail")
            ?.value
            .trim()
        ||
        document
            .getElementById("registerEmail")
            ?.value
            .trim();


    const password =
        document
            .getElementById("signupPassword")
            ?.value
        ||
        document
            .getElementById("registerPassword")
            ?.value;


    const message =
        document.getElementById("signupMessage") ||
        document.getElementById("registerMessage");


    if (!name || !email || !password) {

        if (message) {

            message.style.color = "#dc2626";

            message.textContent =
                "Please fill all fields.";

        }

        return;
    }


    if (password.length < 6) {

        if (message) {

            message.style.color = "#dc2626";

            message.textContent =
                "Password must contain at least 6 characters.";

        }

        return;
    }


    if (message) {

        message.style.color = "#64748b";

        message.textContent =
            "Creating your account...";

    }


    try {

        const response =
            await fetch(
                `${API_BASE}/api/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Sign Up failed."
            );
        }


        if (message) {

            message.style.color = "#16a34a";

            message.textContent =
                "Account created successfully!";

        }


        document
            .getElementById("signupForm")
            ?.reset();


        document
            .getElementById("registerForm")
            ?.reset();


        setTimeout(() => {

            openLogin();

        }, 1000);


    } catch (error) {

        console.error(
            "Sign Up error:",
            error
        );


        if (message) {

            message.style.color = "#dc2626";

            message.textContent =
                error.message ||
                "Unable to create account.";

        }
    }
}


/* =========================================================
   UPDATE NAVIGATION
========================================================= */

function updateNavigation() {

    const loginNav =
        document.getElementById("loginNav");

    const signupNav =
        document.getElementById("signupNav");

    const userProfile =
        document.getElementById("userProfileNav");

    const profileName =
        document.getElementById("profileName");

    const dropdownName =
        document.getElementById("dropdownName");

    const dropdownEmail =
        document.getElementById("dropdownEmail");

    const profileModalName =
        document.getElementById("profileModalName");

    const profileModalEmail =
        document.getElementById("profileModalEmail");


    if (isLoggedIn()) {

        /*
         * LOGGED IN
         */

        if (loginNav)
            loginNav.style.display = "none";


        if (signupNav)
            signupNav.style.display = "none";


        if (userProfile)
            userProfile.style.display = "block";


        if (profileName)
            profileName.textContent =
                currentUser.name;


        if (dropdownName)
            dropdownName.textContent =
                currentUser.name;


        if (dropdownEmail)
            dropdownEmail.textContent =
                currentUser.email;


        if (profileModalName)
            profileModalName.textContent =
                currentUser.name;


        if (profileModalEmail)
            profileModalEmail.textContent =
                currentUser.email;


        renderProfileMedicines();

    } else {

        /*
         * LOGGED OUT
         */

        if (loginNav)
            loginNav.style.display = "inline-block";


        if (signupNav)
            signupNav.style.display = "inline-block";


        if (userProfile)
            userProfile.style.display = "none";

    }
}


/* =========================================================
   SIGN OUT
========================================================= */

function signOut() {

    localStorage.removeItem(
        "smartMedicineUser"
    );

    currentUser = null;

    selectedMedicines = [];

    closeProfileModal();

    updateNavigation();

    renderMedicineList();

    alert("You have been signed out.");

}


/* =========================================================
   PROFILE
========================================================= */

function setupProfile() {

    document
        .getElementById("profileButton")
        ?.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                document
                    .getElementById("profileDropdown")
                    ?.classList.toggle("show");

            }
        );


    document
        .getElementById("viewProfileBtn")
        ?.addEventListener(
            "click",
            function () {

                document
                    .getElementById("profileDropdown")
                    ?.classList.remove("show");

                openProfileModal();

            }
        );


    document
        .getElementById("signOutBtn")
        ?.addEventListener(
            "click",
            signOut
        );


    document
        .getElementById("profileSignOut")
        ?.addEventListener(
            "click",
            signOut
        );


    document
        .getElementById("closeProfileModal")
        ?.addEventListener(
            "click",
            closeProfileModal
        );


    document
        .getElementById("profileModal")
        ?.addEventListener(
            "click",
            function (event) {

                if (event.target === this) {

                    closeProfileModal();

                }
            }
        );


    document.addEventListener(
        "click",
        function () {

            document
                .getElementById("profileDropdown")
                ?.classList.remove("show");

        }
    );
}


function openProfileModal() {

    if (!requireLogin())
        return;

    renderProfileMedicines();

    document
        .getElementById("profileModal")
        ?.classList.add("show");
}


function closeProfileModal() {

    document
        .getElementById("profileModal")
        ?.classList.remove("show");
}


function showLoginMessage(text) {

    const message =
        document.getElementById("loginMessage");

    if (!message) return;

    message.style.color = "#dc2626";

    message.textContent = text;
}


/* =========================================================
   MEDICINE STORAGE
========================================================= */

function medicineStorageKey() {

    if (!currentUser)
        return null;

    return (
        "smartMedicineList_" +
        currentUser.id
    );
}


function loadMedicines() {

    if (!currentUser) {

        selectedMedicines = [];

        return;
    }


    const key =
        medicineStorageKey();


    try {

        selectedMedicines =
            JSON.parse(
                localStorage.getItem(key) ||
                "[]"
            );

    } catch {

        selectedMedicines = [];

    }
}


function saveMedicines() {

    if (!currentUser)
        return;

    localStorage.setItem(
        medicineStorageKey(),
        JSON.stringify(selectedMedicines)
    );
}


/* =========================================================
   MEDICINE SEARCH
========================================================= */

function setupMedicineSearch() {

    const button =
        document.getElementById(
            "medicineSearchBtn"
        );

    const input =
        document.getElementById(
            "medicineSearch"
        );


    button?.addEventListener(
        "click",
        searchMedicine
    );


    input?.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchMedicine();

            }

        }
    );
}


/* =========================================================
   LIVE MEDICINE SUGGESTIONS
========================================================= */

function setupSuggestionSystem() {

    const input =
        document.getElementById(
            "medicineSearch"
        );


    if (!input)
        return;


    /*
       Create suggestion container
       automatically if it does not exist.
    */

    let suggestionBox =
        document.getElementById(
            "medicineSuggestions"
        );


    if (!suggestionBox) {

        suggestionBox =
            document.createElement("div");

        suggestionBox.id =
            "medicineSuggestions";

        suggestionBox.className =
            "medicine-suggestions";

        input.parentNode.appendChild(
            suggestionBox
        );
    }


    input.addEventListener(
        "input",
        function () {

            clearTimeout(
                suggestionTimer
            );


            const value =
                input.value.trim().toLowerCase();


            if (value.length < 2) {

                suggestionBox.innerHTML = "";

                suggestionBox.style.display =
                    "none";

                return;
            }


            suggestionTimer =
                setTimeout(
                    () => {

                        showMedicineSuggestions(
                            value,
                            suggestionBox
                        );

                    },
                    100
                );

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            if (
                event.target !== input &&
                !suggestionBox.contains(
                    event.target
                )
            ) {

                suggestionBox.style.display =
                    "none";

            }

        }
    );
}


/* =========================================================
   SHOW MEDICINE SUGGESTIONS
========================================================= */

function showMedicineSuggestions(
    searchText,
    suggestionBox
) {

    /*
       First search local common medicine list.
    */

    const matches =
        COMMON_MEDICINES
            .filter(
                medicine =>
                    medicine
                        .toLowerCase()
                        .includes(searchText)
            )
            .slice(0, 6);


    if (matches.length === 0) {

        suggestionBox.innerHTML =
            `<div class="suggestion-empty">
                No common medicine suggestion
            </div>`;

        suggestionBox.style.display =
            "block";

        return;
    }


    suggestionBox.innerHTML =
        matches
            .map(
                medicine => `
                    <div
                        class="medicine-suggestion"
                        data-medicine="${escapeHTML(
                            medicine
                        )}"
                    >
                        <span class="suggestion-icon">
                            💊
                        </span>

                        <span>
                            ${escapeHTML(
                                highlightMatch(
                                    medicine,
                                    searchText
                                )
                            )}
                        </span>
                    </div>
                `
            )
            .join("");


    suggestionBox.style.display =
        "block";


    suggestionBox
        .querySelectorAll(
            ".medicine-suggestion"
        )
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    function () {

                        const medicine =
                            this.dataset.medicine;


                        const input =
                            document.getElementById(
                                "medicineSearch"
                            );


                        input.value =
                            medicine;


                        suggestionBox.innerHTML =
                            "";

                        suggestionBox.style.display =
                            "none";


                        /*
                           Automatically search RxNorm.
                        */

                        searchMedicine();

                    }
                );

            }
        );
}


/* =========================================================
   HIGHLIGHT SEARCH TEXT
========================================================= */

function highlightMatch(
    text,
    search
) {

    const index =
        text
            .toLowerCase()
            .indexOf(search.toLowerCase());


    if (index === -1)
        return escapeHTML(text);


    const before =
        text.substring(0, index);

    const match =
        text.substring(
            index,
            index + search.length
        );

    const after =
        text.substring(
            index + search.length
        );


    return (
        escapeHTML(before) +
        "<strong>" +
        escapeHTML(match) +
        "</strong>" +
        escapeHTML(after)
    );
}


/* =========================================================
   RXNORM SEARCH
========================================================= */

async function searchMedicine() {

    const input =
        document.getElementById(
            "medicineSearch"
        );

    const results =
        document.getElementById(
            "searchResults"
        );

    const status =
        document.getElementById(
            "searchStatus"
        );


    if (!input || !results)
        return;


    const medicine =
        input.value.trim();


    if (!medicine) {

        if (status)
            status.textContent =
                "Please enter a medicine name.";

        results.innerHTML = "";

        return;
    }


    if (status)
        status.textContent =
            "Searching RxNorm...";


    results.innerHTML = "";


    try {

        const response =
            await fetch(
                `${API_BASE}/api/drug/search?name=${encodeURIComponent(
                    medicine
                )}`
            );


        const payload =
            await response.json();


        if (!response.ok) {

            throw new Error(
                payload.detail ||
                "Medicine search failed."
            );
        }


        const medicines =
            payload?.data?.medicines ||
            [];


        if (medicines.length === 0) {

            if (status)
                status.textContent =
                    "No medicine found.";

            return;
        }


        if (status)
            status.textContent =
                `Found ${medicines.length} result(s).`;


        results.innerHTML =
            medicines
                .map(drug => {

                    const rxcui =
                        drug.rxcui ||
                        "N/A";

                    const name =
                        drug.name ||
                        "Unknown";

                    const synonym =
                        drug.synonym ||
                        "";


                    const added =
                        selectedMedicines.some(
                            item =>
                                item.rxcui ===
                                rxcui
                        );


                    return `
                        <div class="result-card">

                            <div class="medicine-item-info">

                                <div class="medicine-item-icon">
                                    💊
                                </div>

                                <div>

                                    <h3>
                                        ${escapeHTML(
                                            name
                                        )}
                                    </h3>

                                    <p>
                                        RxCUI:
                                        ${escapeHTML(
                                            rxcui
                                        )}
                                    </p>

                                    ${
                                        synonym
                                        ? `
                                        <p>
                                            ${escapeHTML(
                                                synonym
                                            )}
                                        </p>
                                        `
                                        : ""
                                    }

                                </div>

                            </div>

                            <span class="badge">
                                RxNorm
                            </span>

                            <button
                                class="add-medicine-btn ${
                                    added
                                        ? "added"
                                        : ""
                                }"
                                data-rxcui="${escapeHTML(
                                    rxcui
                                )}"
                                data-name="${escapeHTML(
                                    name
                                )}"
                                data-synonym="${escapeHTML(
                                    synonym
                                )}"
                                ${
                                    added
                                        ? "disabled"
                                        : ""
                                }
                            >
                                ${
                                    added
                                        ? "✓ Added"
                                        : "+ Add to Profile"
                                }
                            </button>

                        </div>
                    `;

                })
                .join("");


        results
            .querySelectorAll(
                ".add-medicine-btn"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        addMedicine({
                            rxcui:
                                this.dataset.rxcui,

                            name:
                                this.dataset.name,

                            synonym:
                                this.dataset.synonym
                        });

                    }
                );

            });


    } catch (error) {

        console.error(
            "RxNorm search error:",
            error
        );


        if (status)
            status.textContent =
                "Backend connection failed.";


        results.innerHTML = `
            <div class="result-box error">
                ${escapeHTML(
                    error.message
                )}
            </div>
        `;
    }
}


/* =========================================================
   ADD MEDICINE
========================================================= */

async function addMedicine(medicine) {

    if (!requireLogin())
        return;

    if (!currentUser || !currentUser.id) {
        alert("User information not found. Please login again.");
        return;
    }

    const exists =
        selectedMedicines.some(
            item => item.rxcui === medicine.rxcui
        );

    if (exists)
        return;

    try {

        const response = await fetch(
            `${API_BASE}/api/profile/medicines`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user_id: currentUser.id,
                    name: medicine.name,
                    dosage: null,
                    frequency: null,
                    start_date: null,
                    end_date: null
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Could not add medicine."
            );
        }

        console.log(
            "Medicine saved to database:",
            data
        );

        // Add to frontend list
        selectedMedicines.push({

            id: data.medicine.id,

            rxcui: medicine.rxcui,

            name: medicine.name,

            synonym: medicine.synonym || "",

            dosage: data.medicine.dosage,

            frequency: data.medicine.frequency,

            start_date: data.medicine.start_date,

            end_date: data.medicine.end_date,

            addedAt: new Date().toISOString()
        });

        saveMedicines();

        renderMedicineList();

        renderProfileMedicines();

        searchMedicine();

        alert(
            `${medicine.name} added to your medicine profile.`
        );

    } catch (error) {

        console.error(
            "Add medicine error:",
            error
        );

        alert(
            "Failed to add medicine: " +
            error.message
        );
    }
}

/* =========================================================
   REMOVE MEDICINE
========================================================= */

async function removeMedicine(rxcui) {

    selectedMedicines =
        selectedMedicines.filter(
            medicine =>
                medicine.rxcui !==
                rxcui
        );


    saveMedicines();

    renderMedicineList();

    renderProfileMedicines();

    searchMedicine();
}


/* =========================================================
   CLEAR MEDICINES
========================================================= */

function clearMedicines() {

    if (
        selectedMedicines.length === 0
    ) {

        return;
    }


    if (
        !confirm(
            "Remove all medicines from your profile?"
        )
    ) {

        return;
    }


    selectedMedicines = [];

    saveMedicines();

    renderMedicineList();

    renderProfileMedicines();
}


/* =========================================================
   MEDICINE LIST
========================================================= */

function renderMedicineList() {

    const container =
        document.getElementById(
            "medicineList"
        );


    if (!container)
        return;


    if (!isLoggedIn()) {

        container.innerHTML = `
            <div class="empty-profile">

                <div>🔐</div>

                <h3>
                    Login to create your medicine profile
                </h3>

                <p>
                    Your selected medicines will appear here.
                </p>

            </div>
        `;

        return;
    }


    if (selectedMedicines.length === 0) {

        container.innerHTML = `
            <div class="empty-profile">

                <div>💊</div>

                <h3>
                    No medicines added yet
                </h3>

                <p>
                    Search for a medicine above and add it
                    to your personal profile.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        selectedMedicines
            .map(
                medicine => `
                    <div class="medicine-item">

                        <div class="medicine-item-info">

                            <div class="medicine-item-icon">
                                💊
                            </div>

                            <div>

                                <div class="medicine-item-name">
                                    ${escapeHTML(
                                        medicine.name
                                    )}
                                </div>

                                <div class="medicine-item-details">
                                    RxCUI:
                                    ${escapeHTML(
                                        medicine.rxcui
                                    )}
                                </div>

                            </div>

                        </div>

                        <button
                            class="remove-medicine"
                            data-remove-rxcui="${escapeHTML(
                                medicine.rxcui
                            )}"
                            type="button"
                        >
                            Remove
                        </button>

                    </div>
                `
            )
            .join("");


    container
        .querySelectorAll(
            "[data-remove-rxcui]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    removeMedicine(
                        button.dataset.removeRxcui
                    );

                }
            );

        });
}


/* =========================================================
   PROFILE MEDICINES
========================================================= */

function renderProfileMedicines() {

    const container =
        document.getElementById(
            "profileMedicineList"
        );

    const count =
        document.getElementById(
            "profileMedicineCount"
        );


    if (!container)
        return;


    if (count)
        count.textContent =
            selectedMedicines.length;


    if (selectedMedicines.length === 0) {

        container.innerHTML = `
            <div class="empty-profile">

                <div>💊</div>

                <h3>
                    No medicines added
                </h3>

                <p>
                    Search and add medicines to build
                    your personal medication profile.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        selectedMedicines
            .map(
                medicine => `
                    <div class="medicine-item">

                        <div class="medicine-item-info">

                            <div class="medicine-item-icon">
                                💊
                            </div>

                            <div>

                                <div class="medicine-item-name">
                                    ${escapeHTML(
                                        medicine.name
                                    )}
                                </div>

                                <div class="medicine-item-details">
                                    RxCUI:
                                    ${escapeHTML(
                                        medicine.rxcui
                                    )}
                                </div>

                            </div>

                        </div>

                    </div>
                `
            )
            .join("");
}


/* =========================================================
   DRUG INTERACTION
========================================================= */

function setupInteraction() {

    document
        .getElementById(
            "checkInteractionBtn"
        )
        ?.addEventListener(
            "click",
            checkInteraction
        );
}


async function checkInteraction() {

    if (!requireLogin())
        return;


    const drug1 =
        document
            .getElementById("drug1")
            ?.value
            .trim();


    const drug2 =
        document
            .getElementById("drug2")
            ?.value
            .trim();


    const result =
        document.getElementById(
            "interactionResult"
        );


    if (!result)
        return;


    if (!drug1 || !drug2) {

        result.innerHTML = `
            <div class="result-box error">
                Please enter both medicines.
            </div>
        `;

        return;
    }


    result.innerHTML = `
        <div class="result-box">
            Checking interaction...
        </div>
    `;


    try {

        const response =
            await fetch(
                `${API_BASE}/api/drug/interaction?drug1=${encodeURIComponent(
                    drug1
                )}&drug2=${encodeURIComponent(
                    drug2
                )}`
            );


        const payload =
            await response.json();


        if (!response.ok) {

            throw new Error(
                payload.detail ||
                "Interaction check failed."
            );
        }


        const data =
            payload.data || {};


        const className =
            data.status === "warning"
                ? "warning"
                : "success";


        let interactionHTML = "";


        if (
            Array.isArray(
                data.interactions
            ) &&
            data.interactions.length
        ) {

            interactionHTML = `
                <h3>
                    Relevant Information
                </h3>

                ${data.interactions
                    .map(
                        item => `
                            <p>
                                <strong>
                                    ${escapeHTML(
                                        item.source_drug
                                    )}
                                    →
                                    ${escapeHTML(
                                        item.mentioned_drug
                                    )}
                                </strong>
                                :
                                ${escapeHTML(
                                    item.information
                                )}
                            </p>
                        `
                    )
                    .join("")}
            `;
        }


        result.innerHTML = `
            <div class="result-box ${className}">

                <h3>
                    ${escapeHTML(
                        data.status ||
                        "Interaction Result"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        data.message ||
                        ""
                    )}
                </p>

                <p>
                    <strong>
                        Medicine 1:
                    </strong>
                    ${escapeHTML(
                        data.drug1 ||
                        drug1
                    )}
                </p>

                <p>
                    <strong>
                        Medicine 2:
                    </strong>
                    ${escapeHTML(
                        data.drug2 ||
                        drug2
                    )}
                </p>

                ${interactionHTML}

            </div>
        `;


    } catch (error) {

        console.error(
            "Interaction error:",
            error
        );


        result.innerHTML = `
            <div class="result-box error">
                ${escapeHTML(
                    error.message
                )}
            </div>
        `;
    }
}


/* =========================================================
   FDA SAFETY
========================================================= */

function setupSafety() {

    document
        .getElementById(
            "safetyBtnPage"
        )
        ?.addEventListener(
            "click",
            getSafetyInfo
        );
}


async function getSafetyInfo() {

    if (!requireLogin())
        return;


    const medicine =
        document
            .getElementById(
                "safetyMedicine"
            )
            ?.value
            .trim();


    const result =
        document.getElementById(
            "safetyResult"
        );


    if (!result)
        return;


    if (!medicine) {

        result.innerHTML = `
            <div class="result-box error">
                Please enter a medicine name.
            </div>
        `;

        return;
    }


    result.innerHTML = `
        <div class="result-box">
            Loading openFDA safety information...
        </div>
    `;


    try {

        const response =
            await fetch(
                `${API_BASE}/api/drug/safety?name=${encodeURIComponent(
                    medicine
                )}`
            );


        const payload =
            await response.json();


        if (!response.ok) {

            throw new Error(
                payload.detail ||
                "Safety lookup failed."
            );
        }


        const data =
            payload.data || {};


        if (!data.found) {

            result.innerHTML = `
                <div class="result-box error">
                    ${escapeHTML(
                        data.message ||
                        "No FDA information found."
                    )}
                </div>
            `;

            return;
        }


        const info =
            (
                Array.isArray(
                    data.results
                ) &&
                data.results[0]
            ) || {};


        const displayName =
            info.brand_name ||
            info.generic_name ||
            payload.drug ||
            medicine;


        result.innerHTML = `
            <div class="result-box">

                <h3>
                    ${escapeHTML(
                        displayName
                    )}
                </h3>

                <p>
                    <strong>
                        Manufacturer:
                    </strong>
                    ${escapeHTML(
                        info.manufacturer ||
                        "Not available"
                    )}
                </p>

                <p>
                    <strong>
                        Indications:
                    </strong>
                    ${escapeHTML(
                        info.indications ||
                        "Not available"
                    )}
                </p>

                <p>
                    <strong>
                        Warnings:
                    </strong>
                    ${escapeHTML(
                        info.warnings ||
                        info.boxed_warning ||
                        "Not available"
                    )}
                </p>

                <p>
                    <strong>
                        Contraindications:
                    </strong>
                    ${escapeHTML(
                        info.contraindications ||
                        "Not available"
                    )}
                </p>

                <p>
                    <strong>
                        Adverse Reactions:
                    </strong>
                    ${escapeHTML(
                        info.adverse_reactions ||
                        "Not available"
                    )}
                </p>

                <p>
                    <strong>
                        Drug Interactions:
                    </strong>
                    ${escapeHTML(
                        info.drug_interactions ||
                        "Not available"
                    )}
                </p>

                <p>
                    <strong>
                        Dosage:
                    </strong>
                    ${escapeHTML(
                        info.dosage ||
                        "Not available"
                    )}
                </p>

            </div>
        `;


    } catch (error) {

        console.error(
            "Safety error:",
            error
        );


        result.innerHTML = `
            <div class="result-box error">
                ${escapeHTML(
                    error.message
                )}
            </div>
        `;
    }
}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
/* =========================================================
   MEDICINE AUTOCOMPLETE
========================================================= */

const medicineSuggestions = [
    "Paracetamol",
    "Paracetamol 500 mg",
    "Paracetamol 650 mg",
    "Amoxicillin",
    "Azithromycin",
    "Aspirin",
    "Ibuprofen",
    "Cetirizine",
    "Levocetirizine",
    "Pantoprazole",
    "Omeprazole",
    "Metformin",
    "Atorvastatin",
    "Losartan",
    "Amlodipine",
    "Doxycycline",
    "Ciprofloxacin",
    "Clarithromycin",
    "Diclofenac",
    "Naproxen",
    "Montelukast",
    "Ranitidine",
    "Domperidone",
    "Ondansetron",
    "Insulin"
];


function setupMedicineAutocomplete(
    inputId,
    suggestionsId
) {

    const input =
        document.getElementById(inputId);

    const box =
        document.getElementById(suggestionsId);

    if (!input || !box)
        return;


    input.addEventListener(
        "input",
        function () {

            const query =
                input.value
                    .trim()
                    .toLowerCase();


            box.innerHTML = "";


            if (!query) {

                box.style.display =
                    "none";

                return;

            }


            const matches =
                medicineSuggestions
                    .filter(function (medicine) {

                        return medicine
                            .toLowerCase()
                            .includes(query);

                    })
                    .slice(0, 6);


            if (matches.length === 0) {

                box.style.display =
                    "none";

                return;

            }


            box.innerHTML =
                matches
                    .map(function (medicine) {

                        return `
                            <div
                                class="medicine-suggestion"
                                data-medicine="${escapeHTML(medicine)}"
                            >
                                💊
                                <span>
                                    ${escapeHTML(medicine)}
                                </span>
                            </div>
                        `;

                    })
                    .join("");


            box.style.display =
                "block";


            box
                .querySelectorAll(
                    ".medicine-suggestion"
                )
                .forEach(function (item) {

                    item.addEventListener(
                        "click",
                        function () {

                            input.value =
                                item.dataset.medicine;

                            box.innerHTML =
                                "";

                            box.style.display =
                                "none";

                        }
                    );

                });

        }
    );


    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                box.innerHTML = "";

                box.style.display =
                    "none";

            }

        }
    );

}


/* =========================================================
   INITIALIZE AUTOCOMPLETE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupMedicineAutocomplete(
            "medicineSearch",
            "searchSuggestions"
        );


        setupMedicineAutocomplete(
            "drug1",
            "drug1Suggestions"
        );


        setupMedicineAutocomplete(
            "drug2",
            "drug2Suggestions"
        );

    }
);
// =====================================================
// PRESCRIPTION UPLOAD
// =====================================================

const prescriptionFile =
    document.getElementById("prescriptionFile");

const prescriptionFileName =
    document.getElementById("prescriptionFileName");

const uploadPrescriptionBtn =
    document.getElementById("uploadPrescriptionBtn");

const uploadStatus =
    document.getElementById("uploadStatus");


// -----------------------------------------------------
// SELECT FILE
// -----------------------------------------------------

if (prescriptionFile) {

    prescriptionFile.addEventListener(
        "change",
        function () {

            const file = this.files[0];

            if (!file) {

                prescriptionFileName.textContent = "";

                uploadPrescriptionBtn.style.display =
                    "none";

                return;
            }


            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "application/pdf"
            ];


            if (!allowedTypes.includes(file.type)) {

                prescriptionFile.value = "";

                prescriptionFileName.textContent = "";

                uploadPrescriptionBtn.style.display =
                    "none";

                uploadStatus.textContent =
                    "❌ Please select JPG, PNG or PDF.";

                return;
            }


            // 10 MB limit

            if (file.size > 10 * 1024 * 1024) {

                prescriptionFile.value = "";

                prescriptionFileName.textContent = "";

                uploadPrescriptionBtn.style.display =
                    "none";

                uploadStatus.textContent =
                    "❌ File must be smaller than 10 MB.";

                return;
            }


            prescriptionFileName.textContent =
                `Selected: ${file.name}`;

            uploadPrescriptionBtn.style.display =
                "inline-block";

            uploadStatus.textContent = "";
        }
    );
}


// -----------------------------------------------------
// UPLOAD
// -----------------------------------------------------

if (uploadPrescriptionBtn) {

    uploadPrescriptionBtn.addEventListener(
        "click",
        async function () {

            const file =
                prescriptionFile.files[0];


            if (!file) {

                uploadStatus.textContent =
                    "❌ Please select a prescription.";

                return;
            }


            const storedUser =
                localStorage.getItem("smartMedicineUser");


            if (!storedUser) {

                uploadStatus.textContent =
                    "❌ Please login first.";

                return;
            }


            let user;

            try {

                user = JSON.parse(storedUser);

            } catch (error) {

                uploadStatus.textContent =
                    "❌ Login session is invalid.";

                return;
            }


            if (!user.id) {

                uploadStatus.textContent =
                    "❌ User information not found.";

                return;
            }


            const formData =
                new FormData();


            formData.append(
                "user_id",
                user.id
            );


            formData.append(
                "file",
                file
            );


            uploadPrescriptionBtn.disabled =
                true;

            uploadPrescriptionBtn.textContent =
                "Uploading...";


            uploadStatus.textContent =
                "Uploading prescription...";


            try {

                const response =
                    await fetch(
                        `${API_BASE}/api/profile/prescriptions/upload`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "Prescription upload failed"
                    );
                }


                uploadStatus.textContent =
                    "✅ Prescription uploaded successfully!";


                prescriptionFile.value = "";

                prescriptionFileName.textContent = "";

                uploadPrescriptionBtn.style.display =
                    "none";


                // Refresh prescription list

                loadPrescriptions(user.id);

            } catch (error) {

                console.error(
                    "Prescription upload error:",
                    error
                );

                uploadStatus.textContent =
                    `❌ ${error.message}`;

            } finally {

                uploadPrescriptionBtn.disabled =
                    false;

                uploadPrescriptionBtn.textContent =
                    "Upload Prescription";
            }
        }
    );
}


// =====================================================
// LOAD PRESCRIPTIONS
// =====================================================

async function loadPrescriptions(userId) {

    const prescriptionList =
        document.getElementById(
            "prescriptionList"
        );


    if (!prescriptionList) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/api/profile/prescriptions/${userId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Could not load prescriptions"
            );
        }


        const prescriptions =
            data.prescriptions || [];


        if (prescriptions.length === 0) {

            prescriptionList.innerHTML = `
                <p class="empty-prescriptions">
                    No prescriptions uploaded yet.
                </p>
            `;

            return;
        }


        prescriptionList.innerHTML =
            prescriptions.map(
                prescription => {

                    const date =
                        prescription.uploaded_at
                            ? new Date(
                                prescription.uploaded_at
                              ).toLocaleDateString()
                            : "";


                    return `
                        <div class="prescription-item">

                            <div class="prescription-item-info">

                                <div class="prescription-item-icon">
                                    📄
                                </div>

                                <div>

                                    <div class="prescription-item-name">
                                        ${escapeHtml(
                                            prescription.filename
                                        )}
                                    </div>

                                    <div class="prescription-item-date">
                                        Uploaded ${date}
                                    </div>

                                </div>

                            </div>

                        </div>
                    `;
                }
            ).join("");


    } catch (error) {

        console.error(
            "Prescription loading error:",
            error
        );

        prescriptionList.innerHTML = `
            <p class="empty-prescriptions">
                Unable to load prescriptions.
            </p>
        `;
    }
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;
}