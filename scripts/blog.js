// Global variables for state management
let userPosts = [];
let likedPosts = [];
let searchHistory = [];
let currentFilter = 'all';

// Blog Writing and Publishing Functions
function showWriteBlogModal() {
    const modal = new bootstrap.Modal(document.getElementById('writeBlogModal'));
    modal.show();
    loadDraftFromStorage();
    setupAutoSave();
}

function showMyPostsModal() {
    const modal = new bootstrap.Modal(document.getElementById('myPostsModal'));
    modal.show();
    loadUserPosts();
}

function generateFoodImage(foodType) {
    const imageTemplates = {
        'nasi-lemak': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%234CAF50' width='400' height='250'/><circle fill='%23FFFFFF' cx='200' cy='125' r='60' opacity='0.9'/><rect fill='%23FF0000' x='150' y='180' width='100' height='8' rx='4'/><circle fill='%23FFD700' cx='160' cy='100' r='12'/><text x='200' y='210' text-anchor='middle' fill='white' font-size='16' font-weight='bold'>Nasi Lemak</text></svg>",
        'char-kuey-teow': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%238B4513' width='400' height='250'/><rect fill='%23FF6B35' x='50' y='100' width='120' height='20' rx='10' opacity='0.8'/><rect fill='%23F7931E' x='200' y='120' width='100' height='15' rx='8' opacity='0.8'/><circle fill='%23FFD700' cx='320' cy='80' r='15'/><text x='200' y='180' text-anchor='middle' fill='white' font-size='16' font-weight='bold'>Char Kuey Teow</text></svg>",
        'satay': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23654321' width='400' height='250'/><rect fill='%238B4513' x='100' y='50' width='8' height='150'/><rect fill='%238B4513' x='150' y='60' width='8' height='130'/><rect fill='%238B4513' x='200' y='45' width='8' height='160'/><rect fill='%238B4513' x='250' y='70' width='8' height='120'/><circle fill='%23FF6B35' cx='154' cy='40' r='8'/><text x='200' y='230' text-anchor='middle' fill='white' font-size='16' font-weight='bold'>Satay</text></svg>",
        'laksa': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23FF8C00' width='400' height='250'/><circle fill='%23FFD700' cx='200' cy='125' r='80' opacity='0.9'/><rect fill='%23FF6B35' x='120' y='100' width='160' height='8' rx='4' opacity='0.8'/><rect fill='%23FF6B35' x='130' y='120' width='140' height='6' rx='3' opacity='0.7'/><text x='200' y='190' text-anchor='middle' fill='white' font-size='16' font-weight='bold'>Laksa</text></svg>"
    };
    
    const imageUrl = imageTemplates[foodType] || imageTemplates['nasi-lemak'];
    document.getElementById('blogImageUrl').value = imageUrl;
    showImagePreview(imageUrl);
}

function showImagePreview(url) {
    if (url) {
        document.getElementById('previewImg').src = url;
        document.getElementById('imagePreview').style.display = 'block';
    } else {
        document.getElementById('imagePreview').style.display = 'none';
    }
}

function formatText(command) {
    const textarea = document.getElementById('blogContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    switch(command) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
    }
    
    if (selectedText) {
        textarea.setRangeText(formattedText, start, end, 'end');
        textarea.focus();
    }
}

function insertTemplate(templateType) {
    const textarea = document.getElementById('blogContent');
    let template = '';
    
    switch(templateType) {
        case 'recipe':
            template = `
                ## Recipe: [Dish Name]

                ### Ingredients:
                - Ingredient 1
                - Ingredient 2
                - Ingredient 3

                ### Instructions:
                1. Step 1
                2. Step 2
                3. Step 3

                ### Tips:
                - Tip 1
                - Tip 2

                **Cooking Time:** X minutes
                **Difficulty:** Easy/Medium/Hard
            `.trim();
        break;
        
        case 'review':
            template = `
                ## My Experience at [Restaurant/Stall Name]

                ### Location: 
                [Address and area]

                ### What I Ordered:
                - Dish 1
                - Dish 2

                ### The Good:
                - What I loved about it

                ### The Not-So-Good:
                - Areas for improvement

                ### Overall Verdict:
                [Your summary and rating]

                **Price Range:** RM X - RM Y
                **Best Time to Visit:** [Time/Day]
            `.trim();
        break;
    }
    
    const currentContent = textarea.value;
    const newContent = currentContent ? currentContent + '\n\n' + template : template;
    textarea.value = newContent;
    updateWordCount();
    textarea.focus();
}

