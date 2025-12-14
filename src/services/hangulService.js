/**
 * Hangul Composition Service
 * Combines individual jamo (Korean letters) into complete syllable blocks.
 * 
 * Korean syllables follow the structure: (Initial consonant) + Vowel + (Final consonant)
 * Example: ㄱ + ㅏ + ㄴ = 간
 */

// Unicode values for Hangul composition
const HANGUL_BASE = 0xAC00; // '가'
const CHOSEONG_BASE = 0x1100; // Initial consonants
const JUNGSEONG_BASE = 0x1161; // Vowels (medial)
const JONGSEONG_BASE = 0x11A7; // Final consonants
const CHOSEONG_COUNT = 19;
const JUNGSEONG_COUNT = 21;
const JONGSEONG_COUNT = 28;

// Initial consonants (초성) - 19 total
const CHOSEONG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// Vowels (중성) - 21 total
const JUNGSEONG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];

// Final consonants (종성) - 28 total (including none)
const JONGSEONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// Double final consonants mapping (what to split into)
const DOUBLE_JONGSEONG = {
    'ㄳ': ['ㄱ', 'ㅅ'],
    'ㄵ': ['ㄴ', 'ㅈ'],
    'ㄶ': ['ㄴ', 'ㅎ'],
    'ㄺ': ['ㄹ', 'ㄱ'],
    'ㄻ': ['ㄹ', 'ㅁ'],
    'ㄼ': ['ㄹ', 'ㅂ'],
    'ㄽ': ['ㄹ', 'ㅅ'],
    'ㄾ': ['ㄹ', 'ㅌ'],
    'ㄿ': ['ㄹ', 'ㅍ'],
    'ㅀ': ['ㄹ', 'ㅎ'],
    'ㅄ': ['ㅂ', 'ㅅ'],
};

// Combinable vowels (for complex vowels like ㅘ = ㅗ + ㅏ)
const COMBINABLE_VOWELS = {
    'ㅗㅏ': 'ㅘ',
    'ㅗㅐ': 'ㅙ',
    'ㅗㅣ': 'ㅚ',
    'ㅜㅓ': 'ㅝ',
    'ㅜㅔ': 'ㅞ',
    'ㅜㅣ': 'ㅟ',
    'ㅡㅣ': 'ㅢ',
};

// Combinable final consonants
const COMBINABLE_JONGSEONG = {
    'ㄱㅅ': 'ㄳ',
    'ㄴㅈ': 'ㄵ',
    'ㄴㅎ': 'ㄶ',
    'ㄹㄱ': 'ㄺ',
    'ㄹㅁ': 'ㄻ',
    'ㄹㅂ': 'ㄼ',
    'ㄹㅅ': 'ㄽ',
    'ㄹㅌ': 'ㄾ',
    'ㄹㅍ': 'ㄿ',
    'ㄹㅎ': 'ㅀ',
    'ㅂㅅ': 'ㅄ',
};

// Check if character is a consonant (자음)
const isConsonant = (char) => CHOSEONG.includes(char) || JONGSEONG.includes(char);

// Check if character is a vowel (모음)
const isVowel = (char) => JUNGSEONG.includes(char);

// Check if character is a complete Hangul syllable
const isCompleteSyllable = (char) => {
    const code = char.charCodeAt(0);
    return code >= HANGUL_BASE && code < HANGUL_BASE + 11172;
};

// Decompose a complete syllable into its components
const decomposeSyllable = (syllable) => {
    if (!isCompleteSyllable(syllable)) return null;

    const code = syllable.charCodeAt(0) - HANGUL_BASE;
    const choseongIndex = Math.floor(code / (JUNGSEONG_COUNT * JONGSEONG_COUNT));
    const jungseongIndex = Math.floor((code % (JUNGSEONG_COUNT * JONGSEONG_COUNT)) / JONGSEONG_COUNT);
    const jongseongIndex = code % JONGSEONG_COUNT;

    return {
        choseong: CHOSEONG[choseongIndex],
        jungseong: JUNGSEONG[jungseongIndex],
        jongseong: JONGSEONG[jongseongIndex] || null,
        choseongIndex,
        jungseongIndex,
        jongseongIndex
    };
};

// Compose jamo into a syllable
const composeSyllable = (choseong, jungseong, jongseong = null) => {
    const choseongIndex = CHOSEONG.indexOf(choseong);
    const jungseongIndex = JUNGSEONG.indexOf(jungseong);
    const jongseongIndex = jongseong ? JONGSEONG.indexOf(jongseong) : 0;

    if (choseongIndex === -1 || jungseongIndex === -1) return null;

    const code = HANGUL_BASE + (choseongIndex * JUNGSEONG_COUNT * JONGSEONG_COUNT) + (jungseongIndex * JONGSEONG_COUNT) + jongseongIndex;
    return String.fromCharCode(code);
};

/**
 * Main composition function - adds a jamo to the current text
 * Returns the new text with the jamo composed
 */
