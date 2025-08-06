// js/app.js
import { state } from './state.js';
import * as api from './modules/api.js';
import * as render from './modules/render.js';
import { handleLogin, handleRegister, handleLogout, switchAuthMode, fetchUserVotesAndUpdateState } from './modules/auth.js';
import { processAndSetReviews, handleReviewSubmit, handleVote, showReviewDetail, showNextReview, showPreviousReview } from './modules/review.js';
import { showMyProfile, handleSaveProfile, toggleProfileEditView, goBackToProfile } from './modules/profile.js';
import { vehicleModels } from './data/vehicleData.js';

function initializeEventListeners() {
    // --- Auth Modal ---
    document.getElementById('loginBtn').addEventListener('click', () => {
        state.isAuthModalInLoginMode = true;
        render.updateAuthModalView();
        document.getElementById('authModal').classList.remove('hidden')
    });
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('closeAuthModalBtn').addEventListener('click', () => document.getElementById('authModal').classList.add('hidden'));
    document.getElementById('switchAuthModeBtn').addEventListener('click', switchAuthMode);
    document.getElementById('authForm').addEventListener('submit', (e) => {
        if (state.isAuthModalInLoginMode) handleLogin(e.target);
        else handleRegister(e.target);
    });
    document.getElementById('showPasswordToggle').addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        document.getElementById('password').type = isChecked ? 'text' : 'password';
        document.getElementById('confirmPassword').type = isChecked ? 'text' : 'password';
    });

    // --- Main Review Feed & Filters ---
    document.getElementById('reviewsContainer').addEventListener('click', (e) => {
        const card = e.target.closest('.review-card');
        if (card) {
            showReviewDetail(card.dataset.plateNumber);
        }
    });
    document.getElementById('searchPlate').addEventListener('input', render.renderReviews);
    document.getElementById('filterState').addEventListener('change', render.renderReviews);
    document.getElementById('filterMake').addEventListener('change', render.renderReviews);
    document.getElementById('filterType').addEventListener('change', render.renderReviews);
    document.getElementById('filterSubtype').addEventListener('change', render.renderReviews);
    
    // --- Add/Edit Review Modal ---
    document.getElementById('addReviewBtn').addEventListener('click', () => {
        if (state.authToken) document.getElementById('reviewModal').classList.remove('hidden');
        else document.getElementById('authModal').classList.remove('hidden');
    });
    document.body.addEventListener('click', e => { // Use delegation since modal is injected
        if (e.target.id === 'closeModalBtn') document.getElementById('reviewModal').classList.add('hidden');
    });
    document.body.addEventListener('submit', e => {
        if (e.target.id === 'reviewForm') handleReviewSubmit(e);
    });
    document.body.addEventListener('input', e => {
        if (e.target.id === 'plate_number') e.target.value = e.target.value.replace(/\s/g, '-').toUpperCase();
    });
    document.body.addEventListener('change', e => {
        if (e.target.id === 'vehicle_make') {
            const make = e.target.value;
            const modelSelect = document.getElementById('vehicle_model');
            const models = vehicleModels[make] || vehicleModels['Other'];
            modelSelect.innerHTML = '<option value="">Select Model</option>' + models.map(model => `<option value="${model}">${model}</option>`).join('');
            modelSelect.disabled = !make;
        }
        if(e.target.id === 'comment-template') {
            render.updateCommentBuilder(document.getElementById('comment-words-container'), e.target);
        }
        if(e.target.id === 'no-comment-checkbox') {
             document.getElementById('comment-builder-body').style.display = e.target.checked ? 'none' : 'block';
        }
    });
    document.body.addEventListener('click', e => {
        if(e.target.classList.contains('trait-chip')) {
            e.target.classList.toggle('active');
            const selectedTraits = [...document.querySelectorAll('.trait-chip.active')].map(chip => chip.dataset.value);
            document.getElementById('tags').value = selectedTraits.join(', ');
        }
    });

    // --- Review Detail Modal ---
    document.getElementById('closeDetailModalBtn').addEventListener('click', () => {
        if (state.lastViewedProfile) goBackToProfile();
        else document.getElementById('reviewDetailModal').classList.add('hidden');
    });
    document.getElementById('prevReviewBtn').addEventListener('click', showPreviousReview);
    document.getElementById('nextReviewBtn').addEventListener('click', showNextReview);
    document.getElementById('upvoteBtn').addEventListener('click', () => handleVote('up'));
    document.getElementById('downvoteBtn').addEventListener('click', () => handleVote('down'));

    // --- Profile Modal ---
    document.getElementById('profileBtn').addEventListener('click', showMyProfile);
    document.getElementById('closeProfileModalBtn').addEventListener('click', () => document.getElementById('profileModal').classList.add('hidden'));
    document.getElementById('backToProfileBtn').addEventListener('click', goBackToProfile);
    document.getElementById('profileReviewsContainer').addEventListener('click', e => {
        const card = e.target.closest('.profile-review-card');
        if (card) {
            const review = state.allReviewsData.find(r => r.id === parseInt(card.dataset.reviewId));
            if(review) {
                document.getElementById('profileModal').classList.add('hidden');
                render.setDetailModalMode('profile', card.dataset.profileUsername);
                document.getElementById('reviewDetailModal').classList.remove('hidden');
                render.updateReviewDetailModalContent(review);
            }
        }
    });

    // --- Profile Edit View ---
    document.getElementById('editProfileBtn').addEventListener('click', () => toggleProfileEditView(true));
    document.getElementById('cancelEditProfileBtn').addEventListener('click', () => toggleProfileEditView(false));
    document.getElementById('saveProfileBtn').addEventListener('click', handleSaveProfile);
    document.getElementById('profile_vehicle_make').addEventListener('change', e => {
        const make = e.target.value;
        const modelSelect = document.getElementById('profile_vehicle_model');
        const models = vehicleModels[make] || vehicleModels['Other'];
        modelSelect.innerHTML = '<option value="">Select Model</option>' + models.map(model => `<option value="${model}">${model}</option>`).join('');
        modelSelect.disabled = !make;
    });
    document.getElementById('bio-template').addEventListener('change', (e) => {
        render.updateCommentBuilder(document.getElementById('bio-words-container'), e.target);
    });

    // --- Badge Modals ---
    document.getElementById('closeBadgeDetailModalBtn').addEventListener('click', () => document.getElementById('badgeDetailModal').classList.add('hidden'));
    document.getElementById('showAllBadgesBtn').addEventListener('click', () => document.getElementById('allBadgesModal').classList.remove('hidden'));
    document.getElementById('closeAllBadgesModalBtn').addEventListener('click', () => document.getElementById('allBadgesModal').classList.add('hidden'));
}

async function initializeApp() {
    render.injectAddReviewModal();
    render.populateFilterDropdowns();
    render.populateProfileEditDropdowns();
    render.updateAuthUI();
    // Initial population of comment builders
    render.updateCommentBuilder(document.getElementById('comment-words-container'), document.getElementById('comment-template'));
    render.updateCommentBuilder(document.getElementById('bio-words-container'), document.getElementById('bio-template'));

    try {
        const reviews = await api.getReviews();
        processAndSetReviews(reviews);
        if (state.authToken) {
            await fetchUserVotesAndUpdateState();
        }
    } catch (error) {
        document.getElementById('loadingReviews').innerHTML = `<p class="text-red-500">Error: ${error.message}. Could not load reviews.</p>`;
    }
    
    initializeEventListeners();
}

// --- App Entry Point ---
document.addEventListener('DOMContentLoaded', initializeApp);