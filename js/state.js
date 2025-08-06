// js/state.js
export const state = {
    allReviewsData: [],
    aggregatedReviewsData: {},
    currentPlateReviews: [],
    currentReviewIndex: 0,
    userVotes: {}, // { [review_id]: 'up' | 'down' }
    lastViewedProfile: null, // To store the username for "Back to Profile"
    authToken: localStorage.getItem('token'),
    currentUsername: localStorage.getItem('username'),
    isAuthModalInLoginMode: true,
};

export function setAuthToken(token, username) {
    state.authToken = token;
    state.currentUsername = username;
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
}

export function clearAuthToken() {
    state.authToken = null;
    state.currentUsername = null;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    state.userVotes = {};
}