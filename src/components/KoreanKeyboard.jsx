import React, { useState } from 'react';

import { Delete, ArrowUp } from 'lucide-react';

export default function KoreanKeyboard({ onInput, onDelete }) {
    const [isShift, setIsShift] = useState(false);

    const rows = [
        [
            { normal: 'ㅂ', shift: 'ㅃ' },
            { normal: 'ㅈ', shift: 'ㅉ' },
            { normal: 'ㄷ', shift: 'ㄸ' },
            { normal: 'ㄱ', shift: 'ㄲ' },
            { normal: 'ㅅ', shift: 'ㅆ' },
            { normal: 'ㅛ', shift: 'ㅛ' },
            { normal: 'ㅕ', shift: 'ㅕ' },
            { normal: 'ㅑ', shift: 'ㅑ' },
            { normal: 'ㅐ', shift: 'ㅒ' },
            { normal: 'ㅔ', shift: 'ㅖ' },
        ],
        [
            { normal: 'ㅁ', shift: 'ㅁ' },
            { normal: 'ㄴ', shift: 'ㄴ' },
            { normal: 'ㅇ', shift: 'ㅇ' },
            { normal: 'ㄹ', shift: 'ㄹ' },
            { normal: 'ㅎ', shift: 'ㅎ' },
            { normal: 'ㅗ', shift: 'ㅗ' },
            { normal: 'ㅓ', shift: 'ㅓ' },
            { normal: 'ㅏ', shift: 'ㅏ' },
            { normal: 'ㅣ', shift: 'ㅣ' },
        ],
        [
            { normal: 'ㅋ', shift: 'ㅋ' },
            { normal: 'ㅌ', shift: 'ㅌ' },
            { normal: 'ㅊ', shift: 'ㅊ' },
            { normal: 'ㅍ', shift: 'ㅍ' },
            { normal: 'ㅠ', shift: 'ㅠ' },
            { normal: 'ㅜ', shift: 'ㅜ' },
            { normal: 'ㅡ', shift: 'ㅡ' },
        ]
    ];

    const handleKeyPress = (char) => {
        onInput(char);
        // Reset shift after press? Usually no for mobile, but maybe yes for single char?
        // Let's keep shift active until pressed again or maybe auto-off?
        // Standard mobile behavior: Shift stays for one char.
        if (isShift) setIsShift(false);
    };

    return (
        <div className="bg-slate-800 p-2 pb-6 rounded-t-2xl shadow-2xl border-t border-slate-700">
            <div className="flex flex-col gap-2">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1">
                        {row.map((key, keyIndex) => (
                            <button
                                key={keyIndex}
                                onClick={() => handleKeyPress(isShift ? key.shift : key.normal)}
                                className="w-8 h-10 sm:w-10 sm:h-12 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-lg shadow-md active:bg-slate-500 transition-colors"
                            >
                                {isShift ? key.shift : key.normal}
                            </button>
                        ))}
                    </div>
                ))}

                {/* Bottom Row: Shift, Space, Backspace */}
                <div className="flex justify-center gap-2 mt-1 px-2">
                    <button
                        onClick={() => setIsShift(!isShift)}
                        className={`p-2 rounded-lg transition-colors ${isShift ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                        <ArrowUp size={20} />
                    </button>

                    <button
                        onClick={() => onInput(' ')}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold shadow-md active:bg-slate-500"
                    >
                        Space
                    </button>

                    <button
                        onClick={onDelete}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg shadow-md active:bg-slate-500"
                    >
                        <Delete size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
