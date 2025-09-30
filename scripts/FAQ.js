// App state - using memory instead of localStorage
const app = {
    viewedFaqs: new Set(),
    searchCount: 0,
    startTime: Date.now(),
    cookieChoice: null, // null = not chosen, object = detailed preferences
    cookieActions: []
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initAnimations();
    showCookieNotification();
});

// FAQ toggle function
function toggleFaq(id) {
    const content = document.getElementById(`content-${id}`);
    const header = content.previousElementSibling;
    const icon = header.querySelector('.faq-icon');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-content').forEach(item => {
        if (item !== content && item.classList.contains('active')) {
            item.classList.remove('active');
            item.previousElementSibling.classList.remove('active');
            item.previousElementSibling.querySelector('.faq-icon').style.transform = '';
        }
    });
    
    // Toggle current FAQ
    const isOpen = content.classList.contains('active');
    
    if (isOpen) {
        content.classList.remove('active');
        header.classList.remove('active');
        icon.style.transform = '';
    } else {
        content.classList.add('active');
        header.classList.add('active');
        icon.style.transform = 'rotate(180deg)';
        
        // Track view
        if (!app.viewedFaqs.has(id)) {
            app.viewedFaqs.add(id);
            updateStats();
        }
    }
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('faqSearch');
    let timeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const query = this.value.toLowerCase().trim();
            searchFaqs(query);
            if (query.length > 2) {
                app.searchCount++;
                updateStats();
            }
        }, 300);
    });
}

function searchFaqs(query) {
    const items = document.querySelectorAll('.faq-item');
    const noResults = document.getElementById('noResults');
    let visible = 0;
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const keywords = item.dataset.keywords || '';
        const matches = query === '' || text.includes(query) || keywords.includes(query);
        
        item.style.display = matches ? 'block' : 'none';
        if (matches) visible++;
    });
    
    noResults.style.display = visible === 0 && query.length > 0 ? 'block' : 'none';
}

function clearSearch() {
    document.getElementById('faqSearch').value = '';
    searchFaqs('');
}

// Update stats with animation
function updateStats() {
    updateStat('viewedFaqs', app.viewedFaqs.size);
    updateStat('searchCount', app.searchCount);
}

function updateStat(id, value) {
    const el = document.getElementById(id);
    el.classList.add('updated');
    el.textContent = value;
    setTimeout(() => el.classList.remove('updated'), 600);
}

// Animations
function initAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced cookie handling with detailed preferences
function showCookieNotification() {
    // Only show if user hasn't made a choice in this session
    if (app.cookieChoice === null) {
        setTimeout(() => {
            document.getElementById('cookieNotification').classList.add('show');
        }, 2000);
    }
}

function acceptCookies() {
    app.cookieChoice = {
        accepted: true,
        essential: true,
        analytics: true,
        marketing: true,
        social: true,
        timestamp: Date.now()
    };
    
    hideCookieNotification();
    showToast('All cookie preferences accepted for this session!', 'success');
    
    // Track acceptance
    app.cookieActions = app.cookieActions || [];
    app.cookieActions.push({
        action: 'accept_all',
        timestamp: Date.now()
    });
}

function declineCookies() {
    app.cookieChoice = {
        accepted: false,
        essential: true, // Always required
        analytics: false,
        marketing: false,
        social: false,
        timestamp: Date.now()
    };
    
    hideCookieNotification();
    showToast('Only essential cookies enabled for this session!', 'info');
    
    // Track decline
    app.cookieActions = app.cookieActions || [];
    app.cookieActions.push({
        action: 'decline_all',
        timestamp: Date.now()
    });
}

function showCookieSettings() {
    const modalElement = document.getElementById('cookieSettingsModal');
    const modal = new bootstrap.Modal(modalElement);
    
    // Load current preferences if they exist
    if (app.cookieChoice && typeof app.cookieChoice === 'object') {
        document.getElementById('analyticsCookies').checked = app.cookieChoice.analytics || false;
        document.getElementById('marketingCookies').checked = app.cookieChoice.marketing || false;
        document.getElementById('socialCookies').checked = app.cookieChoice.social || false;
    }
    
    modal.show();
}

function saveCookiePreferences() {
    app.cookieChoice = {
        accepted: true,
        essential: true, // Always required
        analytics: document.getElementById('analyticsCookies').checked,
        marketing: document.getElementById('marketingCookies').checked,
        social: document.getElementById('socialCookies').checked,
        timestamp: Date.now()
    };
    
    hideCookieNotification();
    const modal = bootstrap.Modal.getInstance(document.getElementById('cookieSettingsModal'));
    if (modal) modal.hide();
    
    // Track custom preferences
    app.cookieActions = app.cookieActions || [];
    app.cookieActions.push({
        action: 'custom_settings',
        preferences: app.cookieChoice,
        timestamp: Date.now()
    });
    
    // Show confirmation
    const enabledCount = Object.values(app.cookieChoice).filter(v => v === true).length - 1; // Subtract 1 for 'accepted' field
    showToast(`Cookie preferences saved! ${enabledCount} cookie types enabled for this session.`, 'success');
}

function hideCookieNotification() {
    const notification = document.getElementById('cookieNotification');
    notification.classList.remove('show');
    notification.style.transform = 'translateY(100%)';
}

// Check if user has already made cookie choice
function checkCookieChoice() {
    return app.cookieChoice !== null;
}

// Get specific cookie preference
function getCookiePreference(type) {
    if (!app.cookieChoice || typeof app.cookieChoice !== 'object') {
        return type === 'essential'; // Default: only essential cookies
    }
    return app.cookieChoice[type] || false;
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.cssText = `
        top: 100px; right: 20px; z-index: 10000; 
        opacity: 0; transform: translateX(100%);
        transition: all 0.3s ease; min-width: 300px;
    `;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle me-2"></i>
        ${message}
        <button class="btn-close float-end" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('faqSearch');
        if (searchInput.value) {
            clearSearch();
            searchInput.focus();
        }
    }
});