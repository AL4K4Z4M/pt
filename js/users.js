document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/api';
    const usersContainer = document.getElementById('usersContainer');
    const loadingUsers = document.getElementById('loadingUsers');
    const authToken = localStorage.getItem('token');

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users/list`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                loadingUsers.innerHTML = `<p class="text-red-500">Error fetching users: ${errorText}</p>`;
                return;
            }

            const users = await response.json();
            renderUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            loadingUsers.innerHTML = `<p class="text-red-500">An unexpected error occurred. Please try again later.</p>`;
        }
    };

    const renderUsers = (users) => {
        usersContainer.innerHTML = '';

        if (users.length === 0) {
            usersContainer.innerHTML = '<p class="text-secondary">No users found.</p>';
            return;
        }

        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'bg-tertiary p-4 rounded-xl shadow-md flex items-center space-x-4 cursor-pointer user-card';
            userCard.dataset.username = user.username;

            userCard.innerHTML = `
                <div class="flex-shrink-0">
                    <svg class="w-12 h-12 text-tertiary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM7 14a7 7 0 0 0-7 7v1h14v-1a7 7 0 0 0-7-7Z"/></svg>
                </div>
                <div class="flex-grow">
                    <h3 class="font-bold text-primary">${user.username}</h3>
                    <p class="text-sm text-secondary">Member since: ${new Date(user.created_at).toLocaleDateString()}</p>
                </div>
            `;
            usersContainer.appendChild(userCard);
        });

        document.querySelectorAll('.user-card').forEach(card => {
            card.addEventListener('click', (event) => {
                const username = event.currentTarget.dataset.username;
                window.location.href = `home.html?username=${username}`;
            });
        });
    };

    if (authToken) {
        fetchUsers();
    } else {
        loadingUsers.innerHTML = '<p class="text-red-500">You must be logged in to view this page.</p>';
    }
});
