let recipes = [];
let displayRecipes = [];
let showFavourites = false;


// Load recipe from JSON
async function loadRecipes() {
    try {
        const response = await fetch('./data/recipe.json');
        recipes = await response.json();
        displayRecipes = [...recipes];
        renderRecipes(displayRecipes);
    }

    catch (error) {
        console.error("Error loading recipes", error);
    }
}

// Recipe on Page
function renderRecipes(recipesToDisplay) {
    const recipeGrid = document.getElementById('recipeGrid');
    const noResults = document.getElementById('noResults');
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    // Sort favourites
    recipesToDisplay.sort((a, b) => {
        const aFav = favourites.includes(a.id) ? -1 : 0;
        const bFav = favourites.includes(b.id) ? -1 : 0;

        return aFav - bFav;
    });

    if (recipesToDisplay.length === 0) {
        recipeGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    recipeGrid.style.display = 'grid';
    noResults.style.display = 'none';

    recipeGrid.innerHTML = recipesToDisplay.map(recipe => {
        const isFav = favourites.includes(recipe.id);
        return `
        <div class="recipe-card ${isFav ? 'favorite-card' : ''}" onclick="openModal(${recipe.id})">
            <div style="position: relative;">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                <span class="favorite" onclick="toggleFavourite(event, ${recipe.id})">
                    ${isFav ? '❤️' : '🤍'}
                 </span>
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-meta">
                    <span class="recipe-time">⏱️ ${recipe.time}</span>
                    <span class="recipe-difficulty">🔥 ${recipe.difficulty}</span>
                    <span class="recipe-cuisine">🍽️ ${recipe.cuisine}</span>
                </div>
            </div>
        </div>`;
    }).join('');
}

// Toggle Favourites
function toggleFavourite(event, recipeID) {
    event.stopPropagation();
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    if (favourites.includes(recipeID)) {
        favourites = favourites.filter(id => id !== recipeID);
    } else {
        favourites.push(recipeID);
    }

    localStorage.setItem('favourites', JSON.stringify(favourites));
    setCookie('favourites', JSON.stringify(favourites), 365);
    renderRecipes(displayRecipes);
}

function filterFavourites() {
    showFavourites = !showFavourites;
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    displayRecipes = showFavourites ? recipes.filter(r => favourites.includes(r.id)) : [...recipes];
    renderRecipes(displayRecipes);
    const btn = document.getElementById('favFilterBtn');
    btn.textContent = showFavourites ? "Show all" : "Show Favourites";
}

//Pop out Model with Detail
function openModal(recipeID) {
    const recipe = recipes.find(r => r.id == recipeID);
    const modal = document.getElementById('recipeModal');

    document.getElementById('modalImg').src = recipe.image;
    document.getElementById('modalTitle').textContent = recipe.title;

    document.getElementById('modalMeta').innerHTML = `
    <div class="recipe-meta">
        <span class="recipe-time">⏱️ ${recipe.time}</span>
        <span class="recipe-difficulty">🔥 ${recipe.difficulty}</span>
        <span class="recipe-cuisine">🍽️ ${recipe.cuisine}</span>
    </div>
    `;

    document.getElementById('modalIngredients').innerHTML = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');

    document.getElementById('modalInstructions').innerHTML = recipe.instructions.map((step) => `<li>${step}</li>`).join('');

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('recipeModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}


// Search Functionality
function searchRecipes() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    displayRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(search) ||
        recipe.description.toLowerCase().includes(search) ||
        recipe.cuisine.toLowerCase().includes(search) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(search))
    );

    if (showFavourites) {
        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        displayRecipes = displayRecipes.filter(r => favourites.includes(r.id));
    }

    renderRecipes(displayRecipes);
}

// Local Storage and Cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();
}

// Auto Filter
document.getElementById('searchInput').addEventListener('input', searchRecipes);


// Close modal on outside click or Escape key
document.getElementById('recipeModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) {
        closeModal();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === "Escape") {
        closeModal();
    }
});

loadRecipes();