function updateWordCount() {
    const content = document.getElementById('blogContent').value;
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const wordCountElement = document.getElementById('wordCount');
    
    if (wordCountElement) {
        wordCountElement.textContent = wordCount;
        
        if (wordCount < 50) {
            wordCountElement.className = 'word-count-warning';
            wordCountElement.parentElement.innerHTML = `Words: <span class="word-count-warning">${wordCount}</span> (minimum 50 recommended)`;
        } else {
            wordCountElement.className = '';
            wordCountElement.parentElement.innerHTML = `Words: <span>${wordCount}</span>`;
        }
    }
}

function setupAutoSave() {
    const inputs = ['blogTitle', 'blogAuthor', 'blogCategory', 'blogTags', 'blogContent', 'blogImageUrl', 'blogLocation', 'blogStallName'];
    
    inputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('input', () => {
                saveDraftToStorage();
                if (inputId === 'blogContent') {
                    updateWordCount();
                }
                if (inputId === 'blogImageUrl') {
                    showImagePreview(element.value);
                }
            });
        }
    });
}

function saveDraftToStorage() {
    const draft = {
        title: document.getElementById('blogTitle')?.value || '',
        author: document.getElementById('blogAuthor')?.value || '',
        category: document.getElementById('blogCategory')?.value || '',
        tags: document.getElementById('blogTags')?.value || '',
        content: document.getElementById('blogContent')?.value || '',
        imageUrl: document.getElementById('blogImageUrl')?.value || '',
        location: document.getElementById('blogLocation')?.value || '',
        stallName: document.getElementById('blogStallName')?.value || '',
        rating: document.getElementById('blogRating')?.value || 5,
        lastSaved: new Date().toISOString()
    };
    
    try {
        // Use in-memory storage instead of localStorage for artifacts
        window.blogDraft = draft;
    } catch (e) {
        console.warn('Could not save draft:', e);
    }
}

function loadDraftFromStorage() {
    try {
        const draft = window.blogDraft;
        if (draft) {
            document.getElementById('blogTitle').value = draft.title || '';
            document.getElementById('blogAuthor').value = draft.author || '';
            document.getElementById('blogCategory').value = draft.category || '';
            document.getElementById('blogTags').value = draft.tags || '';
            document.getElementById('blogContent').value = draft.content || '';
            document.getElementById('blogImageUrl').value = draft.imageUrl || '';
            document.getElementById('blogLocation').value = draft.location || '';
            document.getElementById('blogStallName').value = draft.stallName || '';
            document.getElementById('blogRating').value = draft.rating || 5;
            
            updateWordCount();
            showImagePreview(draft.imageUrl);
            updateRatingDisplay(draft.rating || 5);
        }
    } catch (e) {
        console.warn('Could not load draft:', e);
    }
}

function saveDraft() {
    saveDraftToStorage();
    alert('Draft saved successfully! You can continue writing later.');
    trackEvent('draft_saved', { title: document.getElementById('blogTitle').value || 'Untitled Draft' });
}