export const composeHangul = (currentText, newJamo) => {
    // Handle space and non-Korean characters
    if (newJamo === ' ' || (!isConsonant(newJamo) && !isVowel(newJamo))) {
        return currentText + newJamo;
    }

    // If text is empty, just return the jamo
    if (!currentText) {
        return newJamo;
    }

    const lastChar = currentText.slice(-1);
    const restText = currentText.slice(0, -1);

    // Case 1: Last character is a lone consonant and new input is a vowel
    if (CHOSEONG.includes(lastChar) && isVowel(newJamo)) {
        // Compose into a syllable
        const syllable = composeSyllable(lastChar, newJamo);
        return syllable ? restText + syllable : currentText + newJamo;
    }

    // Case 2: Last character is a complete syllable
    if (isCompleteSyllable(lastChar)) {
        const decomposed = decomposeSyllable(lastChar);

        // Case 2a: Adding a vowel
        if (isVowel(newJamo)) {
            // If syllable has a final consonant, move it to be the initial of a new syllable
            if (decomposed.jongseong) {
                // Check if final consonant is a double consonant
                if (DOUBLE_JONGSEONG[decomposed.jongseong]) {
                    const [first, second] = DOUBLE_JONGSEONG[decomposed.jongseong];
                    // Keep first consonant as final, use second as initial of new syllable
                    const newPrevSyllable = composeSyllable(decomposed.choseong, decomposed.jungseong, first);
                    const newSyllable = composeSyllable(second, newJamo);
                    return restText + newPrevSyllable + newSyllable;
                } else {
                    // Move single final consonant to be initial of new syllable
                    const newPrevSyllable = composeSyllable(decomposed.choseong, decomposed.jungseong);
                    const newSyllable = composeSyllable(decomposed.jongseong, newJamo);
                    return restText + newPrevSyllable + newSyllable;
                }
            } else {
                // No final consonant - check if we can combine vowels
                const combinedVowel = COMBINABLE_VOWELS[decomposed.jungseong + newJamo];
                if (combinedVowel) {
                    const newSyllable = composeSyllable(decomposed.choseong, combinedVowel);
                    return restText + newSyllable;
                }
                // Can't combine, just append
                return currentText + newJamo;
            }
        }

        // Case 2b: Adding a consonant
        if (isConsonant(newJamo)) {
            if (decomposed.jongseong) {
                // Already has a final consonant - check if can combine
                const combinedJongseong = COMBINABLE_JONGSEONG[decomposed.jongseong + newJamo];
                if (combinedJongseong) {
                    const newSyllable = composeSyllable(decomposed.choseong, decomposed.jungseong, combinedJongseong);
                    return restText + newSyllable;
                }
                // Can't combine, start new character
                return currentText + newJamo;
            } else {
                // No final consonant yet - add it
                // Check if this consonant can be a final consonant
                if (JONGSEONG.includes(newJamo)) {
                    const newSyllable = composeSyllable(decomposed.choseong, decomposed.jungseong, newJamo);
                    return restText + newSyllable;
                }
                return currentText + newJamo;
            }
        }
    }

    // Case 3: Last character is a vowel (standalone)
    if (isVowel(lastChar)) {
        // Check if vowels can combine
        const combinedVowel = COMBINABLE_VOWELS[lastChar + newJamo];
        if (combinedVowel && isVowel(newJamo)) {
            return restText + combinedVowel;
        }
        return currentText + newJamo;
    }

    // Default: just append
    return currentText + newJamo;
};

/**
 * Delete the last jamo from the text
 * Handles decomposing syllables to remove just the last component
 */
export const deleteHangul = (currentText) => {
    if (!currentText) return '';

    const lastChar = currentText.slice(-1);
    const restText = currentText.slice(0, -1);

    // If last char is a complete syllable, decompose and remove last component
    if (isCompleteSyllable(lastChar)) {
        const decomposed = decomposeSyllable(lastChar);

        if (decomposed.jongseong) {
            // Has final consonant - check if it's a double consonant
            if (DOUBLE_JONGSEONG[decomposed.jongseong]) {
                const [first] = DOUBLE_JONGSEONG[decomposed.jongseong];
                const newSyllable = composeSyllable(decomposed.choseong, decomposed.jungseong, first);
                return restText + newSyllable;
            }
            // Remove single final consonant
            const newSyllable = composeSyllable(decomposed.choseong, decomposed.jungseong);
            return restText + newSyllable;
        }

        // Check if vowel is a complex vowel that can be split
        for (const [combo, result] of Object.entries(COMBINABLE_VOWELS)) {
            if (result === decomposed.jungseong) {
                // Split the vowel, keep the first part
                const firstVowel = combo[0];
                const newSyllable = composeSyllable(decomposed.choseong, firstVowel);
                return restText + newSyllable;
            }
        }

        // Just initial + vowel - remove vowel, leave initial consonant
        return restText + decomposed.choseong;
    }

    // Not a complete syllable, just remove the character
    return restText;
};
