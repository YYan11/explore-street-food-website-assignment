export function initSwiper() {

    // Destroy old Swipers before re-init
    document.querySelectorAll('.card-wrapper').forEach((wrapper) => {
        if (wrapper.swiper) {
            wrapper.swiper.destroy(true, true);
        }

        // If no slides, skip init
        const slideCount = wrapper.querySelectorAll('.swiper-wrapper').length;
        if (slideCount === 0) return;

    
        wrapper.swiper = new Swiper(wrapper, {
            loop: slideCount > 3, // loop only if enough slides
            spaceBetween: 30,

            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },

            pagination: {
                el: wrapper.querySelector('.swiper-pagination'),
                clickable: true,
                dynamicBullets: true,
            },

            navigation: {
                nextEl: wrapper.querySelector('.swiper-button-next'),
                prevEl: wrapper.querySelector('.swiper-button-prev'),
            },

            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    });
}


