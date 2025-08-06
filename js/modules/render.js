// js/modules/render.js
import { state } from '../state.js';
import { API_URL, usStates, vehicleColors, positiveTraits } from '../constants.js';
import { vehicleMakes, vehicleType, vehicleSubtype } from '../data/vehicleData.js';
import { commentBuilderData } from '../data/commentData.js';
import { showProfileModal, showUserProfile } from './profile.js';

// --- Main Feed Rendering ---
export function renderReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    const normalizePlate = (plate) => plate.replace(/[\s-]/g, '').toLowerCase();
    const searchTerm = normalizePlate(document.getElementById('searchPlate').value.trim());
    const selectedState = document.getElementById('filterState').value;
    const selectedMake = document.getElementById('filterMake').value;
    const selectedType = document.getElementById('filterType').value;
    const selectedSubtype = document.getElementById('filterSubtype').value;

    const filteredData = Object.values(state.aggregatedReviewsData).filter(data => {
        const plateMatch = normalizePlate(data.plate_number).includes(searchTerm);
        const stateMatch = !selectedState || data.allReviews.some(review => review.incident_location === selectedState);
        const makeMatch = !selectedMake || data.allReviews.some(review => review.vehicle_make === selectedMake);
        
        const typeMatch = !selectedType || data.allReviews.some(review => {
            if (!review.vehicle_make || !review.vehicle_model) return false;
            const subtype = vehicleSubtype[review.vehicle_make]?.[review.vehicle_model];
            const type = vehicleType[subtype];
            return type === selectedType;
        });

        const subtypeMatch = !selectedSubtype || data.allReviews.some(review => {
            if (!review.vehicle_make || !review.vehicle_model) return false;
            const subtype = vehicleSubtype[review.vehicle_make]?.[review.vehicle_model];
            return subtype === selectedSubtype;
        });

        return plateMatch && stateMatch && makeMatch && typeMatch && subtypeMatch;
    });

    reviewsContainer.innerHTML = '';
    if (filteredData.length === 0) {
        reviewsContainer.innerHTML = `<div class="text-center py-10"><p class="text-light-secondary">No reviews match the current filters.</p></div>`;
        return;
    }
    filteredData.forEach(data => {
        const ratingColor = data.averageRating >= 4 ? 'text-green-400' : data.averageRating >= 2 ? 'text-yellow-400' : 'text-red-400';
        const firstReview = data.allReviews[0];
        const commentHtml = firstReview.comment ? renderStructuredComment(firstReview.comment).replace(/<[^>]*>/g, '') : 'No comment';
        const reviewCardHtml = `
            <div class="bg-dark-tertiary p-4 rounded-xl shadow-md flex items-center space-x-4 cursor-pointer review-card" data-plate-number="${data.plate_number}">
                <div class="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center font-bold text-xl text-light-primary">${data.plate_number.charAt(0)}</div>
                <div class="flex-grow">
                    <h3 class="font-bold text-light-primary">${data.plate_number.toUpperCase()}</h3>
                    <p class="text-sm text-light-secondary">${firstReview.vehicle_make || 'Unknown'} • ${commentHtml.substring(0, 30)}...</p>
                </div>
                <div class="flex items-center font-bold text-lg ${ratingColor}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="mr-1"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    <span>${parseFloat(data.averageRating).toFixed(1)}</span>
                </div>
            </div>`;
        reviewsContainer.insertAdjacentHTML('beforeend', reviewCardHtml);
    });
    // Re-attach listeners after re-render
    document.querySelectorAll('.review-card').forEach(card => {
        card.addEventListener('click', (event) => {
            // This needs to call the handler from review.js, can't be imported due to circular dependency
            // The handler will be attached in app.js using event delegation.
        });
    });
};


