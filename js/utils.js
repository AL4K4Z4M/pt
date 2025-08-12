/**
 * A utility function to handle API errors in a standardized way.
 * It attempts to parse a JSON error response from the server and displays
 * the most specific error message available. If the response is not JSON,
 * it falls back to a generic message based on the HTTP status.
 *
 * @param {Response} response - The `fetch` Response object.
 * @param {HTMLElement} messageElement - The HTML element where the error message should be displayed.
 * @returns {Promise<void>}
 */
async function handleApiError(response, messageElement) {
    if (!messageElement) {
        console.error("handleApiError called without a message element.");
        return;
    }

    let errorMessage = `An unexpected error occurred. Please try again later.`; // Default generic error

    try {
        // Try to parse the response body as JSON
        const result = await response.json();

        // Use the most specific message available from the API response
        errorMessage = result.details || result.message || result.error || JSON.stringify(result);

    } catch (e) {
        // If the response is not JSON, use the status text
        errorMessage = `Error: ${response.status} ${response.statusText || 'An unknown server error occurred.'}`;
    }

    messageElement.textContent = errorMessage;
    messageElement.className = 'text-center text-sm mt-4 text-red-500'; // Standard error styling
}

function openMenu() {
    const sideMenu = document.getElementById('side-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sideMenu && sidebarOverlay) {
        sideMenu.classList.remove('-translate-x-full');
        sidebarOverlay.classList.remove('hidden');
        document.dispatchEvent(new CustomEvent('menuOpened'));
    }
}

function closeMenu() {
    const sideMenu = document.getElementById('side-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sideMenu && sidebarOverlay) {
        sideMenu.classList.add('-translate-x-full');
        sidebarOverlay.classList.add('hidden');
    }
}
