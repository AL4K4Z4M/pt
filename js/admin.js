document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        users: [],
        reviews: [],
        badges: [],
        userBadges: [],
        reviewVotes: [],
        get originalData() {
            return {
                users: this.users,
                reviews: this.reviews,
                badges: this.badges,
                userBadges: this.userBadges,
                reviewVotes: this.reviewVotes
            }
        },
        filters: {
            username: ''
        },
        sort: {
            users: { key: 'id', direction: 'asc' },
            reviews: { key: 'created_at', direction: 'desc' },
            badges: { key: 'badge_id', direction: 'asc' },
            userBadges: { key: 'earned_at', direction: 'desc' },
            reviewVotes: { key: 'created_at', direction: 'desc' }
        },
        authToken: localStorage.getItem('token'),
        usernameMap: {} // To map user ID to username
    };

    if (localStorage.getItem('isAdmin') !== 'true' && localStorage.getItem('isAdmin') !== '1') {
        window.location.href = 'home.html';
        return;
    }

    const API_URL = 'https://platetraits.com/api';

    // --- UTILITIES ---
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const sortData = (data, sortKey, direction) => {
        return [...data].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            let comparison = 0;
            if (typeof valA === 'string' && Date.parse(valA) && !isNaN(Date.parse(valA))) {
                // Date string comparison
                comparison = new Date(valA) - new Date(valB);
            } else if (typeof valA === 'string') {
                // Locale-sensitive string comparison
                comparison = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
            } else {
                // Numeric or other types
                comparison = valA > valB ? 1 : -1;
            }

            return direction === 'asc' ? comparison : -comparison;
        });
    };

    // --- GENERIC RENDER ---
    const render = () => {
        const usernameFilter = state.filters.username.toLowerCase();
        let { users, reviews, badges, userBadges, reviewVotes } = state.originalData;

        if (usernameFilter) {
            const matchedUser = state.users.find(u => u.username.toLowerCase() === usernameFilter);
            if (matchedUser) {
                const userId = matchedUser.id;
                users = users.filter(u => u.id === userId);
                reviews = reviews.filter(r => r.user_id === userId);
                userBadges = userBadges.filter(ub => ub.user_id === userId);
                reviewVotes = reviewVotes.filter(rv => rv.user_id === userId);
            } else {
                users = [];
                reviews = [];
                userBadges = [];
                reviewVotes = [];
            }
        }

        // Apply sorting
        users = sortData(users, state.sort.users.key, state.sort.users.direction);
        reviews = sortData(reviews, state.sort.reviews.key, state.sort.reviews.direction);
        badges = sortData(badges, state.sort.badges.key, state.sort.badges.direction);
        userBadges = sortData(userBadges, state.sort.userBadges.key, state.sort.userBadges.direction);
        reviewVotes = sortData(reviewVotes, state.sort.reviewVotes.key, state.sort.reviewVotes.direction);

        // Render tables with filtered and sorted data
        renderUsersTable(users);
        renderReviewsTable(reviews);
        renderBadgesTable(badges);
        renderUserBadgesTable(userBadges);
        renderReviewVotesTable(reviewVotes);

        updateStats(users, reviews, badges, userBadges, reviewVotes);
        updateSortIndicators();
    };

    // --- TABLE-SPECIFIC RENDERERS ---

    const renderTable = (tableBodyId, data, rowRenderer) => {
        const tableBody = document.getElementById(tableBodyId);
        if (!tableBody) return;

        tableBody.innerHTML = '';
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = rowRenderer(item);
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="100%" class="text-center p-4">No data found.</td></tr>`;
        }
    };

    const renderUsersTable = (users) => {
        const userRowRenderer = (user) => `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.username}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.first_name || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(user.created_at).toLocaleDateString()}</td>
        `;
        renderTable('users-table-body', users, userRowRenderer);
    };

    const renderReviewsTable = (reviews) => {
        const reviewRowRenderer = (review) => `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${review.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.plate_number}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${state.usernameMap[review.user_id] || review.user_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.rating}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.status}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(review.created_at).toLocaleString()}</td>
        `;
        renderTable('reviews-table-body', reviews, reviewRowRenderer);
    };

    const renderBadgesTable = (badges) => {
        const badgeRowRenderer = (badge) => `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${badge.badge_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${badge.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${badge.description}</td>
        `;
        renderTable('badges-table-body', badges, badgeRowRenderer);
    };

    const renderUserBadgesTable = (userBadges) => {
        const userBadgeRowRenderer = (userBadge) => `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${userBadge.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${state.usernameMap[userBadge.user_id] || userBadge.user_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${userBadge.badge_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(userBadge.earned_at).toLocaleString()}</td>
        `;
        renderTable('user-badges-table-body', userBadges, userBadgeRowRenderer);
    };

    const renderReviewVotesTable = (reviewVotes) => {
        const reviewVoteRowRenderer = (vote) => `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${vote.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vote.review_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${state.usernameMap[vote.user_id] || vote.user_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vote.vote_type}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(vote.created_at).toLocaleString()}</td>
        `;
        renderTable('review-votes-table-body', reviewVotes, reviewVoteRowRenderer);
    };

    // --- STATS ---
    const updateStats = (users, reviews, badges, userBadges, reviewVotes) => {
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('total-reviews').textContent = reviews.length;
        document.getElementById('total-badges').textContent = badges.length;
        document.getElementById('total-user-badges').textContent = userBadges.length;
        document.getElementById('total-votes').textContent = reviewVotes.length;
    };

    // --- UI UPDATES ---
    const updateSortIndicators = () => {
        document.querySelectorAll('.sortable').forEach(header => {
            const tableKey = header.dataset.table;
            const sortKey = header.dataset.sortKey;
            header.classList.remove('asc', 'desc');
            if (state.sort[tableKey] && state.sort[tableKey].key === sortKey) {
                header.classList.add(state.sort[tableKey].direction);
            }
        });
    };

    // --- DATA FETCHING ---
    const fetchData = async (endpoint, stateKey) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: { 'Authorization': `Bearer ${state.authToken}` }
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || `Failed to fetch ${endpoint}`);
            }
            state[stateKey] = await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            const tableBodyId = `${stateKey}-table-body`;
            const tableBody = document.getElementById(tableBodyId);
            if(tableBody) {
                tableBody.innerHTML = `<tr><td colspan="100%" class="text-center p-4 text-red-600">Error: ${error.message}</td></tr>`;
            }
        }
    };

    // --- INITIALIZATION ---
    const init = async () => {
        // Fetch all data in parallel
        await Promise.all([
            fetchData('/users', 'users'),
            fetchData('/admin/reviews', 'reviews'),
            fetchData('/badges', 'badges'),
            fetchData('/user_badges', 'userBadges'),
            fetchData('/review_votes', 'reviewVotes')
        ]);

        // Create a map of user IDs to usernames
        state.users.forEach(user => {
            state.usernameMap[user.id] = user.username;
        });

        // Add event listeners
        const userFilterInput = document.getElementById('user-filter');
        userFilterInput.addEventListener('input', debounce((e) => {
            state.filters.username = e.target.value.trim();
            render();
        }, 300));

        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const tableKey = header.dataset.table;
                const sortKey = header.dataset.sortKey;
                const currentSort = state.sort[tableKey];

                if (currentSort.key === sortKey) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.key = sortKey;
                    currentSort.direction = 'asc';
                }
                render();
            });
        });

        // Initial render
        render();
    };

    init();
});