// --- Modal & Detail Rendering ---
export function updateReviewDetailModalContent(review) {
    if (!review) return;
    const plateImage = document.getElementById('detailPlateImage');
    plateImage.src = API_URL.replace('/api', '') + '/images/blankplate.png';
    document.getElementById('detailPlateNumberOverlay').textContent = review.plate_number.toUpperCase();
    document.getElementById('detailVehicleMake').textContent = review.vehicle_make || 'N/A';
    document.getElementById('detailVehicleModel').textContent = review.vehicle_model || 'N/A';
    document.getElementById('detailVehicleColor').textContent = review.vehicle_color || 'N/A';
    document.getElementById('detailComment').innerHTML = renderStructuredComment(review.comment);
    
    let subtype = 'N/A';
    if (review.vehicle_make && review.vehicle_model) {
        subtype = vehicleSubtype[review.vehicle_make]?.[review.vehicle_model] || 'N/A';
    }
    document.getElementById('detailVehicleType').textContent = subtype;

    const detailUserIdSpan = document.getElementById('detailUserId');
    const username = review.user_id || 'Anonymous';
    detailUserIdSpan.innerHTML = '';
    if (username !== 'Anonymous') {
        const userProfileButton = document.createElement('button');
        userProfileButton.className = 'text-blue-400 hover:underline font-semibold';
        userProfileButton.textContent = username;
        userProfileButton.addEventListener('click', () => {
            document.getElementById('reviewDetailModal').classList.add('hidden');
            if (username === state.currentUsername) {
                showProfileModal();
            } else {
                showUserProfile(username);
            }
        });
        detailUserIdSpan.appendChild(userProfileButton);
    } else {
        detailUserIdSpan.textContent = username;
    }

    document.getElementById('detailIncidentLocation').textContent = review.incident_location || 'N/A';
    document.getElementById('upvotesCount').textContent = review.upvotes || 0;
    document.getElementById('downvotesCount').textContent = review.downvotes || 0;

    const upvoteBtn = document.getElementById('upvoteBtn');
    const downvoteBtn = document.getElementById('downvoteBtn');
    const currentUserVote = state.userVotes[review.id];
    upvoteBtn.classList.toggle('active-up', currentUserVote === 'up');
    downvoteBtn.classList.toggle('active-down', currentUserVote === 'down');

    const ratingStarsContainer = document.getElementById('detailRatingStars');
    ratingStarsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const starSpan = document.createElement('span');
        starSpan.classList.add('star');
        if (i <= review.rating) starSpan.classList.add('filled');
        starSpan.textContent = '\u2605';
        ratingStarsContainer.prepend(starSpan);
    }

    const detailTraitsContainer = document.getElementById('detailTraits');
    detailTraitsContainer.innerHTML = '';
    if (review.tags) {
        const tagsArray = review.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        tagsArray.forEach(tag => {
            const traitSpan = document.createElement('span');
            traitSpan.className = 'px-3 py-1 rounded-full text-sm font-medium text-white';
            traitSpan.style.backgroundColor = positiveTraits.includes(tag) ? '#10b981' : '#ef4444';
            traitSpan.textContent = tag;
            detailTraitsContainer.appendChild(traitSpan);
        });
    } else {
        detailTraitsContainer.innerHTML = '<span class="text-light-secondary text-sm">No traits.</span>';
    }

    document.getElementById('detailReviewCount').textContent = `Review ${state.currentReviewIndex + 1} of ${state.currentPlateReviews.length}`;
    document.getElementById('prevReviewBtn').disabled = state.currentReviewIndex === 0;
    document.getElementById('nextReviewBtn').disabled = state.currentReviewIndex >= state.currentPlateReviews.length - 1;
};

export function setDetailModalMode(mode, username = null) {
    const feedNav = document.getElementById('detailNavFeed');
    const profileNav = document.getElementById('detailNavProfile');

    if (mode === 'profile') {
        feedNav.classList.add('hidden');
        profileNav.classList.remove('hidden');
        state.lastViewedProfile = username;
    } else {
        feedNav.classList.remove('hidden');
        profileNav.classList.add('hidden');
        state.lastViewedProfile = null;
    }
};

