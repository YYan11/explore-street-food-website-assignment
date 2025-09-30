window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 200) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const states = document.querySelectorAll('.state');
const tooltip = document.getElementById('map-tooltip');

states.forEach(state => {
  state.addEventListener('mousemove', e => {
    tooltip.style.display = 'block';
    tooltip.style.left = e.pageX + 10 + 'px';
    tooltip.style.top = e.pageY + 10 + 'px';
    tooltip.textContent = state.getAttribute('data-food');
  });

  state.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });

  // Optional: click to go to state page
  state.addEventListener('click', () => {
    const stateId = state.id;
    window.location.href = `map.html?state=${stateId}`;
  });
});
