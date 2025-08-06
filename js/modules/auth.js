// js/modules/auth.js
import { state, setAuthToken, clearAuthToken } from '../state.js';
import * as api from './api.js';
import { updateAuthUI, updateAuthModalView, renderReviews } from './render.js';

export async function handleLogin(form) {
    const authMessage = document.getElementById('authMessage');
    authMessage.textContent = 'Processing...';
    authMessage.className = 'text-center text-gray-400';
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const result = await api.loginUser(data);
        setAuthToken(result.accessToken, result.username);
        authMessage.textContent = 'Login successful!';
        authMessage.className = 'text-center text-green-500';

        await fetchUserVotesAndUpdateState();
        updateAuthUI();
        setTimeout(() => {
            document.getElementById('authModal').classList.add('hidden');
            updateAuthModalView();
        }, 500);
    } catch (error) {
        authMessage.textContent = `Error: ${error.message}`;
        authMessage.className = 'text-center text-red-500';
    }
}

export async function handleRegister(form) {
    const authMessage = document.getElementById('authMessage');
    authMessage.textContent = 'Processing...';
    authMessage.className = 'text-center text-gray-400';
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
        authMessage.textContent = 'Passwords do not match.';
        authMessage.className = 'text-center text-red-500';
        return;
    }

    try {
        await api.registerUser(data);
        authMessage.textContent = 'Registration successful! Please log in.';
        authMessage.className = 'text-center text-green-500';
        // Automatically switch to login view
        setTimeout(switchAuthMode, 1500);
    } catch (error) {
        authMessage.textContent = `Error: ${error.message}`;
        authMessage.className = 'text-center text-red-500';
    }
}

export function handleLogout() {
    clearAuthToken();
    updateAuthUI();
    document.getElementById('profileModal').classList.add('hidden');
    // We may need to re-render reviews to remove any personalized data
    renderReviews();
};

export function switchAuthMode() {
    state.isAuthModalInLoginMode = !state.isAuthModalInLoginMode;
    updateAuthModalView();
};

export async function fetchUserVotesAndUpdateState() {
    if (!state.authToken) {
        state.userVotes = {};
        return;
    }
    try {
        const result = await api.getUserVotes(state.authToken);
        state.userVotes = result.votes.reduce((acc, vote) => {
            acc[vote.review_id] = vote.vote_type;
            return acc;
        }, {});
    } catch (error) {
        console.error("Failed to fetch user votes:", error);
        state.userVotes = {};
    }
}