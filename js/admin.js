document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const authToken = localStorage.getItem('token');

    if (!isAdmin) {
        window.location.href = 'home.html';
        return;
    }

    const API_URL = 'https://platetraits.com/api';
    const usersTableBody = document.getElementById('users-table-body');
    const reviewsTableBody = document.getElementById('reviews-table-body');

    const fetchAndDisplayData = async () => {
        try {
            // Fetch Users
            const usersResponse = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!usersResponse.ok) {
                throw new Error('Failed to fetch users. You may not have the required permissions.');
            }
            const users = await usersResponse.json();
            usersTableBody.innerHTML = ''; // Clear existing rows
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.username}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.first_name || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(user.created_at).toLocaleDateString()}</td>
                `;
                usersTableBody.appendChild(row);
            });

            // Fetch Reviews
            const reviewsResponse = await fetch(`${API_URL}/reviews`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!reviewsResponse.ok) {
                throw new Error('Failed to fetch reviews.');
            }
            const reviews = await reviewsResponse.json();
            reviewsTableBody.innerHTML = ''; // Clear existing rows
            reviews.forEach(review => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${review.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.plate_number}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.user_id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.rating}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title="${review.comment}">${review.comment ? review.comment.substring(0, 30) + '...' : 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.status}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(review.created_at).toLocaleString()}</td>
                `;
                reviewsTableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Error fetching admin data:', error);
            const errorMessage = `
                <tr class="text-center">
                    <td colspan="7" class="px-6 py-4 text-red-500">
                        Error: ${error.message}. Please ensure the API is running and you are logged in as an admin.
                    </td>
                </tr>
            `;
            usersTableBody.innerHTML = errorMessage;
            reviewsTableBody.innerHTML = errorMessage;
        }
    };

    fetchAndDisplayData();
});
