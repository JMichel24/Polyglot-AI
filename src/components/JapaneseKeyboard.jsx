import React, { useState } from 'react';
import { Delete, ArrowUp, RefreshCw } from 'lucide-react';

export default function JapaneseKeyboard({ onInput, onDelete }) {
    const [isKatakana, setIsKatakana] = useState(false);
    const [showDakuten, setShowDakuten] = useState(false);

    // Hiragana layout
    const hiraganaRows = [
        ['あ', 'い', 'う', 'え', 'お'],
        ['か', 'き', 'く', 'け', 'こ'],
        ['さ', 'し', 'す', 'せ', 'そ'],
        ['た', 'ち', 'つ', 'て', 'と'],
        ['な', 'に', 'ぬ', 'ね', 'の'],
        ['は', 'ひ', 'ふ', 'へ', 'ほ'],
        ['ま', 'み', 'む', 'め', 'も'],
        ['や', '　', 'ゆ', '　', 'よ'],
        ['ら', 'り', 'る', 'れ', 'ろ'],
        ['わ', 'を', 'ん', 'ー', ''],
    ];

    // Hiragana with dakuten (゛) and handakuten (゜)
    const hiraganaDakutenRows = [
        ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
        ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
        ['だ', 'ぢ', 'づ', 'で', 'ど'],
        ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
        ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
    ];

    // Katakana layout
    const katakanaRows = [
        ['ア', 'イ', 'ウ', 'エ', 'オ'],
        ['カ', 'キ', 'ク', 'ケ', 'コ'],
        ['サ', 'シ', 'ス', 'セ', 'ソ'],
        ['タ', 'チ', 'ツ', 'テ', 'ト'],
        ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
        ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
        ['マ', 'ミ', 'ム', 'メ', 'モ'],
        ['ヤ', '　', 'ユ', '　', 'ヨ'],
        ['ラ', 'リ', 'ル', 'レ', 'ロ'],
        ['ワ', 'ヲ', 'ン', 'ー', ''],
    ];

    // Katakana with dakuten
    const katakanaDakutenRows = [
        ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ'],
        ['ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'],
        ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'],
        ['バ', 'ビ', 'ブ', 'ベ', 'ボ'],
        ['パ', 'ピ', 'プ', 'ペ', 'ポ'],
    ];

    // Small kana
    const smallKana = isKatakana
        ? ['ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ャ', 'ュ', 'ョ', 'ッ']
        : ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゃ', 'ゅ', 'ょ', 'っ'];

    const currentRows = showDakuten
        ? (isKatakana ? katakanaDakutenRows : hiraganaDakutenRows)
        : (isKatakana ? katakanaRows : hiraganaRows);

    const handleKeyPress = (char) => {
        if (char && char.trim()) {
            onInput(char);
        }
    };

    return (
        <div className="bg-slate-800 p-2 pb-4 rounded-t-2xl shadow-2xl border-t border-slate-700">
            {/* Mode Toggle */}
            <div className="flex justify-center gap-2 mb-2">
                <button
                    onClick={() => setIsKatakana(!isKatakana)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${!isKatakana
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                >
                    あ Hiragana
                </button>
                <button
                    onClick={() => setIsKatakana(!isKatakana)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${isKatakana
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                >
                    ア Katakana
                </button>
                <button
                    onClick={() => setShowDakuten(!showDakuten)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${showDakuten
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                >
                    ゛゜ Dakuten
                </button>
            </div>

            {/* Main Keyboard Grid */}
            <div className="grid grid-cols-5 gap-1 mb-2">
                {currentRows.flat().map((char, index) => (
                    <button
                        key={index}
                        onClick={() => handleKeyPress(char)}
                        disabled={!char || char === '　'}
                        className={`h-10 rounded-lg font-bold text-lg shadow-md transition-colors ${char && char !== '　'
                                ? 'bg-slate-700 hover:bg-slate-600 text-white active:bg-slate-500'
                                : 'bg-slate-800 cursor-default'
                            }`}
                    >
                        {char !== '　' ? char : ''}
                    </button>
                ))}
            </div>

            {/* Small Kana Row */}
            <div className="flex justify-center gap-1 mb-2">
                {smallKana.map((char, index) => (
                    <button
                        key={index}
                        onClick={() => handleKeyPress(char)}
                        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-sm shadow-md active:bg-slate-500 transition-colors"
                    >
                        {char}
                    </button>
                ))}
            </div>

            {/* Bottom Row: Space, Backspace */}
            <div className="flex justify-center gap-2 mt-1 px-2">
                <button
                    onClick={() => onInput('、')}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-sm shadow-md active:bg-slate-500"
                >
                    、
                </button>
                <button
                    onClick={() => onInput('。')}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-sm shadow-md active:bg-slate-500"
                >
                    。
                </button>

                <button
                    onClick={() => onInput(' ')}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold shadow-md active:bg-slate-500 py-2"
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
    );
}
