import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 500); // Wait for fade out animation
        }, 3000); // Show for 3 seconds

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <img src="/polyglot_splash.png" alt="Polyglot AI Logo" className="w-48 h-48 object-contain drop-shadow-xl" />

            <div className="pb-12 flex flex-col items-center animate-fade-in-up">
                <p className="text-slate-600 text-sm mb-2 font-medium tracking-wide">Powered by</p>
                <img src="/devnity_logo.png" alt="DEVNITY" className="h-8 object-contain opacity-90" />
            </div>
        </div>
    );
};

export default SplashScreen;