function publishBlogPost() {
    // Validate form
    const title = document.getElementById('blogTitle')?.value?.trim() || '';
    const author = document.getElementById('blogAuthor')?.value?.trim() || '';
    const category = document.getElementById('blogCategory')?.value || '';
    const content = document.getElementById('blogContent')?.value?.trim() || '';
    
    if (!title || !author || !category || !content) {
        alert('Please fill in all required fields (Title, Author, Category, and Content)');
        return;
    }
    
    if (content.split(/\s+/).length < 20) {
        if (!confirm('Your post seems quite short (less than 20 words). Are you sure you want to publish it?')) {
            return;
        }
    }
    
    // Create blog post object
    const blogPost = {
        id: 'user_post_' + Date.now(),
        title: title,
        author: author,
        category: category,
        tags: document.getElementById('blogTags')?.value.split(',').map(tag => tag.trim()).filter(tag => tag) || [],
        content: content,
        imageUrl: document.getElementById('blogImageUrl')?.value || generateDefaultImage(category),
        location: document.getElementById('blogLocation')?.value || '',
        stallName: document.getElementById('blogStallName')?.value || '',
        rating: parseInt(document.getElementById('blogRating')?.value || 5),
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        status: 'published'
    };
    
    // Save to memory
    userPosts.unshift(blogPost);
    
    // Track publishing
    trackEvent('blog_published', {
        title: title,
        category: category,
        wordCount: content.split(/\s+/).length,
        hasTags: blogPost.tags.length > 0,
        hasImage: !!blogPost.imageUrl,
        hasLocation: !!blogPost.location
    });
    
    // Add to main blog display
    addUserPostToDisplay(blogPost);
    
    // Clear form and draft
    document.getElementById('blogPostForm')?.reset();
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) imagePreview.style.display = 'none';
    window.blogDraft = null;
    updateRatingDisplay(5);
    
    // Close modal and show success
    const modal = bootstrap.Modal.getInstance(document.getElementById('writeBlogModal'));
    if (modal) modal.hide();
    alert('Congratulations! Your blog post has been published successfully!');
    
    // Scroll to the new post
    setTimeout(() => {
        const newPost = document.querySelector(`[data-post-id="${blogPost.id}"]`);
        if (newPost) {
            newPost.scrollIntoView({ behavior: 'smooth' });
            newPost.classList.add('highlight-new-post');
            setTimeout(() => newPost.classList.remove('highlight-new-post'), 3000);
        }
    }, 500);
}

function generateDefaultImage(category) {
    const defaultImages = {
        'noodles': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23FF6B35' width='400' height='250'/><text x='200' y='135' text-anchor='middle' fill='white' font-size='18' font-weight='bold'>Malaysian Noodles</text></svg>",
        'rice': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%234CAF50' width='400' height='250'/><text x='200' y='135' text-anchor='middle' fill='white' font-size='18' font-weight='bold'>Rice Dish</text></svg>",
        'satay': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23654321' width='400' height='250'/><text x='200' y='135' text-anchor='middle' fill='white' font-size='18' font-weight='bold'>Grilled Food</text></svg>",
        'curry': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23FF8C00' width='400' height='250'/><text x='200' y='135' text-anchor='middle' fill='white' font-size='18' font-weight='bold'>Curry & Soup</text></svg>",
        'dessert': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%234169E1' width='400' height='250'/><text x='200' y='135' text-anchor='middle' fill='white' font-size='18' font-weight='bold'>Sweet Treats</text></svg>",
        'bread': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23DEB887' width='400' height='250'/><text x='200' y='135' text-anchor='middle' fill='%238B4513' font-size='18' font-weight='bold'>Bread & Roti</text></svg>"
    };
    
    return defaultImages[category] || defaultImages['noodles'];
}

