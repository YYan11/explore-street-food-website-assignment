//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  The Swiper JS are referenced and modified from GitHub: https://github.com/emetdas/Youtube-code/tree/master/web%20components/Swiper-Slider-3D-Coverflow  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { foods } from '../data/food.js';

// Generate slides
const swiperWrapper = document.querySelector(".spin-slider .swiper-wrapper");

foods.forEach(item => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide", "spin-slide");

    slide.setAttribute("data-id", item.id);

    slide.innerHTML = `
    <div class="spin-slide-img" >
        <img src="${item.image}" alt="${item.name}">
    </div>
    <div class="spin-slide-content">
        <h2 class="food-name">${item.name}</h2>
        <h3 class="food-rating">
            <span>${item.rating.stars.toFixed(1)}</span>
            <div class="rating">
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
            </div>
            <span>(${item.rating.count} Reviews)</span>
        </h3>
    </div>
    `;
    swiperWrapper.appendChild(slide);

    // Add click listener to image
    const img = slide.querySelector('img');
    img.addEventListener('click', () => {
        showFoodDetails(item.id);
    });
    
});

// Initialize Swiper
var SpinSlider = new Swiper('.spin-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
    },
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
});

// Trigger when spin button is clicked
document.getElementById('spinButton').addEventListener('click', function () {

    const totalSlides = SpinSlider.slides.length - SpinSlider.loopedSlides * 2; // real slides
    const randomIndex = Math.floor(Math.random() * totalSlides); // random real slide
    const currentIndex = SpinSlider.realIndex;

    // Calculate forward distance
    let forwardSteps = randomIndex - currentIndex;
    if (forwardSteps <= 0) {
        forwardSteps += totalSlides;
    }

    const forwardTarget = (currentIndex + forwardSteps) % totalSlides;

    // Use slideToLoop to ensure correct loop indexing
    SpinSlider.slideToLoop(forwardTarget, 3000, true); // 3 seconds spin

    // After spin ends, load the details and REPLACE the content
    setTimeout(() => {
        const selectedSlide = SpinSlider.slides[SpinSlider.activeIndex];
        const foodId = parseInt(selectedSlide.getAttribute('data-id'));

        showFoodDetails(foodId);
        document.getElementById('backToTop').style.display = "block";

    }, 3000); // match spin duration
});

function showFoodDetails(foodId) {
    const food = foods.find(f => f.id === foodId);
    if (food) {
        document.getElementById('details-row').style.display="block";
        const container = document.getElementById('dynamic-content');
        container.innerHTML = `
                <div class="text-center mb-3">
                <button id="backToTop" class="btn btn-toTop btn-secondary">︿</button>
                </div>
                <div class="card p-4">
                    <div class="row g-4 align-items-center">
                        <div class="col-12 col-md-5">
                            <img src="${food.image}" alt="${food.name}" class="img-fluid rounded">
                        </div>
                        <div class="col-12 col-md-7">
                            <h2>${food.name}</h2>
                            <p>${food.description}</p>
                            <p><strong>State:</strong> ${food.state}</p>
                            <p><strong>Location:</strong> ${food.location}</p>
                            <p><strong>Cuisine:</strong> ${food.cuisine}</p>
                            <p><strong>Rating:</strong> ${food.rating.stars.toFixed(1)} <ion-icon name="star"></ion-icon> (${food.rating.count} Reviews)</p>
                        </div>
                    </div>
                </div>
            `;
        
        container.style.display = "block";
        container.scrollIntoView({ behavior: 'smooth' });

        document.getElementById('backToTop').addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

