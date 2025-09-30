$(document).ready(function() {
    // Logout button
    $('#logoutBtn').click(function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});
