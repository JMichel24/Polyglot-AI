import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, Send, Volume2, MicOff, Settings, Keyboard, StopCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { sendMessageToGemini, getChatHistory } from '../services/geminiService';
import { startListening, stopListening, playAudio } from '../services/audioService';
import SettingsModal from './SettingsModal';
import KoreanKeyboard from './KoreanKeyboard';
import JapaneseKeyboard from './JapaneseKeyboard';
import { composeHangul, deleteHangul } from '../services/hangulService';

export default function ChatScreen({ language, level, avatar, onBack, onUpdateSettings, lessonContext, nativeLanguage, username, chatMode = 'lesson' }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [isHandsFree, setIsHandsFree] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    const [inputSource, setInputSource] = useState('text');


    // Audio Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const loadHistory = async () => {
            try {
                // Generate chat ID based on mode
                // For lessons: use lesson ID
                // For practice: use 'practice-free' as a fixed ID
                const chatId = chatMode === 'practice' ? 'practice-free' : lessonContext?.id;
                const history = await getChatHistory(chatId);

                if (history.length > 0) {
                    setMessages(history);
                } else {
                    // Initial greeting if no history exists
                    if (chatMode === 'lesson' && lessonContext) {
                        setMessages([{
                            id: 'init',
                            role: 'assistant',
                            content: `Welcome to ${lessonContext.title}! Today we will learn about: ${lessonContext.topic}. Ready to start?`,
                            correction: null
                        }]);
                    } else {
                        // Practice mode - free conversation
                        setMessages([{
                            id: 'init',
                            role: 'assistant',
                            content: `Hello! I'm your ${language} tutor. Let's have a free conversation to practice! What would you like to talk about today?`,
                            correction: null
                        }]);
                    }
                }
            } catch (error) {
                console.error("Failed to load history", error);
            }
        };
        loadHistory();
    }, [lessonContext, language, level, chatMode]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Safety Watchdog for STT
    useEffect(() => {
        let watchdogTimer;
        if (isListening) {
            watchdogTimer = setTimeout(() => {
                if (isListening) {
                    console.warn("Watchdog: Force stopping listening");
                    setIsListening(false);
                    stopListening();
                    setMessages(prev => [...prev, {
                        id: uuidv4(),
                        role: 'system',
                        content: 'Microphone timed out.',
                        correction: null
                    }]);
                }
            }, 8000);
        }
        return () => clearTimeout(watchdogTimer);
    }, [isListening]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            stopListening();
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);



    const handleKoreanInput = (char) => {
        setInputText(prev => composeHangul(prev, char));
        setInputSource('text');
    };

    const handleKoreanDelete = () => {
        if (inputText.length === 0) return;
        setInputText(prev => deleteHangul(prev));
        setInputSource('text');
    };

    // Japanese doesn't need composition like Korean - just append
    const handleJapaneseInput = (char) => {
        setInputText(prev => prev + char);
        setInputSource('text');
    };

    const handleJapaneseDelete = () => {
        if (inputText.length === 0) return;
        setInputText(prev => prev.slice(0, -1));
        setInputSource('text');
    };

    const handleSendMessage = async (textOverride = null, methodOverride = null, audioBlob = null) => {
        const textToSend = textOverride || inputText;
        const method = methodOverride || inputSource;

        // Allow sending if there's text OR audio
        if (!textToSend.trim() && !audioBlob) return;

        const userMessage = {
            id: uuidv4(),
            role: 'user',
            content: audioBlob ? '🎤 [Voice Message]' : textToSend,
            audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null,
            correction: null
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);
        setInputSource('text');

        try {
            // Generate the lesson context based on mode
            // For practice mode, create a special context with 'practice-free' as ID
            const contextForApi = chatMode === 'practice'
                ? { id: 'practice-free', title: 'Free Practice', topic: 'Free conversation' }
                : lessonContext;

            // Pass audioBlob if present
            const response = await sendMessageToGemini(textToSend, language, level, messages, contextForApi, method, audioBlob, nativeLanguage, username);

            const aiMessage = {
                id: uuidv4(),
                role: 'assistant',
                content: response.content,
                correction: response.correction
            };

            setMessages(prev => [...prev, aiMessage]);

            // Play Audio with Animation
            await playAudio(
                response.content,
                language,
                () => setIsAiSpeaking(true), // onStart
                () => setIsAiSpeaking(false), // onEnd
                nativeLanguage // Pass native language for dual-voice TTS
            );

            if (isHandsFree) {
                setTimeout(() => {
                    startHandsFreeListening();
                }, 500);
            }

        } catch (error) {
            console.error("Error getting response:", error);
            setMessages(prev => [...prev, {
                id: uuidv4(),
                role: 'system',
                content: `Error: ${error.message}`,
                correction: null
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- REAL AUDIO RECORDING ---
    const isPreparingRecording = useRef(false);
    const shouldStopAfterPrepare = useRef(false);

    const startRecording = async (e) => {
        if (e) e.preventDefault();
        if (isRecording || isPreparingRecording.current) return;

        isPreparingRecording.current = true;
        shouldStopAfterPrepare.current = false;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Check if we should stop immediately (user released button while getting stream)
            if (shouldStopAfterPrepare.current) {
                stream.getTracks().forEach(track => track.stop());
                isPreparingRecording.current = false;
                return;
            }

            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                // Only send if we have data and it was a valid recording session
                if (audioBlob.size > 0) {
                    handleSendMessage(null, 'voice', audioBlob);
                }

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone.");
        } finally {
            isPreparingRecording.current = false;
        }
    };

    const stopRecording = (e) => {
        if (e) e.preventDefault();

        if (isPreparingRecording.current) {
            shouldStopAfterPrepare.current = true;
            return;
        }

        if (mediaRecorderRef.current && isRecording) {
            // Add a small delay to ensure we capture the last bit of audio
            setTimeout(() => {
                if (mediaRecorderRef.current.state !== 'inactive') {
                    mediaRecorderRef.current.stop();
                    setIsRecording(false);
                }
            }, 200);
        }
    };

    const startHandsFreeListening = async () => {
        if (!isHandsFree) return;
        setIsListening(true);
        try {
            const text = await startListening(language);
            setIsListening(false);
            if (text && text.trim()) {
                handleSendMessage(text, 'voice');
            } else {
                setIsHandsFree(false);
                setMessages(prev => [...prev, {
                    id: uuidv4(),
                    role: 'system',
                    content: 'Hands-free stopped: No speech detected.',
                    correction: null
                }]);
            }
        } catch (error) {
            console.error("STT Error:", error);
            setIsListening(false);
            setIsHandsFree(false);
            setMessages(prev => [...prev, {
                id: uuidv4(),
                role: 'system',
                content: `Microphone Error: ${error}`,
                correction: null
            }]);
        }
    };

    const toggleListening = async () => {
        if (isListening) {
            stopListening();
            setIsListening(false);
        } else {
            setIsListening(true);
            try {
                const text = await startListening(language, (interimText) => {
                    setInputText(interimText);
                    setInputSource('voice');
                });

                if (text && text.trim()) {
                    setInputText(text);
                    setInputSource('voice');
                    handleSendMessage(text, 'voice');
                } else {
                    setMessages(prev => [...prev, {
                        id: uuidv4(),
                        role: 'system',
                        content: 'No speech detected.',
                        correction: null
                    }]);
                }
                setIsListening(false);
            } catch (error) {
                console.error("STT Error:", error);
                setIsListening(false);
                setMessages(prev => [...prev, {
                    id: uuidv4(),
                    role: 'system',
                    content: `Microphone Error: ${error}`,
                    correction: null
                }]);
            }
        }
    };

    const handleSettingsSave = (newLang, newLevel, newApiKey) => {
        if (newApiKey) {
            setApiKey(newApiKey);
            localStorage.setItem('gemini_api_key', newApiKey);
        }

        if (newLang !== language || newLevel !== level) {
            onUpdateSettings(newLang, newLevel);
            setMessages(prev => [...prev, {
                id: uuidv4(),
                role: 'system',
                content: `Settings updated: ${newLang} (${newLevel})`,
                correction: null
            }]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-full transition-colors mr-2">
                        <ArrowLeft size={20} className="text-slate-300" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500/30">
                            <img
                                src={`/src/assets/avatar_${avatar || 'cat'}.png`}
                                alt="Tutor Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="font-bold text-white">{language} Tutor</h2>
                            <p className="text-xs text-slate-400">{level} Level</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
                >
                    <Settings size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 md:space-y-6 pb-32">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : msg.role === 'system' ? 'items-center' : 'items-start'}`}>
                        {msg.role === 'system' ? (
                            <div className="bg-slate-800/50 text-slate-400 text-xs px-3 py-1 rounded-full border border-slate-700">
                                {msg.content}
                            </div>
                        ) : (
                            <>
                                <div
                                    className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                                        }`}
                                >
                                    {msg.audioUrl ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const audio = new Audio(msg.audioUrl);
                                                    audio.play();
                                                }}
                                                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                                            >
                                                <Volume2 size={20} className="text-white" />
                                            </button>
                                            <span className="text-sm font-medium">Voice Message</span>
                                        </div>
                                    ) : (
                                        <div className="leading-relaxed">
                                            {/* Parse and format message content */}
                                            {msg.content.split(/(<target>.*?<\/target>)/g).map((part, i) => {
                                                if (part.startsWith('<target>')) {
                                                    return (
                                                        <span key={i} className="font-bold text-blue-300 mx-1">
                                                            {part.replace(/<\/?target>/g, '')}
                                                        </span>
                                                    );
                                                }
                                                return <span key={i}>{part}</span>;
                                            })}
                                        </div>
                                    )}
                                </div>

                                {msg.correction && (
                                    <div className="mt-2 max-w-[85%] bg-amber-900/30 border border-amber-700/50 p-3 rounded-xl text-sm text-amber-200">
                                        <p className="font-bold text-xs uppercase mb-1 opacity-70">Correction</p>
                                        {msg.correction}
                                    </div>
                                )}

                                {msg.role === 'assistant' && (
                                    <button
                                        onClick={() => playAudio(msg.content, language, null, null, nativeLanguage)}
                                        className="mt-2 text-slate-500 hover:text-blue-400 transition-colors p-1"
                                    >
                                        <Volume2 size={16} />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center space-x-2 p-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150" />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-800 border-t border-slate-700 z-20">
                {isListening && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse shadow-lg">
                        Listening...
                    </div>
                )}

                {language === 'Korean' && (
                    <div className="absolute -top-8 right-4">
                        <button
                            onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
                            className={`px-3 py-1 rounded-t-lg text-xs font-bold ${isKeyboardOpen ? 'bg-slate-800 text-blue-400' : 'bg-slate-700 text-slate-400'}`}
                        >
                            ⌨️ 한글
                        </button>
                    </div>
                )}

                {language === 'Japanese' && (
                    <div className="absolute -top-8 right-4">
                        <button
                            onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
                            className={`px-3 py-1 rounded-t-lg text-xs font-bold ${isKeyboardOpen ? 'bg-slate-800 text-purple-400' : 'bg-slate-700 text-slate-400'}`}
                        >
                            ⌨️ かな
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-1 md:gap-2">
                    {/* KEYBOARD TOGGLE (Visual only for now, logic handled by state) */}
                    <button
                        onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
                        className={`p-2 md:p-3 rounded-full transition-colors shrink-0 ${isKeyboardOpen ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                        title="Toggle Keyboard"
                    >
                        <Keyboard size={18} />
                    </button>

                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            setInputSource('text');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={isRecording ? "Recording..." : (language === 'Korean' && isKeyboardOpen ? "Use virtual keyboard..." : "Type...")}
                        className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-full px-3 py-2 md:px-4 md:py-3 text-white text-sm md:text-base focus:outline-none focus:border-blue-500 transition-colors"
                        disabled={isLoading || isListening || isRecording}
                    />

                    {/* VOICE RECORD BUTTON (HOLD TO RECORD) */}
                    <button
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        onMouseLeave={stopRecording}
                        onTouchStart={startRecording}
                        onTouchEnd={stopRecording}
                        className={`p-2 md:p-3 rounded-full transition-all duration-200 shrink-0 ${isRecording
                            ? 'bg-red-500 text-white scale-110 ring-4 ring-red-500/30'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        title="Hold to Record"
                        disabled={isLoading || isListening}
                    >
                        {isRecording ? <StopCircle size={18} className="animate-pulse" /> : <Mic size={18} />}
                    </button>

                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputText.trim() || isLoading || isListening || isRecording}
                        className="p-2 md:p-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Virtual Keyboard */}
            {language === 'Korean' && isKeyboardOpen && (
                <div className="bg-slate-800 border-t border-slate-700 animate-slide-up">
                    <KoreanKeyboard onInput={handleKoreanInput} onDelete={handleKoreanDelete} />
                </div>
            )}

            {language === 'Japanese' && isKeyboardOpen && (
                <div className="bg-slate-800 border-t border-slate-700 animate-slide-up">
                    <JapaneseKeyboard onInput={handleJapaneseInput} onDelete={handleJapaneseDelete} />
                </div>
            )}

            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                currentLanguage={language}
                currentLevel={level}
                currentAvatar={avatar}
                currentApiKey={apiKey}
                onSave={handleSettingsSave}
            />
        </div>
    );
}
