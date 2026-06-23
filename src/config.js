
// Determine the API URL based on the current environment
import { Capacitor } from '@capacitor/core';

// Determine the API URL based on the current environment
const getApiUrl = () => {
    // If running on a native platform (Android/iOS), use the emulator loopback IP
    if (Capacitor.isNativePlatform()) {
        return 'http://10.0.2.2:3000';
    }

    // Default to environment variable or localhost for web/browser
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

export const API_BASE_URL = getApiUrl();
