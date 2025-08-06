// js/modules/profile.js
import { state } from '../state.js';
import * as api from './api.js';
import * as render from './render.js';
import { setDetailModalMode, renderStructuredComment } from './render.js';

async function fetchAndRenderProfile(apiCall, profileUsername) {
    const profileReviewsContainer = document.getElementById('profileReviewsContainer');
    profileReviewsContainer.innerHTML = '<p class="text-light-secondary">Loading profile...</p>';
    
    try {
        const { user, reviews, badges: userBadges } = await apiCall();
        const allBadges = await api.getAllBadges();
        
        render.populateProfileDisplay(user);
        
        if (profileUsername === state.currentUsername) { // If it's my own profile
            render.populateProfileEditForm(user);
        }
        
        render.renderProfileBadges(userBadges, allBadges, document.getElementById('profileBadgesContainer'), 4);
        render.renderProfileBadges(userBadges, allBadges, document.getElementById('allBadgesContainer'));
        render.renderProfileReviews(profileReviewsContainer, reviews, user.username);

    } catch (error) {
        profileReviewsContainer.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
}

export async function showMyProfile() {
    if (!state.authToken) return;
    document.getElementById('profileModal').classList.remove('hidden');
    document.getElementById('profileModal').querySelector('h2').textContent = 'My Profile';
    document.getElementById('profileReviewsHeading').textContent = 'My Submitted Reviews';
    document.getElementById('profileEmail').parentElement.style.display = 'block';
    document.getElementById('editProfileBtn').classList.remove('hidden');
    
    toggleProfileEditView(false); // Start in display view
    await fetchAndRenderProfile(() => api.getMyProfile(state.authToken), state.currentUsername);
}

export async function showUserProfile(username) {
    if (!username) return;
    document.getElementById('profileModal').classList.remove('hidden');
    document.getElementById('profileModal').querySelector('h2').textContent = `${username}'s Profile`;
    document.getElementById('profileReviewsHeading').textContent = `${username}'s Submitted Reviews`;
    document.getElementById('profileEmail').parentElement.style.display = 'none'; // Hide email for other users
    document.getElementById('editProfileBtn').classList.add('hidden');
    
    toggleProfileEditView(false); // Always show display view for others
    await fetchAndRenderProfile(() => api.getUserProfile(username), username);
}

export async function handleSaveProfile() {
    const profileEditMessage = document.getElementById('profileEditMessage');
    profileEditMessage.textContent = 'Saving...';
    profileEditMessage.className = 'text-center text-sm mt-4 text-gray-500';

    const firstName = document.getElementById('profile_first_name').value;
    const vehicleData = {
        make: document.getElementById('profile_vehicle_make').value,
        model: document.getElementById('profile_vehicle_model').value,
        color: document.getElementById('profile_vehicle_color').value,
        year: document.getElementById('profile_vehicle_year').value
    };
    const bioWords = Array.from(document.querySelectorAll('#bio-words-container select')).map(select => select.value);
    const bioData = {
        template: document.getElementById('bio-template').value,
        words: bioWords
    };

    try {
        await api.updateUserProfile({ first_name: firstName, vehicle: vehicleData, bio: bioData }, state.authToken);
        
        profileEditMessage.textContent = 'Saved successfully!';
        profileEditMessage.className = 'text-center text-sm mt-4 text-green-500';

        // Manually update the display view with the new data
        document.getElementById('profileFirstName').textContent = firstName || 'N/A';
        document.getElementById('profileVehicle').textContent = (vehicleData.make && vehicleData.model)
            ? `${vehicleData.year || ''} ${vehicleData.color || ''} ${vehicleData.make} ${vehicleData.model}`.trim()
            : 'Not specified';
        document.getElementById('profileBio').innerHTML = renderStructuredComment(bioData);

        setTimeout(() => {
            toggleProfileEditView(false);
            profileEditMessage.textContent = '';
        }, 1500);

    } catch (error) {
        profileEditMessage.textContent = `Error: ${error.message}`;
        profileEditMessage.className = 'text-center text-sm mt-4 text-red-500';
    }
}

export function toggleProfileEditView(showEdit) {
    document.getElementById('profile-display-view').classList.toggle('hidden', showEdit);
    document.getElementById('profile-edit-view').classList.toggle('hidden', !showEdit);
    document.getElementById('editProfileBtn').classList.toggle('hidden', showEdit);
}

export function goBackToProfile() {
    if (state.lastViewedProfile) {
        document.getElementById('reviewDetailModal').classList.add('hidden');
        if (state.lastViewedProfile === state.currentUsername) {
            showMyProfile();
        } else {
            showUserProfile(state.lastViewedProfile);
        }
        setDetailModalMode('feed'); // Reset mode
    }
}