const API_URL = 'https://platetraits.com/api';

document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('token');
    if (authToken) {
        fetch(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Could not fetch user profile.');
        })
        .then(data => {
            const user = data.user;
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');

            if (nameInput && user.first_name) {
                nameInput.value = user.first_name;
            }
            if (emailInput && user.email) {
                emailInput.value = user.email;
            }
        })
        .catch(error => {
            console.error('Error fetching user profile for autofill:', error);
        });
    }
});