// --- Profile Rendering ---
export function renderProfileBadges(userBadges, allBadges, container, limit = 0) {
    if (!container) return;
    container.innerHTML = '';

    if (!allBadges || allBadges.length === 0) {
        container.innerHTML = '<p class="text-light-secondary text-sm">Could not load achievements.</p>';
        return;
    }

    const userBadgeIds = new Set(userBadges.map(b => b.badge_id));
    let badgesToDisplay;

    if (limit > 0) {
        const sortedBadges = [...allBadges].sort((a, b) => {
            const aUnlocked = userBadgeIds.has(a.badge_id);
            const bUnlocked = userBadgeIds.has(b.badge_id);
            if (aUnlocked !== bUnlocked) {
                return aUnlocked ? -1 : 1;
            }
            return a.badge_id - b.badge_id;
        });
        badgesToDisplay = sortedBadges.slice(0, limit);
    } else {
        badgesToDisplay = allBadges;
    }

    badgesToDisplay.forEach(badge => {
        const isUnlocked = userBadgeIds.has(badge.badge_id);
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge-container cursor-pointer';

        const imgClass = isUnlocked ? '' : 'badge-locked';
        const lockIconHtml = isUnlocked ? '' : `
            <svg class="lock-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
        `;

        badgeElement.innerHTML = `
            <img src="${badge.image_url || '/images/badges/default.png'}" alt="${badge.name}" class="w-16 h-16 transition-transform hover:scale-110 ${imgClass}">
            ${lockIconHtml}
        `;

        badgeElement.addEventListener('click', () => {
            if (container.id === 'allBadgesContainer') {
                document.getElementById('allBadgesModal').classList.add('hidden');
            }
            
            const detailImage = document.getElementById('badgeDetailImage');
            detailImage.src = badge.image_url || '/images/badges/default.png';
            detailImage.classList.toggle('badge-locked', !isUnlocked);
            document.getElementById('badgeDetailName').textContent = badge.name;
            document.getElementById('badgeDetailDescription').textContent = isUnlocked ? badge.description : 'This badge is locked. Keep using PlateTraits to discover how to unlock it!';
            document.getElementById('badgeDetailModal').classList.remove('hidden');
        });

        container.appendChild(badgeElement);
    });
};

