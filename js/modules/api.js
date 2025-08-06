// js/modules/api.js
import { API_URL } from '../constants.js';

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            const errorResult = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorResult.details || errorResult.message || `An error occurred.`);
        }
        // Handle cases where the response might be empty (e.g., 204 No Content)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        }
        return; // Return nothing for non-json responses
    } catch (error) {
        console.error(`API Error on endpoint ${endpoint}:`, error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

// Review APIs
export const getReviews = () => fetchAPI('/reviews');
export const postReview = (data, token) => fetchAPI('/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
});
export const postVote = (reviewId, voteType, token) => fetchAPI(`/reviews/${reviewId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ voteType }),
});

// User & Auth APIs
export const loginUser = (credentials) => fetchAPI('/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
});
export const registerUser = (userData) => fetchAPI('/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
});
export const getUserVotes = (token) => fetchAPI('/user/votes', {
    headers: { 'Authorization': `Bearer ${token}` }
});
export const getMyProfile = (token) => fetchAPI('/users/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
});
export const getUserProfile = (username) => fetchAPI(`/users/profile/${username}`);
export const updateUserProfile = (data, token) => fetchAPI('/users/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
});

// Badge APIs
export const getAllBadges = () => fetchAPI('/badges');