function addUserPostToDisplay(blogPost) {
    const blogContainer = document.getElementById('blogPosts');
    const postHtml = `
        <div class="col-md-6 fade-in blog-post user-generated-post" data-category="${blogPost.category}" data-tags="${blogPost.tags.join(',')}" data-post-id="${blogPost.id}">
            <div class="card blog-card">
                <img src="${blogPost.imageUrl}" class="card-img-top" alt="${blogPost.title}">
                <div class="card-body">
                    <h5 class="card-title">${blogPost.title} <span class="badge bg-success ms-2">New!</span></h5>
                    <div class="blog-meta mb-3">
                        <i class="fas fa-calendar"></i> ${new Date(blogPost.createdAt).toLocaleDateString()}
                        <i class="fas fa-user ms-3"></i> By ${blogPost.author}
                        <i class="fas fa-eye ms-3"></i> <span class="view-count">${blogPost.views}</span> views
                        ${blogPost.rating ? `<i class="fas fa-star ms-3"></i> ${blogPost.rating}/5` : ''}
                    </div>
                    <p class="card-text">${blogPost.content.substring(0, 150)}${blogPost.content.length > 150 ? '...' : ''}</p>
                    ${blogPost.location ? `<p class="text-muted"><i class="fas fa-map-marker-alt"></i> ${blogPost.location}${blogPost.stallName ? ` - ${blogPost.stallName}` : ''}</p>` : ''}
                    <div class="mb-3">
                        ${blogPost.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn read-more-btn" onclick="readUserPost('${blogPost.id}')">Read More</button>
                        <div>
                            <button class="btn btn-outline-danger btn-sm" onclick="likePost('${blogPost.id}')">
                                <i class="fas fa-heart"></i> <span class="like-count">${blogPost.likes}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    blogContainer.insertAdjacentHTML('afterbegin', postHtml);
    
    // Trigger animation
    setTimeout(() => {
        const newPost = document.querySelector(`[data-post-id="${blogPost.id}"]`);
        if (newPost) newPost.classList.add('visible');
    }, 100);
}

function readUserPost(postId) {
    // Find the post
    let post = userPosts.find(p => p.id === postId);
    
    if (post) {
        // Increment view count
        post.views++;
        
        // Update display
        const viewCountElement = document.querySelector(`[data-post-id="${postId}"] .view-count`);
        if (viewCountElement) {
            viewCountElement.textContent = post.views;
        }
        
        // Track reading
        trackEvent('user_post_read', {
            postId: postId,
            title: post.title,
            author: post.author
        });
        
        // Show full post in modal
        showFullPostModal(post);
    }
}

function showFullPostModal(post) {
    // Create a simple modal to show full post content
    const modalHtml = `
        <div class="modal fade" id="fullPostModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${post.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-muted mb-3">
                            <i class="fas fa-user"></i> By ${post.author} | 
                            <i class="fas fa-calendar"></i> ${new Date(post.createdAt).toLocaleDateString()} | 
                            <i class="fas fa-eye"></i> ${post.views} views
                            ${post.rating ? ` | <i class="fas fa-star"></i> ${post.rating}/5` : ''}
                        </div>
                        ${post.imageUrl ? `<img src="${post.imageUrl}" class="img-fluid mb-3 rounded" alt="${post.title}">` : ''}
                        ${post.location ? `<p class="text-info"><i class="fas fa-map-marker-alt"></i> ${post.location}${post.stallName ? ` - ${post.stallName}` : ''}</p>` : ''}
                        <div class="post-content" style="white-space: pre-line;">${post.content}</div>
                        <div class="mt-3">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-danger" onclick="likePost('${post.id}')">
                            <i class="fas fa-heart"></i> Like (<span class="like-count">${post.likes}</span>)
                        </button>
                        <button class="btn btn-outline-primary" onclick="sharePost('${post.id}')">
                            <i class="fas fa-share"></i> Share
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('fullPostModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('fullPostModal'));
    modal.show();
    
    // Remove modal from DOM when hidden
    document.getElementById('fullPostModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function likePost(postId) {
    let post = userPosts.find(p => p.id === postId);
    
    if (post) {
        // Check if user already liked this post
        if (likedPosts.includes(postId)) {
            alert('You have already liked this post!');
            return;
        }
        
        // Increment like count
        post.likes++;
        likedPosts.push(postId);
        
        // Update display
        const likeCountElements = document.querySelectorAll(`[onclick="likePost('${postId}')"] .like-count`);
        likeCountElements.forEach(element => {
            element.textContent = post.likes;
        });
        
        // Track like
        trackEvent('post_liked', {
            postId: postId,
            title: post.title
        });
        
        // Show feedback
        showLikeFeedback();
    }
}

function showLikeFeedback() {
    const feedback = document.createElement('div');
    feedback.innerHTML = '<i class="fas fa-heart text-danger"></i> Thank you for your like!';
    feedback.className = 'alert alert-success position-fixed';
    feedback.style.cssText = 'top: 20px; right: 20px; z-index: 9999; opacity: 0; transition: opacity 0.3s;';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.style.opacity = '1', 100);
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

function sharePost(postId) {
    let post = userPosts.find(p => p.id === postId);
    
    if (post) {
        const shareText = `Check out this amazing Malaysian street food story: "${post.title}" by ${post.author}`;
        
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText + ' - ' + window.location.href).then(() => {
                alert('Post link copied to clipboard!');
            });
        }
        
        trackEvent('post_shared', {
            postId: postId,
            title: post.title,
            method: navigator.share ? 'native' : 'clipboard'
        });
    }
}

