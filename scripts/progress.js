document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.food-tried input[type="checkbox"]');
    const achievementCards = document.querySelectorAll('.achievements-card');
    const overallProgress = document.getElementById('overall-progress');
    const progressCircle = document.querySelector('.progress-circle');

    const foodsTriedElement = document.getElementById('foods-tried');
    const chineseExploredElement = document.getElementById('chinese-explored');
    const malayExploredElement = document.getElementById('malay-explored');
    const indianExploredElement = document.getElementById('indian-explored');

    // localStorage
    const savedProgress = JSON.parse(localStorage.getItem('foodProgress')) || {};

    checkboxes.forEach(cb => {
        if (savedProgress[cb.dataset.food]) {
            cb.checked = true;

            const label = cb.closest('label');
            if (cb.checked) {
                label.style.backgroundColor = "rgb(255, 71, 71)";
                label.style.color = 'white';
                label.style.transform = 'scale(1.05)';
            }

            else {
                label.style.backgroundColor = "hsl(0, 0%, 30%)";
                label.style.color = 'white';
                label.style.transform = 'scale(1)';
            }
        }
    });

    // UpdateProgess
    function updateProgress() {
        const totalFoods = checkboxes.length;
        const checkedFoods = Array.from(checkboxes).filter(cb => cb.checked).length;

        const percent = Math.round((checkedFoods / totalFoods) * 100);
        overallProgress.textContent = percent + '%';

        //Update % of progess in circle
        progressCircle.style.background = `conic-gradient(hsl(41, 98%, 56%) ${percent}%, #ddd ${percent}% 100%)`;


        foodsTriedElement.textContent = checkedFoods;

        const categories = {
            chinese: { total: 0, checked: 0 },
            malay: { total: 0, checked: 0 },
            indian: { total: 0, checked: 0 }
        };

        checkboxes.forEach(cb => {
            const cat = cb.dataset.category;
            if (categories[cat]) {
                categories[cat].total++;
                if (cb.checked) {
                    categories[cat].checked++;
                }
            }
        });

        chineseExploredElement.textContent = categories.chinese.checked;
        malayExploredElement.textContent = categories.malay.checked;
        indianExploredElement.textContent = categories.indian.checked;

        Object.keys(categories).forEach(cat => {
            const areaCards = document.querySelectorAll('.area-card');
            areaCards.forEach(card => {
                const categoryCheckboxes = card.querySelectorAll(`input[data-category="${cat}"]`);
                if (categoryCheckboxes.length > 0) {
                    const fill = card.querySelector('.progress-fill');
                    const c = categories[cat];
                    const categoryPercent = c.total > 0 ? (c.checked / c.total) * 100 : 0;
                    fill.style.width = categoryPercent + '%';
                }
            });
        });

        // Notice User Target Achievements
        if (checkedFoods === 1) alert("Congratulation you have tried 1 foods!");
        if (checkedFoods === 5) alert("Congratulation you have tried 5 foods!");
        if (checkedFoods === 15) alert("Congratulation you have tried 15 foods!");
        if (checkedFoods === 20) alert("Congratulation you have tried 20 foods!");
        if (checkedFoods === 30) alert("Congratulation you have tried 30 foods!");
        if (checkedFoods === totalFoods) alert("Congratulation you have tried all food!");
        if (checkedFoods === totalFoods) {
            showCelebration();
            launchConfetti();
        }

        // Update Achievements
        achievementCards.forEach(card => {
            const condition = parseInt(card.dataset.condition);
            if (checkedFoods >= condition) {
                card.className = 'achievements-card-unlocked';
            } else {
                card.className = 'achievements-card';
            }
        });

        // Saved
        const progressToSave = {};
        checkboxes.forEach(cb => {
            progressToSave[cb.dataset.food] = cb.checked;
        });
        localStorage.setItem('foodProgress', JSON.stringify(progressToSave));
    }

    // Reset
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset / Clear Progress";
    resetButton.className = "reset-button";
    resetButton.style.margin = "20px";
    resetButton.onclick = () => {
        if (confirm("Do you clean all the progress? It cannot recover back the progress")) {
            localStorage.removeItem("foodProgress");
            checkboxes.forEach(cb => {
                cb.checked = false;
                const label = cb.closest('label');
                label.style.backgroundColor = "hsl(0, 0%, 30%)";
                label.style.color = 'white';
                label.style.transform = 'scale(1)';
            });
            updateProgress();
        }
    };

    document.querySelector(".container").appendChild(resetButton);

    // Celebration effect
    function showCelebration() {
        const celebration = document.createElement("div");
        celebration.innerHTML = "Congratulation you have tried explroed all food!";
        celebration.className = "celebration";
        celebration.style.position = "fixed";
        celebration.style.top = "50%";
        celebration.style.left = "50%";
        celebration.style.transform = "translate(-50%, -50%)";
        celebration.style.background = "rgba(255,255,255,0.9)";
        celebration.style.padding = "20px 40px";
        celebration.style.fontSize = "2rem";
        celebration.style.fontWeight = "bold";
        celebration.style.color = "hsl(0, 0%, 20%)";
        celebration.style.borderRadius = "12px";
        celebration.style.zIndex = "1000";
        document.body.appendChild(celebration);

        setTimeout(() => celebration.remove(), 3000);
    }

    // confetti
    function launchConfetti() {
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', function () {
            const label = this.closest('label');
            if (this.checked) {
                label.style.backgroundColor = "rgb(255, 71, 71)";
                label.style.color = 'white';
                label.style.transform = 'scale(1.05)';
            } else {
                label.style.backgroundColor = 'hsl(0, 0%, 30%)';
                label.style.color = 'white';
                label.style.transform = 'scale(1)';
            }

            updateProgress();
        });
    });

    updateProgress();

});
