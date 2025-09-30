const form = document.getElementById('contact-form');
const select = form.message_type;

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear the form
    this.reset();

    // Clear session storage
    sessionStorage.clear();

    // Show success message
    const successMsg = document.getElementById("success-message");
    successMsg.style.display = "block";

    // Hide message after a few seconds
    setTimeout(() => {
        successMsg.style.display = "none";
    }, 4000);
});

// Save input values on change
form.addEventListener('input', () => {
    sessionStorage.setItem('contactForm', JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
    }));
});

// Restore input values on page load
window.addEventListener('load', () => {
  const saved = JSON.parse(sessionStorage.getItem('contactForm'));
  if (saved) {
    form.name.value = saved.name || '';
    form.email.value = saved.email || '';
    form.message.value = saved.message || '';
  }
});

// Save selected option whenever it changes
select.addEventListener('change', () => {
    sessionStorage.setItem('messageType', select.value);
});

// Restore previously selected option on page load
window.addEventListener('load', () => {
    const savedType = sessionStorage.getItem('messageType');
    if (savedType) {
        select.value = savedType;
    }
});