function loadUserPosts() {
    const userPostsList = document.getElementById('userPostsList');
    
    if (userPosts.length === 0) {
        userPostsList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-edit fa-3x text-muted mb-3"></i>
                <h5>No posts yet</h5>
                <p class="text-muted">Start writing your first Malaysian street food story!</p>
                <button class="btn read-more-btn" onclick="closeMyPostsModal(); showWriteBlogModal();">
                    <i class="fas fa-pen"></i> Write Your First Post
                </button>
            </div>
        `;
        return;
    }
    
    let html = '<h6 class="text-primary mb-3"><i class="fas fa-check-circle"></i> Published Posts</h6>';
    userPosts.forEach(post => {
        html += `
            <div class="user-post">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-1">${post.title}</h6>
                    <span class="published-indicator">Published</span>
                </div>
                <p class="text-muted mb-2">
                    <i class="fas fa-calendar"></i> ${new Date(post.createdAt).toLocaleDateString()} | 
                    <i class="fas fa-eye"></i> ${post.views} views | 
                    <i class="fas fa-heart"></i> ${post.likes} likes
                </p>
                <p class="mb-2">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="readUserPost('${post.id}')">View</button>
                    <button class="btn btn-outline-secondary" onclick="editPost('${post.id}')">Edit</button>
                    <button class="btn btn-outline-danger" onclick="deletePost('${post.id}')">Delete</button>
                </div>
            </div>
        `;
    });
    
    userPostsList.innerHTML = html;
}

function editPost(postId) {
    let post = userPosts.find(p => p.id === postId);
    
    if (post) {
        // Load post data into the write blog modal
        document.getElementById('blogTitle').value = post.title;
        document.getElementById('blogAuthor').value = post.author;
        document.getElementById('blogCategory').value = post.category;
        document.getElementById('blogTags').value = post.tags.join(', ');
        document.getElementById('blogContent').value = post.content;
        document.getElementById('blogImageUrl').value = post.imageUrl || '';
        document.getElementById('blogLocation').value = post.location || '';
        document.getElementById('blogStallName').value = post.stallName || '';
        document.getElementById('blogRating').value = post.rating || 5;
        
        updateWordCount();
        showImagePreview(post.imageUrl);
        updateRatingDisplay(post.rating || 5);
        
        // Store the post ID for updating
        window.editingPostId = postId;
        
        const myPostsModal = bootstrap.Modal.getInstance(document.getElementById('myPostsModal'));
        if (myPostsModal) myPostsModal.hide();
        
        const writeModal = new bootstrap.Modal(document.getElementById('writeBlogModal'));
        writeModal.show();
    }
}

function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        const postIndex = userPosts.findIndex(p => p.id === postId);
        if (postIndex > -1) {
            const post = userPosts[postIndex];
            userPosts.splice(postIndex, 1);
            
            // Remove from display
            const postElement = document.querySelector(`[data-post-id="${postId}"]`);
            if (postElement) {
                postElement.remove();
            }
            
            // Track deletion
            trackEvent('post_deleted', {
                postId: postId,
                title: post.title
            });
            
            // Reload user posts modal
            loadUserPosts();
            
            alert('Post deleted successfully.');
        }
    }
}

function closeMyPostsModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('myPostsModal'));
    if (modal) modal.hide();
}

// Rating system
function setupRatingSystem() {
    const ratingStars = document.querySelectorAll('.rating-star');
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            document.getElementById('blogRating').value = rating;
            updateRatingDisplay(rating);
        });
        
        star.addEventListener('mouseover', () => {
            highlightStars(index + 1);
        });
    });
    
    const ratingInput = document.querySelector('.rating-input');
    if (ratingInput) {
        ratingInput.addEventListener('mouseleave', () => {
            const currentRating = document.getElementById('blogRating').value;
            updateRatingDisplay(currentRating);
        });
    }
}

function updateRatingDisplay(rating) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.opacity = '1';
        } else {
            star.style.opacity = '0.3';
        }
    });
}

// Search functionality
function searchPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const blogPosts = document.querySelectorAll('.blog-post');
    
    // Store search in memory
    if (searchTerm && !searchHistory.includes(searchTerm)) {
        searchHistory.unshift(searchTerm);
        if (searchHistory.length > 10) {
            searchHistory = searchHistory.slice(0, 10);
        }
    }
    
    blogPosts.forEach(post => {
        const title = post.querySelector('.card-title').textContent.toLowerCase();
        const content = post.querySelector('.card-text').textContent.toLowerCase();
        const tags = post.getAttribute('data-tags').toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm) || tags.includes(searchTerm)) {
            post.style.display = 'block';
            post.classList.add('fade-in', 'visible');
        } else {
            post.style.display = 'none';
        }
    });
}

// Filter posts by category
function filterPosts(category) {
    const blogPosts = document.querySelectorAll('.blog-post');
    currentFilter = category;
    
    blogPosts.forEach(post => {
        if (category === 'all' || post.getAttribute('data-category') === category) {
            post.style.display = 'block';
            post.classList.add('fade-in', 'visible');
        } else {
            post.style.display = 'none';
        }
    });
}

// Filter posts by tag
function filterByTag(tag) {
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        const tags = post.getAttribute('data-tags');
        if (tags.includes(tag)) {
            post.style.display = 'block';
            post.classList.add('fade-in', 'visible');
        } else {
            post.style.display = 'none';
        }
    });
}

// Read post functionality
function readPost(postId) {
    // For demo posts, show alert
    const postTitle = event.target.closest('.card').querySelector('.card-title').textContent;
    alert(`Opening "${postTitle}" - This would navigate to the full post!`);
    
    // Track reading
    trackEvent('post_read', {
        postId: postId,
        title: postTitle
    });
}

// Newsletter subscription
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Thank you for subscribing to our newsletter!');
        document.getElementById('newsletterEmail').value = '';
        trackEvent('newsletter_subscribed', { email: email });
    } else {
        alert('Please enter a valid email address.');
    }
}

// Load more posts functionality
function loadMorePosts() {
    alert('Loading more posts... This would fetch additional blog posts from the server!');
    trackEvent('load_more_clicked', {});
}

// Fade in animation on scroll
function fadeInOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Analytics tracking (simulated)
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
}

// Initialize the application
function initializeApp() {
    // Set up rating system
    setupRatingSystem();
    
    // Set up search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.which === 13) {
                searchPosts();
            }
        });
    }
    
    // Set up auto word count update
    const blogContent = document.getElementById('blogContent');
    if (blogContent) {
        blogContent.addEventListener('input', updateWordCount);
    }
    
    // Set up image URL preview
    const blogImageUrl = document.getElementById('blogImageUrl');
    if (blogImageUrl) {
        blogImageUrl.addEventListener('input', function() {
            showImagePreview(this.value);
        });
    }
    
    // Initialize fade-in animations
    setTimeout(fadeInOnScroll, 100);
}

// Event listeners
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', initializeApp);

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Show welcome message for first-time visitors
    if (!window.hasVisited) {
        window.hasVisited = true;
        setTimeout(() => {
            console.log('Welcome to Malaysian Street Food Explorer Blog!');
        }, 1000);
    }
});