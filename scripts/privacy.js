// Privacy page data management
let privacyData = {
    currentPage: 'privacy',
    sectionsViewed: [],
    scrollProgress: 0,
    readingTime: 0,
    startTime: Date.now()
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadPrivacyData();
    checkCookieConsent();
    trackPageVisit('privacy');
    animateElements();
    initializeScrollTracking();
    initializeSectionTracking();
});

// Storage functions
function getStoredData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.warn('Error reading from localStorage:', e);
        return null;
    }
}

function setStoredData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn('Error writing to localStorage:', e);
    }
}

function loadPrivacyData() {
    const stored = getStoredData('privacyData');
    if (stored) {
        privacyData = { ...privacyData, ...stored };
    }
}

function savePrivacyData() {
    setStoredData('privacyData', privacyData);
}

function trackPageVisit(page) {
    const visitData = getStoredData('websiteVisits') || [];
    visitData.push({
        page: page,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
    });
    setStoredData('websiteVisits', visitData);
}

// Scroll tracking for privacy policy reading
function initializeScrollTracking() {
    let isReading = true;
    
    window.addEventListener('scroll', function() {
        if (isReading) {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            privacyData.scrollProgress = Math.max(privacyData.scrollProgress, scrollPercent);
            
            // Track reading milestones
            if (scrollPercent > 25 && !privacyData.sectionsViewed.includes('25%')) {
                privacyData.sectionsViewed.push('25%');
            }
            if (scrollPercent > 50 && !privacyData.sectionsViewed.includes('50%')) {
                privacyData.sectionsViewed.push('50%');
            }
            if (scrollPercent > 75 && !privacyData.sectionsViewed.includes('75%')) {
                privacyData.sectionsViewed.push('75%');
            }
            if (scrollPercent > 90 && !privacyData.sectionsViewed.includes('100%')) {
                privacyData.sectionsViewed.push('100%');
            }
        }
    });
}

// Section tracking
function initializeSectionTracking() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId && !privacyData.sectionsViewed.includes(sectionId)) {
                    privacyData.sectionsViewed.push(sectionId);
                    savePrivacyData();
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.policy-section[id]').forEach(section => {
        observer.observe(section);
    });
}

// Animation
function animateElements() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('active');
        }, index * 150);
    });
}

// Cookie management functions
function checkCookieConsent() {
    const consent = getStoredData('cookieConsent');
    if (!consent) {
        setTimeout(() => {
            document.getElementById('cookieNotification').classList.add('show');
        }, 2000);
    }
}

function acceptCookies() {
    const consent = {
        accepted: true,
        essential: true,
        analytics: true,
        marketing: true,
        social: true,
        timestamp: Date.now()
    };
    
    setStoredData('cookieConsent', consent);
    document.getElementById('cookieNotification').classList.remove('show');
    
    // Track acceptance
    privacyData.cookieActions = privacyData.cookieActions || [];
    privacyData.cookieActions.push({
        action: 'accept_all',
        timestamp: Date.now()
    });
    savePrivacyData();
}

function declineCookies() {
    const consent = {
        accepted: false,
        essential: true, // Always required
        analytics: false,
        marketing: false,
        social: false,
        timestamp: Date.now()
    };
    
    setStoredData('cookieConsent', consent);
    document.getElementById('cookieNotification').classList.remove('show');
    
    // Track decline
    privacyData.cookieActions = privacyData.cookieActions || [];
    privacyData.cookieActions.push({
        action: 'decline_all',
        timestamp: Date.now()
    });
    savePrivacyData();
}

function showCookieSettings() {
    new bootstrap.Modal(document.getElementById('cookieSettingsModal')).show();
}

function saveCookiePreferences() {
    const consent = {
        accepted: true,
        essential: true, // Always required
        analytics: document.getElementById('analyticsCookies').checked,
        marketing: document.getElementById('marketingCookies').checked,
        social: document.getElementById('socialCookies').checked,
        timestamp: Date.now()
    };
    
    setStoredData('cookieConsent', consent);
    document.getElementById('cookieNotification').classList.remove('show');
    bootstrap.Modal.getInstance(document.getElementById('cookieSettingsModal')).hide();
    
    // Track custom preferences
    privacyData.cookieActions = privacyData.cookieActions || [];
    privacyData.cookieActions.push({
        action: 'custom_settings',
        preferences: consent,
        timestamp: Date.now()
    });
    savePrivacyData();
    
    // Show confirmation
    showNotification('Cookie preferences saved successfully!', 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style = 'top: 100px; right: 20px; z-index: 9999; max-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// jQuery enhancements
$(document).ready(function() {
    // Smooth scrolling for table of contents
    $('.table-of-contents a').on('click', function(event) {
        event.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800);
            
            // Track section navigation
            privacyData.sectionClicks = privacyData.sectionClicks || [];
            privacyData.sectionClicks.push({
                section: this.getAttribute('href'),
                timestamp: Date.now()
            });
            savePrivacyData();
        }
    });

    // Track reading time
    let readingStartTime = Date.now();
    $(window).on('beforeunload', function() {
        privacyData.readingTime = Date.now() - readingStartTime;
        savePrivacyData();
    });

    // Enhanced navigation highlighting
    $(window).scroll(function() {
        const scrollTop = $(this).scrollTop();
        
        $('.policy-section[id]').each(function() {
            const sectionTop = $(this).offset().top - 150;
            const sectionBottom = sectionTop + $(this).outerHeight();
            const sectionId = $(this).attr('id');
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                $('.table-of-contents a').removeClass('active');
                $(`.table-of-contents a[href="#${sectionId}"]`).addClass('active');
            }
        });
    });
});

// Session storage for current session
function setSessionData(key, data) {
    try {
        sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn('Unable to store session data');
    }
}

// Track session data
setSessionData('privacySession', {
    page: 'privacy',
    startTime: Date.now(),
    sections: [],
    interactions: 0
});

// RESTful API simulation for privacy compliance
function checkPrivacyCompliance() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 'success',
                data: {
                    complianceScore: 95,
                    lastAudit: '2024-03-01',
                    certifications: ['PDPA', 'GDPR-Ready'],
                    dataProcessingLegal: true
                }
            });
        }, 800);
    });
}

// Load compliance data
checkPrivacyCompliance().then(data => {
    console.log('Privacy compliance check:', data);
    
    privacyData.complianceCheck = {
        result: data,
        timestamp: Date.now()
    };
    savePrivacyData();
});

// Track page engagement
let engagementTimer = setInterval(() => {
    privacyData.timeOnPage = (privacyData.timeOnPage || 0) + 5;
    savePrivacyData();
}, 5000);

// Clean up timer on page unload
window.addEventListener('beforeunload', function() {
    clearInterval(engagementTimer);
    privacyData.totalTimeSpent = Date.now() - privacyData.startTime;
    savePrivacyData();
});

console.log('Privacy Policy page loaded successfully');