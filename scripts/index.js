const showPopupBtn = document.querySelector('.js-login-btn');
const formPopup = document.querySelector('.form-popup');
const hidePopupBtn = document.querySelector('.form-popup .js-close-btn');
const loginSignupLink = document.querySelectorAll('.form-box .bottom-link a');

// Show form popup
showPopupBtn.addEventListener("click", () => {
    document.body.classList.toggle("show-popup");
});

// Hide form popup
hidePopupBtn.addEventListener("click", () => showPopupBtn.click());

loginSignupLink.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        formPopup.classList[link.id === "signup-link" ? 'add' : 'remove']("show-signup");
    });
});


// --- jQuery for signup/login logic ---
$(document).ready(function() {

    // --- SIGNUP ---
    $('#signupForm').submit(function(e) {
        e.preventDefault();

        const email = $('#signupEmail').val();
        const password = $('#signupPassword').val();
        const agreed = $('#policy').is(':checked');

        $('#signupMessage').hide();
        $('#signupError').hide();

        if (!agreed) {
            $('#signupError').text('You must agree to the Terms & Conditions.').show();
            return;
        }

        // Call MockAPI to create new user
        $.ajax({
            url: 'https://68b19d5aa860fe41fd5f07f1.mockapi.io/users',
            method: 'POST',
            data: { email: email, password: password },
            success: function(res) {
                $('#signupMessage').text('Account created successfully! Please login.').show();
                setTimeout(() => {
                    formPopup.classList.remove('show-signup');
                    $('#signupMessage').fadeOut();
                }, 1200);
            },
            error: function(xhr, status, err) {
                $('#signupError').text('Signup failed. Check console.').show();
                console.error("Signup error:", err);
            }
        });
    });


    // --- LOGIN ---
    $('#loginForm').submit(function(e) {
        e.preventDefault();

        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        $('#loginMessage').hide();
        $('#loginError').hide();

        // Fetch users from MockAPI
        $.ajax({
            url: 'https://68b19d5aa860fe41fd5f07f1.mockapi.io/users',
            method: 'GET',
            success: function(users) {
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    $('#loginMessage').text('Login successful! Redirecting...').show();
                    setTimeout(() => {
                        localStorage.setItem('isLoggedIn', true);
                        localStorage.setItem('currentUser', email);
                        window.location.href = 'homepage.html';
                    }, 1200);
                } else {
                    $('#loginError').text('Invalid email or password').show();
                }
            },
            error: function() {
                $('#loginError').text('Login failed. Please try again.').show();
            }
        });
    });

    // --- FORGOT PASSWORD (Reset flow) ---
    $('.forgot-pass').click(function(e) {
        e.preventDefault();

        const email = prompt("Enter your registered email to reset password:");

        if (!email) return;

        // Step 1: Fetch all users
        $.ajax({
            url: 'https://68b19d5aa860fe41fd5f07f1.mockapi.io/users',
            method: 'GET',
            success: function(users) {
                const user = users.find(u => u.email === email);

                if (user) {
                    // Step 2: Generate a temporary password
                    const tempPassword = "temp" + Math.floor(Math.random() * 10000);

                    // Step 3: Update this user’s password with PUT
                    $.ajax({
                        url: `https://68b19d5aa860fe41fd5f07f1.mockapi.io/users/${user.id}`,
                        method: 'PUT',
                        data: { password: tempPassword },
                        success: function() {
                            alert("Your password has been reset.\nTemporary password: " + tempPassword + "\nPlease log in and change it.");
                        },
                        error: function() {
                            alert("Error updating password. Try again.");
                        }
                    });
                } else {
                    alert("Email not found!");
                }
            },
            error: function() {
                alert("Error fetching user data. Try again.");
            }
        });
    });

});