export function renderProfileReviews(container, reviews, profileUsername) {
    container.innerHTML = '';
    if (reviews && reviews.length > 0) {
        reviews.forEach(review => {
            const ratingColor = review.rating >= 4 ? 'text-green-400' : review.rating >= 2 ? 'text-yellow-400' : 'text-red-400';
            const reviewCard = document.createElement('div');
            reviewCard.className = 'bg-dark-tertiary p-3 rounded-lg cursor-pointer hover:bg-gray-700 profile-review-card';
            reviewCard.dataset.reviewId = review.id;
            reviewCard.dataset.profileUsername = profileUsername;

            reviewCard.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold text-light-primary">${review.plate_number.toUpperCase()}</p>
                        <p class="text-xs text-light-secondary">${new Date(review.created_at).toLocaleString()}</p>
                    </div>
                    <div class="flex items-center font-bold text-md ${ratingColor}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="mr-1"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <span>${review.rating}.0</span>
                    </div>
                </div>
                <p class="text-sm italic mt-2 text-light-secondary">"${renderStructuredComment(review.comment).replace(/<[^>]*>/g, '')}"</p>
            `;
            container.appendChild(reviewCard);
        });
    } else {
        const message = (profileUsername === state.currentUsername) 
            ? 'You have not submitted any reviews yet.' 
            : 'This user has not submitted any reviews yet.';
        container.innerHTML = `<p class="text-light-secondary">${message}</p>`;
    }
};

export function populateProfileDisplay(user) {
    document.getElementById('profileFirstName').textContent = user.first_name || 'N/A';
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email || 'N/A';
    document.getElementById('profileJoinDate').textContent = new Date(user.created_at).toLocaleDateString();
    document.getElementById('profileVehicle').textContent = (user.current_vehicle_make && user.current_vehicle_model)
        ? `${user.current_vehicle_color || ''} ${user.current_vehicle_year || ''} ${user.current_vehicle_make} ${user.current_vehicle_model}`.trim()
        : 'Not specified';
    document.getElementById('profileBio').innerHTML = user.bio ? renderStructuredComment(user.bio) : 'No bio provided.';
}

export function populateProfileEditForm(user) {
    document.getElementById('profile_first_name').value = user.first_name || '';
    document.getElementById('profile_vehicle_year').value = user.current_vehicle_year || '';
    document.getElementById('profile_vehicle_make').value = user.current_vehicle_make || '';
    document.getElementById('profile_vehicle_make').dispatchEvent(new Event('change')); // Trigger model update
    setTimeout(() => { // Defer model/color selection to allow model dropdown to populate
        document.getElementById('profile_vehicle_model').value = user.current_vehicle_model || '';
        document.getElementById('profile_vehicle_color').value = user.current_vehicle_color || '';
    }, 100);

    const bioTemplateSelect = document.getElementById('bio-template');
    if (user.bio && typeof user.bio === 'object' && user.bio.template) {
        bioTemplateSelect.value = user.bio.template;
    }
    bioTemplateSelect.dispatchEvent(new Event('change')); // Trigger word selects update
    setTimeout(() => {
        if (user.bio && typeof user.bio === 'object' && user.bio.words) {
            const wordSelects = document.querySelectorAll('#bio-words-container select');
            wordSelects.forEach((select, index) => {
                if (user.bio.words[index]) {
                    select.value = user.bio.words[index];
                }
            });
        }
    }, 100);
}


// --- Auth UI Rendering ---
export function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const addReviewBtn = document.getElementById('addReviewBtn');
    if (state.authToken) {
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        userInfo.classList.add('flex');
        usernameDisplay.textContent = state.currentUsername;
        addReviewBtn.disabled = false;
    } else {
        loginBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
        userInfo.classList.remove('flex');
        addReviewBtn.disabled = true;
    }
};

export function updateAuthModalView() {
    const authTitle = document.getElementById('authTitle');
    const authPrompt = document.getElementById('authPrompt');
    const switchAuthModeBtn = document.getElementById('switchAuthModeBtn');
    const emailField = document.getElementById('email-field-container');
    const confirmPasswordField = document.getElementById('confirm-password-container');
    const firstNameField = document.getElementById('first-name-field-container');
    const emailInput = document.getElementById('email');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const firstNameInput = document.getElementById('first_name');

    if (state.isAuthModalInLoginMode) {
        authTitle.textContent = 'Login';
        authPrompt.textContent = "Don't have an account?";
        switchAuthModeBtn.textContent = 'Register';
        emailField.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
        firstNameField.classList.add('hidden');
        emailInput.required = false;
        confirmPasswordInput.required = false;
        firstNameInput.required = false;
    } else {
        authTitle.textContent = 'Register';
        authPrompt.textContent = "Already have an account?";
        switchAuthModeBtn.textContent = 'Login';
        emailField.classList.remove('hidden');
        confirmPasswordField.classList.remove('hidden');
        firstNameField.classList.remove('hidden');
        emailInput.required = true;
        confirmPasswordInput.required = true;
        firstNameInput.required = true;
    }
    document.getElementById('authMessage').textContent = '';
    document.getElementById('authForm').reset();
}


// --- Comment Rendering and Builders ---
export function renderStructuredComment(commentData) {
    if (!commentData) return "No comment provided.";
    try {
        const parsedComment = typeof commentData === 'string' ? JSON.parse(commentData) : commentData;
        
        if (!parsedComment || !Array.isArray(parsedComment.words) || !commentBuilderData.templates[parsedComment.template]) {
            return commentData.toString(); // Fallback for old or invalid comments
        }
        
        let message = commentBuilderData.templates[parsedComment.template];
        if (parsedComment.words.length === 0 && !message.includes('_____')) {
            return message; // Template has no blanks
        }
        
        parsedComment.words.forEach(word => {
            message = message.replace('_____', `<strong class="text-blue-400 font-semibold">${word}</strong>`);
        });
        
        return message;
    } catch (e) {
        return commentData.toString(); // Fallback for non-JSON comments
    }
};

export function updateCommentBuilder(container, templateSelect) {
    const templateIndex = templateSelect.value;
    const selectedTemplate = commentBuilderData.templates[templateIndex];
    if (!selectedTemplate) return;
    
    const placeholders = selectedTemplate.match(/_____/g) || [];
    
    container.innerHTML = '';
    const allWords = Object.values(commentBuilderData.words).flat();

    placeholders.forEach((_, i) => {
        const wordSelectHtml = `
            <div>
                <label class="text-sm font-medium text-light-secondary">Word ${i + 1}</label>
                <select name="comment_word_${i}" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">
                    ${Object.entries(commentBuilderData.words).map(([groupName, words]) => `
                        <optgroup label="${groupName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}">
                            ${words.map(w => `<option value="${w}">${w}</option>`).join('')}
                        </optgroup>
                    `).join('')}
                </select>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', wordSelectHtml);
    });
};

// --- Initial UI Population (Dropdowns, etc.) ---
export function populateFilterDropdowns() {
    const filterStateSelect = document.getElementById('filterState');
    const filterMakeSelect = document.getElementById('filterMake');
    const filterTypeSelect = document.getElementById('filterType');
    const filterSubtypeSelect = document.getElementById('filterSubtype');

    filterStateSelect.innerHTML = ['<option value="">All States</option>', ...usStates.map(state => `<option value="${state}">${state}</option>`)].join('');
    filterMakeSelect.innerHTML = ['<option value="">All Makes</option>', ...vehicleMakes.map(make => `<option value="${make}">${make}</option>`)].join('');
    
    const uniqueVehicleTypes = [...new Set(Object.values(vehicleType))].sort();
    filterTypeSelect.innerHTML = ['<option value="">All Types</option>', ...uniqueVehicleTypes.map(type => `<option value="${type}">${type}</option>`)].join('');
    
    const allSubtypes = Object.values(vehicleSubtype).flatMap(models => Object.values(models));
    const uniqueVehicleSubtypes = [...new Set(allSubtypes)].sort();
    filterSubtypeSelect.innerHTML = ['<option value="">All Subtypes</option>', ...uniqueVehicleSubtypes.map(subtype => `<option value="${subtype}">${subtype}</option>`)].join('');
};

export function populateProfileEditDropdowns() {
    const profileMakeSelect = document.getElementById('profile_vehicle_make');
    const profileColorSelect = document.getElementById('profile_vehicle_color');
    const profileYearSelect = document.getElementById('profile_vehicle_year');
    const bioTemplateSelect = document.getElementById('bio-template');

    profileMakeSelect.innerHTML = ['<option value="">Select Make</option>', ...vehicleMakes.map(make => `<option value="${make}">${make}</option>`)].join('');
    profileColorSelect.innerHTML = ['<option value="">Select Color</option>', ...vehicleColors.map(color => `<option value="${color}">${color}</option>`)].join('');

    const yearOptions = ['<option value="">Select Year</option>'];
    const endYear = new Date().getFullYear() + 1;
    for (let year = endYear; year >= 1900; year--) {
        yearOptions.push(`<option value="${year}">${year}</option>`);
    }
    profileYearSelect.innerHTML = yearOptions.join('');
    
    bioTemplateSelect.innerHTML = commentBuilderData.templates.map((template, index) => `<option value="${index}">${template}</option>`).join('');
};

export function injectAddReviewModal() {
    const makeOptions = ['<option value="">Select Make</option>', ...vehicleMakes.map(make => `<option value="${make}">${make}</option>`)].join('');
    const colorOptions = ['<option value="">Select Color</option>', ...vehicleColors.map(color => `<option value="${color}">${color}</option>`)].join('');
    const stateOptions = ['<option value="">Select State</option>', ...usStates.map(state => `<option value="${state}">${state}</option>`)].join('');
    const templateOptions = commentBuilderData.templates.map((template, index) => `<option value="${index}" ${index === 0 ? 'selected' : ''}>${template}</option>`).join('');

    const modalHtml = `
        <div id="reviewModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden">
            <div class="bg-dark-secondary text-light-primary rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center p-4 border-b border-dark">
                    <h2 class="text-xl font-bold font-license-plate">Submit a Review</h2>
                    <button id="closeModalBtn" class="text-light-secondary text-2xl hover:text-white">&times;</button>
                </div>
                <div class="p-6 overflow-y-auto no-scrollbar">
                    <form id="reviewForm">
                        <div class="bg-dark-tertiary p-4 rounded-lg mb-6">
                            <h3 class="font-semibold mb-3 text-light-primary">License Plate Details</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label for="plate_number" class="text-sm font-medium text-light-secondary">Plate Number *</label><input type="text" id="plate_number" name="plate_number" required maxlength="8" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary placeholder-light-tertiary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500"></div>
                                <div><label for="vehicle_make" class="text-sm font-medium text-light-secondary">Make</label><select id="vehicle_make" name="vehicle_make" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">${makeOptions}</select></div>
                                <div><label for="vehicle_model" class="text-sm font-medium text-light-secondary">Model</label><select id="vehicle_model" name="vehicle_model" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500" disabled><option value="">Select Model</option></select></div>
                                <div><label for="vehicle_color" class="text-sm font-medium text-light-secondary">Color</label><select id="vehicle_color" name="vehicle_color" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">${colorOptions}</select></div>
                                <div class="col-span-2"><label for="incident_location" class="text-sm font-medium text-light-secondary">Incident State</label><select id="incident_location" name="incident_location" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">${stateOptions}</select></div>
                            </div>
                        </div>
                        <div class="mb-6 text-center">
                            <h3 class="font-semibold mb-2 text-light-primary">Overall Rating *</h3>
                            <div class="modal-star-rating">
                                <input type="radio" id="star5" name="rating" value="5" required/><label for="star5" title="5 stars">★</label>
                                <input type="radio" id="star4" name="rating" value="4"/><label for="star4" title="4 stars">★</label>
                                <input type="radio" id="star3" name="rating" value="3"/><label for="star3" title="3 stars">★</label>
                                <input type="radio" id="star2" name="rating" value="2"/><label for="star2" title="2 stars">★</label>
                                <input type="radio" id="star1" name="rating" value="1"/><label for="star1" title="1 star">★</label>
                            </div>
                        </div>
                        <div class="bg-dark-tertiary p-4 rounded-lg mb-6">
                            <div class="flex justify-between items-center mb-3">
                                <h3 class="font-semibold text-light-primary">Construct a Comment</h3>
                                <div class="flex items-center">
                                    <input type="checkbox" id="no-comment-checkbox" class="h-4 w-4 rounded border-dark bg-dark-tertiary text-blue-600 focus:ring-blue-500">
                                    <label for="no-comment-checkbox" class="ml-2 block text-sm text-light-secondary">No Comment</label>
                                </div>
                            </div>
                            <div id="comment-builder-body" class="space-y-3">
                                <div>
                                    <label for="comment-template" class="text-sm font-medium text-light-secondary">Template</label>
                                    <select id="comment-template" name="comment_template" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">${templateOptions}</select>
                                </div>
                                <div id="comment-words-container" class="space-y-3"></div>
                            </div>
                        </div>
                        <div class="mb-6">
                            <h3 class="font-semibold mb-2 text-light-primary">Select Traits</h3>
                            <div id="trait-chips-container" class="flex flex-wrap gap-2">
                                <span class="trait-chip positive" data-value="Used Turn Signals">Used Turn Signals</span>
                                <span class="trait-chip positive" data-value="Proper Speed">Proper Speed</span>
                                <span class="trait-chip positive" data-value="Yielded Correctly">Yielded Correctly</span>
                                <span class="trait-chip positive" data-value="Allowed Merge">Allowed Merge</span>
                                <span class="trait-chip positive" data-value="Smooth Braking">Smooth Braking</span>
                                <span class="trait-chip positive" data-value="Excellent Parking">Excellent Parking</span>
                                <span class="trait-chip positive" data-value="Stopped Fully">Stopped Fully</span>
                                <span class="trait-chip positive" data-value="Big Dick Energy">Big Dick Energy</span>
                                <span class="trait-chip positive" data-value="Respectful Distance">Respectful Distance</span>
                                <span class="trait-chip positive" data-value="Followed Signs">Followed Signs</span>
                                <span class="trait-chip negative" data-value="No Turn Signals">No Turn Signals</span>
                                <span class="trait-chip negative" data-value="Speeding">Speeding</span>
                                <span class="trait-chip negative" data-value="Tailgating">Tailgating</span>
                                <span class="trait-chip negative" data-value="Small Dick Energy">Small Dick Energy</span>
                                <span class="trait-chip negative" data-value="Cut Off Others">Cut Off Others</span>
                                <span class="trait-chip negative" data-value="Sudden Braking">Sudden Braking</span>
                                <span class="trait-chip negative" data-value="Poor Parking">Poor Parking</span>
                                <span class="trait-chip negative" data-value="Rolling Stops">Rolling Stops</span>
                                <span class="trait-chip negative" data-value="Distracted Driving">Distracted Driving</span>
                                <span class="trait-chip negative" data-value="Ignoring Signs">Ignoring Signs</span>
                                <span class="trait-chip negative" data-value="Lane Weaving">Lane Weaving</span>
                                <span class="trait-chip negative" data-value="Blocking Traffic">Blocking Traffic</span>
                            </div>
                        </div>
                        <input type="hidden" id="tags" name="tags">
                        <div id="formMessage" class="mt-4 text-center text-red-500"></div>
                    </form>
                </div>
                <div class="p-4 bg-dark-tertiary border-t border-dark rounded-b-2xl">
                    <button type="submit" form="reviewForm" class="w-full bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">Submit Review</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};