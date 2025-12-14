import { API_BASE_URL } from '../config';

const API_URL = API_BASE_URL;

export const sendMessageToGemini = async (text, language, level, history, lessonContext = null, method = 'text', audioBlob = null, nativeLanguage = 'English', username = null) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    let body;
    let headers = {
        'Authorization': `Bearer ${token}`
    };

    if (audioBlob) {
        const formData = new FormData();
        formData.append('message', text || '');
        formData.append('language', language);
        formData.append('nativeLanguage', nativeLanguage);
        formData.append('level', level);
        formData.append('history', JSON.stringify(history));
        if (lessonContext) formData.append('lessonContext', JSON.stringify(lessonContext));
        formData.append('inputMethod', method);
        if (username) formData.append('username', username);
        formData.append('audio', audioBlob, 'voice_message.webm');
        body = formData;
        // Content-Type header is automatically set by browser for FormData
    } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
            message: text,
            language,
            nativeLanguage,
            level,
            history,
            lessonContext,
            inputMethod: method,
            username
        });
    }

    const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers,
        body
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from AI');
    }

    return response.json();
};

export const getChatHistory = async (lessonId = null) => {
    const token = localStorage.getItem('token');
    if (!token) return [];

    let url = `${API_URL}/chat/history`;
    if (lessonId) {
        url += `?lessonId=${encodeURIComponent(lessonId)}`;
    }

    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) return [];
    return response.json();
};
