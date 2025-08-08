document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const authToken = localStorage.getItem('token');

    if (!isAdmin) {
        window.location.href = 'home.html';
        return;
    }

    const API_URL = 'https://platetraits.com/api';

    const renderTable = (endpoint, tableBodyId, rowRenderer, statsUpdater) => {
        const tableBody = document.getElementById(tableBodyId);
        if (!tableBody) return;

        tableBody.innerHTML = `<tr><td colspan="100%" class="text-center p-4">Loading...</td></tr>`;

        fetch(`${API_URL}${endpoint}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || `Failed to fetch ${endpoint}`) });
            }
            return response.json();
        })
        .then(data => {
            tableBody.innerHTML = '';
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = rowRenderer(item);
                    tableBody.appendChild(row);
                });
                if (statsUpdater) {
                    statsUpdater(data);
                }
            } else {
                tableBody.innerHTML = `<tr><td colspan="100%" class="text-center p-4">No data found.</td></tr>`;
            }
        })
        .catch(error => {
            console.error(`Error fetching ${endpoint}:`, error);
            tableBody.innerHTML = `<tr><td colspan="100%" class="text-center p-4 text-red-600">Error: ${error.message}</td></tr>`;
        });
    };

    // --- Render Functions for Each Table ---

    const userRowRenderer = (user) => `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.username}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.first_name || 'N/A'}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(user.created_at).toLocaleDateString()}</td>
    `;

    const reviewRowRenderer = (review) => `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${review.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.plate_number}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.user_id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.rating}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.status}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(review.created_at).toLocaleString()}</td>
    `;

    const badgeRowRenderer = (badge) => `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${badge.badge_id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${badge.name}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${badge.description}</td>
    `;

    const userBadgeRowRenderer = (userBadge) => `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${userBadge.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${userBadge.user_id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${userBadge.badge_id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(userBadge.earned_at).toLocaleString()}</td>
    `;

    const reviewVoteRowRenderer = (vote) => `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${vote.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vote.review_id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vote.user_id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vote.vote_type}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(vote.created_at).toLocaleString()}</td>
    `;

    // --- Stats Updaters ---

    const updateTotalUsers = (data) => document.getElementById('total-users').textContent = data.length;
    const updateTotalReviews = (data) => document.getElementById('total-reviews').textContent = data.length;
    const updateTotalBadges = (data) => document.getElementById('total-badges').textContent = data.length;
    const updateTotalUserBadges = (data) => document.getElementById('total-user-badges').textContent = data.length;
    const updateTotalVotes = (data) => document.getElementById('total-votes').textContent = data.length;

    // --- Initial Data Fetch ---
    renderTable('/users', 'users-table-body', userRowRenderer, updateTotalUsers);
    renderTable('/admin/reviews', 'reviews-table-body', reviewRowRenderer, updateTotalReviews);
    renderTable('/badges', 'badges-table-body', badgeRowRenderer, updateTotalBadges);
    renderTable('/user_badges', 'user-badges-table-body', userBadgeRowRenderer, updateTotalUserBadges);
    renderTable('/review_votes', 'review-votes-table-body', reviewVoteRowRenderer, updateTotalVotes);
});
