// auth.js
$(document).ready(function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        // Force reload instead of showing cached page
        window.location.replace('index.html');
    }
});
