// Audio Service for Speech-to-Text (STT) and Text-to-Speech (TTS)

let recognitionInstance = null;
let isPaused = false;

// Pause TTS playback
export const pauseAudio = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
        isPaused = true;
    }
};

// Resume TTS playback
export const resumeAudio = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
        isPaused = false;
    }
};

// Stop TTS playback completely
export const stopAudio = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        isPaused = false;
    }
};

// Check if TTS is paused
export const isAudioPaused = () => isPaused;

export const startListening = (language, onInterim) => {
    return new Promise((resolve, reject) => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            reject("Browser does not support Speech Recognition");
            return;
        }

        if (recognitionInstance) {
            recognitionInstance.stop();
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionInstance = recognition;

        // Map language names to BCP 47 tags
        const langMap = {
            'English': 'en-US',
            'Spanish': 'es-ES',
            'Korean': 'ko-KR',
            'Japanese': 'ja-JP',
            'Italian': 'it-IT',
            'French': 'fr-FR',
            'German': 'de-DE'
        };

        recognition.lang = langMap[language] || 'en-US';
        recognition.continuous = false;
        recognition.interimResults = true; // Enable interim results

        let hasResult = false;
        let finalTranscript = '';

        // Safety timeout (8 seconds)
        const timeoutId = setTimeout(() => {
            if (!hasResult) {
                console.warn("STT Timeout - No speech detected");
                recognition.stop();
                resolve(finalTranscript);
            }
        }, 8000);

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                    hasResult = true;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (onInterim) {
                onInterim(finalTranscript + interimTranscript);
            }
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onerror = (event) => {
            clearTimeout(timeoutId);
            console.error("STT Error Event:", event.error);
            if (event.error === 'no-speech') {
                resolve(finalTranscript);
            } else {
                reject(event.error);
            }
        };

        recognition.onend = () => {
            clearTimeout(timeoutId);
            console.log("STT Ended");
            resolve(finalTranscript);
        };

        try {
            recognition.start();
            console.log("STT Started");
        } catch (e) {
            clearTimeout(timeoutId);
            reject(e);
        }
    });
};

export const stopListening = () => {
    if (recognitionInstance) {
        recognitionInstance.stop();
        recognitionInstance = null;
    }
    console.log("Stopping listening...");
};

export const playAudio = (text, targetLanguage, onStart, onEnd, nativeLanguage = 'English') => {
    return new Promise((resolve) => {
        if (!('speechSynthesis' in window)) {
            console.error("Browser does not support Speech Synthesis");
            resolve();
            return;
        }

        // Cancel any currently playing audio
        window.speechSynthesis.cancel();

        // Regex to split by <target> tags
        // Captures the tags and content as separate parts
        const parts = text.split(/(<target>.*?<\/target>)/g).filter(part => part.trim() !== '');

        if (parts.length === 0) {
            resolve();
            return;
        }

        const langMap = {
            'English': 'en-US',
            'Spanish': 'es-ES',
            'Korean': 'ko-KR',
            'Japanese': 'ja-JP',
            'Italian': 'it-IT',
            'French': 'fr-FR',
            'German': 'de-DE'
        };

        const targetLangCode = langMap[targetLanguage] || 'en-US';
        const nativeLangCode = langMap[nativeLanguage] || 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const targetVoice = voices.find(v => v.lang === targetLangCode) || voices.find(v => v.lang.startsWith(targetLangCode.split('-')[0]));
        const nativeVoice = voices.find(v => v.lang === nativeLangCode) || voices.find(v => v.lang.startsWith(nativeLangCode.split('-')[0]));

        let utteranceCount = parts.length;
        let finishedCount = 0;

        parts.forEach((part, index) => {
            const isTarget = part.startsWith('<target>');
            const cleanText = part.replace(/<\/?target>/g, '').trim();

            if (!cleanText) {
                finishedCount++;
                if (finishedCount === utteranceCount) {
                    if (onEnd) onEnd();
                    resolve();
                }
                return;
            }

            // Remove asterisks, dashes, underscores, etc. for better pronunciation
            // Also remove pronunciation guides in parentheses like "(Man-na-seo ban-gap-seup-ni-da)"
            const spokenText = cleanText
                .replace(/[*#_`~]/g, '') // Remove markdown characters
                .replace(/\([^)]*[a-zA-Z][^)]*\)/g, '') // Remove parentheses containing romanized text
                .replace(/\s+/g, ' ') // Collapse multiple spaces
                .trim();

            const utterance = new SpeechSynthesisUtterance(spokenText);

            // Set speech rate (1.0 = normal, 1.15 = slightly faster for fluency)
            utterance.rate = 1.15;

            // Select Voice
            if (isTarget) {
                utterance.lang = targetLangCode;
                if (targetVoice) utterance.voice = targetVoice;
            } else {
                utterance.lang = nativeLangCode;
                if (nativeVoice) utterance.voice = nativeVoice;
            }

            // Events
            if (index === 0) {
                utterance.onstart = () => {
                    console.log("TTS Started Sequence");
                    if (onStart) onStart();
                };
            }

            utterance.onend = () => {
                finishedCount++;
                if (finishedCount === utteranceCount) {
                    console.log("TTS Ended Sequence");
                    if (onEnd) onEnd();
                    resolve();
                }
            };

            utterance.onerror = (e) => {
                console.error("TTS Error:", e);
                finishedCount++;
                if (finishedCount === utteranceCount) {
                    if (onEnd) onEnd();
                    resolve();
                }
            };

            window.speechSynthesis.speak(utterance);
        });
    });
};

