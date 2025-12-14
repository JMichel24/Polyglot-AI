
// Determine the API URL based on the current environment
const getApiUrl = () => {
    // Check if running in a browser environment
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }
    }
    // Default to Android emulator loopback IP for Capacitor/Native environment
    return 'http://10.0.2.2:3000';
};

export const API_BASE_URL = getApiUrl();
