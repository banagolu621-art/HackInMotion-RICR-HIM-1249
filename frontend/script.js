const API_BASE =
    "http://127.0.0.1:5000";


// =================================================
// LOGIN CHECK
// =================================================

function isLoggedIn() {

    return localStorage.getItem(
        "smartMedicineLoggedIn"
    ) === "true";
}


function requireLogin() {

    if (!isLoggedIn()) {

        window.location.href =
            "login.html";

        return false;
    }

    return true;
}


// =================================================
// PAGE LOAD
// =================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchBtn =
            document.getElementById(
                "searchBtn"
            );

        const interactionBtn =
            document.getElementById(
                "interactionBtn"
            );

        const safetyBtn =
            document.getElementById(
                "safetyBtn"
            );


        // -----------------------------------------
        // SEARCH BUTTON
        // -----------------------------------------

        searchBtn?.addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "search-section"
                    )
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                document
                    .getElementById(
                        "medicineSearch"
                    )
                    .focus();
            }
        );


        // -----------------------------------------
        // INTERACTION BUTTON
        // -----------------------------------------

        interactionBtn?.addEventListener(
            "click",
            function () {

                if (!requireLogin())
                    return;

                document
                    .getElementById(
                        "interaction-section"
                    )
                    .scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );


        // -----------------------------------------
        // SAFETY BUTTON
        // -----------------------------------------

        safetyBtn?.addEventListener(
            "click",
            function () {

                if (!requireLogin())
                    return;

                document
                    .getElementById(
                        "safety-section"
                    )
                    .scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );


        document
            .getElementById(
                "medicineSearchBtn"
            )
            ?.addEventListener(
                "click",
                searchMedicine
            );


        document
            .getElementById(
                "checkInteractionBtn"
            )
            ?.addEventListener(
                "click",
                checkInteraction
            );


        document
            .getElementById(
                "safetyBtnPage"
            )
            ?.addEventListener(
                "click",
                getSafetyInfo
            );


        updateLoginButton();
    }
);


// =================================================
// LOGIN / LOGOUT BUTTON
// =================================================

function updateLoginButton() {

    const loginNav =
        document.getElementById(
            "loginNav"
        );

    if (!loginNav)
        return;


    if (isLoggedIn()) {

        loginNav.textContent =
            "Logout";

        loginNav.href =
            "#";


        loginNav.onclick =
            function () {

                localStorage.removeItem(
                    "smartMedicineLoggedIn"
                );

                localStorage.removeItem(
                    "smartMedicineUser"
                );

                window.location.reload();
            };
    }
}


// =================================================
// SEARCH MEDICINE
// RxNorm Backend
// =================================================

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


    const medicine =
        input.value.trim();


    if (!medicine) {

        status.textContent =
            "Please enter a medicine name.";

        results.innerHTML = "";

        return;
    }


    status.textContent =
        "Searching RxNorm...";


    results.innerHTML = "";


    try {

        const response =
            await fetch(

                API_BASE +
                "/drug/search?name=" +
                encodeURIComponent(
                    medicine
                )
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Search failed"
            );
        }


        if (
            !data.results ||
            data.results.length === 0
        ) {

            status.textContent =
                "No medicine found.";

            return;
        }


        status.textContent =
            `Found ${data.results.length} medicine result(s).`;


        results.innerHTML =
            data.results.map(
                drug => `

                <div class="result-card">

                    <h3>
                        ${escapeHTML(
                            drug.name
                        )}
                    </h3>

                    <p>
                        <strong>RxCUI:</strong>
                        ${escapeHTML(
                            drug.rxcui
                        )}
                    </p>

                    <span class="badge">
                        RxNorm
                    </span>

                </div>

            `
            ).join("");
    }


    catch (error) {

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



// =================================================
// INTERACTION
// =================================================

async function checkInteraction() {

    if (!requireLogin())
        return;


    const drug1 =
        document.getElementById(
            "drug1"
        ).value.trim();


    const drug2 =
        document.getElementById(
            "drug2"
        ).value.trim();


    const result =
        document.getElementById(
            "interactionResult"
        );


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

            Checking drug interaction...

        </div>

    `;


    try {

        const response =
            await fetch(

                API_BASE +
                "/check-interaction?" +

                "drug1=" +
                encodeURIComponent(drug1) +

                "&drug2=" +
                encodeURIComponent(drug2)
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Interaction check failed"
            );
        }


        let className =
            data.status === "warning"
                ? "warning"
                : "success";


        let interactionHTML = "";


        if (
            data.interactions &&
            data.interactions.length
        ) {

            interactionHTML = `

                <h3>
                    Relevant Information
                </h3>

                ${data.interactions.map(
                    text => `

                    <p>
                        ${escapeHTML(text)}
                    </p>

                `
                ).join("")}

            `;
        }


        result.innerHTML = `

            <div
                class="result-box ${className}"
            >

                <h3>
                    ${escapeHTML(
                        data.status
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        data.message
                    )}
                </p>

                <p>
                    <strong>
                        Medicine 1:
                    </strong>

                    ${escapeHTML(
                        data.drug1
                    )}
                </p>

                <p>
                    <strong>
                        Medicine 2:
                    </strong>

                    ${escapeHTML(
                        data.drug2
                    )}
                </p>

                ${interactionHTML}

            </div>
        `;
    }


    catch (error) {

        result.innerHTML = `

            <div class="result-box error">

                ${escapeHTML(
                    error.message
                )}

            </div>

        `;
    }
}



// =================================================
// SAFETY INFORMATION
// OpenFDA Backend
// =================================================

async function getSafetyInfo() {

    if (!requireLogin())
        return;


    const medicine =
        document.getElementById(
            "safetyMedicine"
        ).value.trim();


    const result =
        document.getElementById(
            "safetyResult"
        );


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

            Loading OpenFDA information...

        </div>

    `;


    try {

        const response =
            await fetch(

                API_BASE +
                "/safety?name=" +
                encodeURIComponent(
                    medicine
                )
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Safety lookup failed"
            );
        }


        result.innerHTML = `

            <div class="result-box">

                <h3>
                    ${escapeHTML(
                        data.medicine
                    )}
                </h3>

                <p>

                    <strong>
                        Manufacturer:
                    </strong>

                    ${escapeHTML(
                        data.manufacturer
                    )}

                </p>


                <p>

                    <strong>
                        Indication:
                    </strong>

                    ${escapeHTML(
                        data.indication
                    )}

                </p>


                <p>

                    <strong>
                        Warnings:
                    </strong>

                    ${escapeHTML(
                        data.warning
                    )}

                </p>


                <p>

                    <strong>
                        Interaction information:
                    </strong>

                    ${escapeHTML(
                        data.interaction_info
                    )}

                </p>

            </div>

        `;
    }


    catch (error) {

        result.innerHTML = `

            <div class="result-box error">

                ${escapeHTML(
                    error.message
                )}

            </div>

        `;
    }
}



// =================================================
// SECURITY
// =================================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}