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
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 manage-user-btn" data-user-id="${user.id}">Manage</button>
            </td>
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


    // --- MODAL LOGIC ---
    const openManageUserModal = (userId) => {
        const modal = document.getElementById('manage-user-modal');
        const user = state.users.find(u => u.id === userId);
        if (!user) return;

        // Store current user for other modal functions
        modal.dataset.userId = userId;

        // Populate user info
        document.getElementById('modal-username').textContent = user.username;
        document.getElementById('modal-first-name').value = user.first_name || '';
        document.getElementById('modal-email').value = user.email || '';

        // Populate badge dropdown
        const badgeSelect = document.getElementById('modal-badge-select');
        badgeSelect.innerHTML = '<option value="">Select a badge to award...</option>';
        state.badges.forEach(badge => {
            const option = document.createElement('option');
            option.value = badge.badge_id;
            option.textContent = `${badge.name} (${badge.badge_id})`;
            badgeSelect.appendChild(option);
        });

        // Populate current badges
        const userBadgesContainer = document.getElementById('modal-user-badges');
        userBadgesContainer.innerHTML = '';
        const usersBadges = state.userBadges.filter(ub => ub.user_id === userId);
        if (usersBadges.length > 0) {
            usersBadges.forEach(userBadge => {
                const badgeData = state.badges.find(b => b.badge_id === userBadge.badge_id);
                const badgeEl = document.createElement('span');
                badgeEl.className = 'px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-sm';
                badgeEl.textContent = badgeData ? badgeData.name : userBadge.badge_id;
                userBadgesContainer.appendChild(badgeEl);
            });
        } else {
            userBadgesContainer.innerHTML = '<p class="text-sm text-gray-500">This user has no badges.</p>';
        }

        // Clear any previous messages
        document.getElementById('edit-user-message').textContent = '';
        document.getElementById('award-badge-message').textContent = '';

        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        document.getElementById('manage-user-modal').classList.add('hidden');
    };

    const handleSaveUser = async () => {
        const modal = document.getElementById('manage-user-modal');
        const userId = modal.dataset.userId;
        const messageEl = document.getElementById('edit-user-message');
        const firstName = document.getElementById('modal-first-name').value;
        const email = document.getElementById('modal-email').value;

        messageEl.textContent = 'Saving...';
        messageEl.className = 'text-sm mt-2 text-gray-500';

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.authToken}`
                },
                body: JSON.stringify({ first_name: firstName, email })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to save user.');
            }

            messageEl.textContent = 'User saved successfully!';
            messageEl.className = 'text-sm mt-2 text-green-600';

            // Update state and re-render
            const userIndex = state.users.findIndex(u => u.id == userId);
            if (userIndex > -1) {
                state.users[userIndex].first_name = firstName;
                state.users[userIndex].email = email;
            }
            render();

        } catch (error) {
            messageEl.textContent = `Error: ${error.message}`;
            messageEl.className = 'text-sm mt-2 text-red-600';
        }
    };

    const handleAwardBadge = async () => {
        const modal = document.getElementById('manage-user-modal');
        const userId = modal.dataset.userId;
        const messageEl = document.getElementById('award-badge-message');
        const badgeSelect = document.getElementById('modal-badge-select');
        const badgeId = badgeSelect.value;

        if (!badgeId) {
            messageEl.textContent = 'Please select a badge.';
            messageEl.className = 'text-sm mt-2 text-red-600';
            return;
        }

        messageEl.textContent = 'Awarding...';
        messageEl.className = 'text-sm mt-2 text-gray-500';

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/badges`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.authToken}`
                },
                body: JSON.stringify({ badge_id: badgeId })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to award badge.');
            }

            messageEl.textContent = 'Badge awarded successfully!';
            messageEl.className = 'text-sm mt-2 text-green-600';

            // Re-fetch user badges and re-render the modal content to show the new badge
            await fetchData('/user_badges', 'userBadges');
            openManageUserModal(parseInt(userId, 10));

        } catch (error) {
            messageEl.textContent = `Error: ${error.message}`;
            messageEl.className = 'text-sm mt-2 text-red-600';
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
        const suggestionsContainer = document.getElementById('autocomplete-suggestions');

        const renderAutocomplete = () => {
            const value = userFilterInput.value.toLowerCase();
            suggestionsContainer.innerHTML = '';
            if (!value) {
                suggestionsContainer.classList.add('hidden');
                return;
            }

            const suggestions = state.users
                .filter(user => user.username.toLowerCase().includes(value))
                .slice(0, 10); // Limit to 10 suggestions

            if (suggestions.length > 0) {
                suggestions.forEach(user => {
                    const item = document.createElement('div');
                    item.className = 'p-2 hover:bg-gray-100 cursor-pointer';
                    item.textContent = user.username;
                    item.addEventListener('click', () => {
                        userFilterInput.value = user.username;
                        state.filters.username = user.username;
                        suggestionsContainer.classList.add('hidden');
                        render();
                    });
                    suggestionsContainer.appendChild(item);
                });
                suggestionsContainer.classList.remove('hidden');
            } else {
                suggestionsContainer.classList.add('hidden');
            }
        };

        userFilterInput.addEventListener('input', debounce(renderAutocomplete, 300));

        userFilterInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                state.filters.username = e.target.value.trim();
                suggestionsContainer.classList.add('hidden');
                render();
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!userFilterInput.contains(e.target)) {
                suggestionsContainer.classList.add('hidden');
            }
        });

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

        // Modal Listeners
        document.getElementById('users-table-body').addEventListener('click', (e) => {
            if (e.target.classList.contains('manage-user-btn')) {
                const userId = parseInt(e.target.dataset.userId, 10);
                openManageUserModal(userId);
            }
        });
        document.getElementById('close-modal-btn').addEventListener('click', closeModal);
        document.getElementById('save-user-btn').addEventListener('click', handleSaveUser);
        document.getElementById('award-badge-btn').addEventListener('click', handleAwardBadge);

        // Initial render
        render();
    };

    init();
});
