document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ==========================================
        // SIGN UP
        // ==========================================

        const signupForm =
            document.getElementById(
                "signupForm"
            );


        signupForm?.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "signupName"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "signupEmail"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "signupPassword"
                    ).value;


                const user = {

                    name: name,

                    email: email,

                    password: password
                };


                localStorage.setItem(

                    "smartMedicineUser",

                    JSON.stringify(user)
                );


                localStorage.setItem(

                    "smartMedicineLoggedIn",

                    "true"
                );


                document.getElementById(
                    "signupMessage"
                ).textContent =
                    "Account created successfully!";


                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    700
                );

            }
        );



        // ==========================================
        // LOGIN
        // ==========================================

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        loginForm?.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document.getElementById(
                        "loginEmail"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "loginPassword"
                    ).value;


                const savedUser =
                    JSON.parse(

                        localStorage.getItem(
                            "smartMedicineUser"
                        ) || "null"

                    );


                if (!savedUser) {

                    document.getElementById(
                        "loginMessage"
                    ).textContent =
                        "Account not found. Please sign up first.";

                    return;
                }


                if (

                    email !== savedUser.email ||

                    password !== savedUser.password

                ) {

                    document.getElementById(
                        "loginMessage"
                    ).textContent =
                        "Incorrect email or password.";

                    return;
                }


                localStorage.setItem(

                    "smartMedicineLoggedIn",

                    "true"
                );


                document.getElementById(
                    "loginMessage"
                ).textContent =
                    "Login successful!";


                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    700
                );

            }
        );

    }
);