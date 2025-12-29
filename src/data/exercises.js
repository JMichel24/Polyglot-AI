// Exercise data generator for lessons
// This file contains functions to generate sample exercises for each lesson

const EXERCISE_TEMPLATES = {
    // English A1 Exercises
    'eng-a1': {
        'alphabet': {
            flashcard: [
                { word: 'Apple', translation: 'Manzana' },
                { word: 'Book', translation: 'Libro' },
                { word: 'Cat', translation: 'Gato' },
                { word: 'Dog', translation: 'Perro' },
                { word: 'Elephant', translation: 'Elefante' }
            ],
            matching: [
                { word: 'Hello', translation: 'Hola' },
                { word: 'Goodbye', translation: 'Adiós' },
                { word: 'Please', translation: 'Por favor' },
                { word: 'Thank you', translation: 'Gracias' }
            ],
            fillblank: [
                { sentence: 'A is for ___', answer: 'Apple', hint: 'A red fruit' },
                { sentence: 'B is for ___', answer: 'Book', hint: 'You read this' },
                { sentence: 'C is for ___', answer: 'Cat', hint: 'A pet that meows' }
            ]
        },
        'greetings': {
            flashcard: [
                { word: 'Good morning', translation: 'Buenos días' },
                { word: 'Good afternoon', translation: 'Buenas tardes' },
                { word: 'Good evening', translation: 'Buenas noches' },
                { word: 'Hello', translation: 'Hola' },
                { word: 'Hi', translation: 'Hola' },
                { word: 'Goodbye', translation: 'Adiós' }
            ],
            listening: [
                { audio: 'Hello, how are you?', options: ['Greeting someone', 'Saying goodbye', 'Asking for food'], correctIndex: 0 },
                { audio: 'Good morning!', options: ['Evening greeting', 'Morning greeting', 'Afternoon greeting'], correctIndex: 1 },
                { audio: 'Goodbye, see you later!', options: ['Saying hello', 'Asking a question', 'Saying goodbye'], correctIndex: 2 }
            ],
            scramble: [
                { word: 'HELLO', hint: 'A greeting', audio: true },
                { word: 'GOODBYE', hint: 'When you leave', audio: true },
                { word: 'MORNING', hint: 'First part of the day', audio: true }
            ]
        },
        'numbers': {
            flashcard: [
                { word: 'One', translation: 'Uno' },
                { word: 'Two', translation: 'Dos' },
                { word: 'Three', translation: 'Tres' },
                { word: 'Four', translation: 'Cuatro' },
                { word: 'Five', translation: 'Cinco' },
                { word: 'Six', translation: 'Seis' },
                { word: 'Seven', translation: 'Siete' },
                { word: 'Eight', translation: 'Ocho' },
                { word: 'Nine', translation: 'Nueve' },
                { word: 'Ten', translation: 'Diez' }
            ],
            matching: [
                { word: '1', translation: 'One' },
                { word: '2', translation: 'Two' },
                { word: '3', translation: 'Three' },
                { word: '4', translation: 'Four' },
                { word: '5', translation: 'Five' },
                { word: '6', translation: 'Six' }
            ],
            fillblank: [
                { sentence: '___ + 1 = 2', answer: 'One', hint: 'The first number' },
                { sentence: '2 + 2 = ___', answer: 'Four', hint: 'After three' },
                { sentence: '___ - 3 = 7', answer: 'Ten', hint: 'The highest single digit + 1' }
            ]
        },
        'colors': {
            flashcard: [
                { word: 'Red', translation: 'Rojo' },
                { word: 'Blue', translation: 'Azul' },
                { word: 'Green', translation: 'Verde' },
                { word: 'Yellow', translation: 'Amarillo' },
                { word: 'Orange', translation: 'Naranja' },
                { word: 'Purple', translation: 'Morado' },
                { word: 'Pink', translation: 'Rosa' },
                { word: 'Black', translation: 'Negro' },
                { word: 'White', translation: 'Blanco' }
            ],
            matching: [
                { word: '🔴', translation: 'Red' },
                { word: '🔵', translation: 'Blue' },
                { word: '🟢', translation: 'Green' },
                { word: '🟡', translation: 'Yellow' },
                { word: '🟠', translation: 'Orange' },
                { word: '🟣', translation: 'Purple' }
            ],
            scramble: [
                { word: 'RED', hint: 'Color of fire', audio: true },
                { word: 'BLUE', hint: 'Color of the sky', audio: true },
                { word: 'GREEN', hint: 'Color of grass', audio: true },
                { word: 'YELLOW', hint: 'Color of the sun', audio: true }
            ]
        }
    },
    // Korean A1 Exercises
    'kor-a1': {
        'hangul-vowels': {
            flashcard: [
                { word: 'ㅏ', translation: 'a (ah)' },
                { word: 'ㅓ', translation: 'eo (uh)' },
                { word: 'ㅗ', translation: 'o (oh)' },
                { word: 'ㅜ', translation: 'u (oo)' },
                { word: 'ㅡ', translation: 'eu (uh)' },
                { word: 'ㅣ', translation: 'i (ee)' }
            ],
            matching: [
                { word: 'ㅏ', translation: 'a' },
                { word: 'ㅓ', translation: 'eo' },
                { word: 'ㅗ', translation: 'o' },
                { word: 'ㅜ', translation: 'u' },
                { word: 'ㅡ', translation: 'eu' },
                { word: 'ㅣ', translation: 'i' }
            ]
        },
        'greetings': {
            flashcard: [
                { word: '안녕하세요', translation: 'Hello (formal)' },
                { word: '안녕', translation: 'Hi (informal)' },
                { word: '감사합니다', translation: 'Thank you (formal)' },
                { word: '고마워요', translation: 'Thanks' },
                { word: '죄송합니다', translation: 'I\'m sorry (formal)' },
                { word: '네', translation: 'Yes' },
                { word: '아니요', translation: 'No' }
            ],
            listening: [
                { audio: '안녕하세요', options: ['Hello', 'Goodbye', 'Thank you'], correctIndex: 0 },
                { audio: '감사합니다', options: ['Sorry', 'Hello', 'Thank you'], correctIndex: 2 },
                { audio: '안녕히 가세요', options: ['Hello', 'Goodbye (to one leaving)', 'Thank you'], correctIndex: 1 }
            ]
        }
    },
    // Japanese A1 Exercises
    'jpn-a1': {
        'hiragana-vowels': {
            flashcard: [
                { word: 'あ', translation: 'a' },
                { word: 'い', translation: 'i' },
                { word: 'う', translation: 'u' },
                { word: 'え', translation: 'e' },
                { word: 'お', translation: 'o' }
            ],
            matching: [
                { word: 'あ', translation: 'a' },
                { word: 'い', translation: 'i' },
                { word: 'う', translation: 'u' },
                { word: 'え', translation: 'e' },
                { word: 'お', translation: 'o' }
            ],
            scramble: [
                { word: 'あい', hint: 'Love', audio: true },
                { word: 'いえ', hint: 'House', audio: true },
                { word: 'うえ', hint: 'Up/Above', audio: true }
            ]
        },
        'greetings': {
            flashcard: [
                { word: 'こんにちは', translation: 'Hello / Good afternoon' },
                { word: 'おはよう', translation: 'Good morning (casual)' },
                { word: 'おはようございます', translation: 'Good morning (polite)' },
                { word: 'こんばんは', translation: 'Good evening' },
                { word: 'さようなら', translation: 'Goodbye' },
                { word: 'ありがとう', translation: 'Thank you' }
            ],
            listening: [
                { audio: 'こんにちは', options: ['Good morning', 'Good afternoon', 'Good evening'], correctIndex: 1 },
                { audio: 'ありがとうございます', options: ['I\'m sorry', 'Thank you', 'Goodbye'], correctIndex: 1 },
                { audio: 'すみません', options: ['Hello', 'Excuse me / Sorry', 'Thank you'], correctIndex: 1 }
            ]
        }
    },
    // Spanish A1 Exercises  
    'spa-a1': {
        'greetings': {
            flashcard: [
                { word: 'Hola', translation: 'Hello' },
                { word: 'Buenos días', translation: 'Good morning' },
                { word: 'Buenas tardes', translation: 'Good afternoon' },
                { word: 'Buenas noches', translation: 'Good evening/night' },
                { word: 'Adiós', translation: 'Goodbye' },
                { word: 'Hasta luego', translation: 'See you later' }
            ],
            matching: [
                { word: 'Hola', translation: 'Hello' },
                { word: 'Adiós', translation: 'Goodbye' },
                { word: 'Gracias', translation: 'Thank you' },
                { word: 'Por favor', translation: 'Please' },
                { word: 'Perdón', translation: 'Sorry' },
                { word: 'Sí', translation: 'Yes' }
            ],
            scramble: [
                { word: 'HOLA', hint: 'A greeting', audio: true },
                { word: 'ADIOS', hint: 'Farewell', audio: true },
                { word: 'GRACIAS', hint: 'Expression of gratitude', audio: true }
            ]
        },
        'numbers': {
            flashcard: [
                { word: 'Uno', translation: 'One' },
                { word: 'Dos', translation: 'Two' },
                { word: 'Tres', translation: 'Three' },
                { word: 'Cuatro', translation: 'Four' },
                { word: 'Cinco', translation: 'Five' },
                { word: 'Seis', translation: 'Six' },
                { word: 'Siete', translation: 'Seven' },
                { word: 'Ocho', translation: 'Eight' },
                { word: 'Nueve', translation: 'Nine' },
                { word: 'Diez', translation: 'Ten' }
            ]
        }
    }
};

// Function to get exercises for a lesson based on its topic
function getExercisesForLesson(lessonId, topic) {
    // Extract language and level from lessonId (e.g., 'eng-a1-1' -> 'eng-a1')
    const parts = lessonId.split('-');
    const langLevel = `${parts[0]}-${parts[1]}`;

    // Try to find matching exercises
    const langExercises = EXERCISE_TEMPLATES[langLevel];
    if (!langExercises) return generateDefaultExercises(topic, lessonId);

    // Search by topic keywords
    const topicLower = topic.toLowerCase();
    for (const [key, exercises] of Object.entries(langExercises)) {
        if (topicLower.includes(key) || key.includes(topicLower.split(' ')[0])) {
            return buildExerciseArray(exercises);
        }
    }

    return generateDefaultExercises(topic, lessonId);
}

// Build exercise array from template
function buildExerciseArray(exercises) {
    const result = [];

    if (exercises.flashcard) {
        result.push({ type: 'flashcard', items: exercises.flashcard });
    }
    if (exercises.matching) {
        result.push({ type: 'matching', pairs: exercises.matching });
    }
    if (exercises.fillblank) {
        result.push({ type: 'fillblank', sentences: exercises.fillblank });
    }
    if (exercises.listening) {
        result.push({ type: 'listening', questions: exercises.listening });
    }
    if (exercises.scramble) {
        result.push({ type: 'scramble', words: exercises.scramble });
    }

    return result;
}

// Generate default exercises when no specific ones exist
// This function dynamically creates exercises based on the lesson topic
function generateDefaultExercises(topic, lessonId) {
    // Parse vocabulary from the topic string (e.g., "Hello, Hi, Good morning/afternoon/evening")
    const words = parseTopicVocabulary(topic);

    if (words.length === 0) {
        // Fallback if we can't parse the topic
        return [{
            type: 'flashcard',
            items: [
                { word: 'Practice', translation: 'Práctica' },
                { word: 'Learn', translation: 'Aprender' },
                { word: 'Study', translation: 'Estudiar' }
            ]
        }];
    }

    const exercises = [];

    // Flashcard exercise with all vocabulary
    exercises.push({
        type: 'flashcard',
        items: words.slice(0, 8).map(w => ({
            word: w,
            translation: getTranslation(w, lessonId)
        }))
    });

    // Matching exercise (if enough words)
    if (words.length >= 4) {
        exercises.push({
            type: 'matching',
            pairs: words.slice(0, 6).map(w => ({
                word: w,
                translation: getTranslation(w, lessonId)
            }))
        });
    }

    return exercises;
}

// Parse vocabulary from topic string
function parseTopicVocabulary(topic) {
    // Remove common prefixes and split by various delimiters
    const cleaned = topic
        .replace(/^(Learn|Practice|Study|Introduction to|Basic|Advanced)\s+/i, '')
        .replace(/\s+(basics?|introduction|practice)\s*$/i, '');

    // Split by comma, slash, or "and"
    const words = cleaned
        .split(/[,\/]|\s+and\s+/i)
        .map(w => w.trim())
        .filter(w => w.length > 0 && w.length < 50);

    return words;
}

// Get translation for a word (basic lookup)
const TRANSLATIONS = {
    // Greetings
    'Hello': 'Hola', 'Hi': 'Hola', 'Good morning': 'Buenos días',
    'Good afternoon': 'Buenas tardes', 'Good evening': 'Buenas noches',
    'Goodbye': 'Adiós', 'See you': 'Nos vemos', 'Take care': 'Cuídate',
    // Numbers
    'One': 'Uno', 'Two': 'Dos', 'Three': 'Tres', 'Four': 'Cuatro',
    'Five': 'Cinco', 'Six': 'Seis', 'Seven': 'Siete', 'Eight': 'Ocho',
    'Nine': 'Nueve', 'Ten': 'Diez',
    // Colors
    'Red': 'Rojo', 'Blue': 'Azul', 'Green': 'Verde', 'Yellow': 'Amarillo',
    'Orange': 'Naranja', 'Purple': 'Morado', 'Pink': 'Rosa',
    'Black': 'Negro', 'White': 'Blanco', 'Brown': 'Marrón',
    // Family
    'Mother': 'Madre', 'Father': 'Padre', 'Sister': 'Hermana', 'Brother': 'Hermano',
    'Grandfather': 'Abuelo', 'Grandmother': 'Abuela', 'Aunt': 'Tía', 'Uncle': 'Tío',
    // Food
    'Apple': 'Manzana', 'Banana': 'Plátano', 'Orange': 'Naranja', 'Grape': 'Uva',
    'Carrot': 'Zanahoria', 'Tomato': 'Tomate', 'Potato': 'Patata',
    'Water': 'Agua', 'Coffee': 'Café', 'Tea': 'Té', 'Juice': 'Jugo',
    'Milk': 'Leche', 'Bread': 'Pan', 'Cheese': 'Queso', 'Eggs': 'Huevos',
    // Days
    'Monday': 'Lunes', 'Tuesday': 'Martes', 'Wednesday': 'Miércoles',
    'Thursday': 'Jueves', 'Friday': 'Viernes', 'Saturday': 'Sábado', 'Sunday': 'Domingo',
    // Months
    'January': 'Enero', 'February': 'Febrero', 'March': 'Marzo',
    'April': 'Abril', 'May': 'Mayo', 'June': 'Junio',
    'July': 'Julio', 'August': 'Agosto', 'September': 'Septiembre',
    'October': 'Octubre', 'November': 'Noviembre', 'December': 'Diciembre',
    // Common verbs
    'I am': 'Yo soy', 'You are': 'Tú eres', 'He is': 'Él es', 'She is': 'Ella es',
    'We are': 'Nosotros somos', 'They are': 'Ellos son',
    // Weather
    'Sunny': 'Soleado', 'Rainy': 'Lluvioso', 'Cloudy': 'Nublado', 'Windy': 'Ventoso',
    // Transport
    'Bus': 'Autobús', 'Train': 'Tren', 'Car': 'Carro', 'Plane': 'Avión', 'Bike': 'Bicicleta',
    // Clothes
    'Shirt': 'Camisa', 'Pants': 'Pantalones', 'Shoes': 'Zapatos', 'Hat': 'Sombrero',
    'Jacket': 'Chaqueta', 'Dress': 'Vestido', 'Skirt': 'Falda'
};

function getTranslation(word, lessonId) {
    // First check direct lookup
    if (TRANSLATIONS[word]) return TRANSLATIONS[word];

    // Check case-insensitive
    const key = Object.keys(TRANSLATIONS).find(k => k.toLowerCase() === word.toLowerCase());
    if (key) return TRANSLATIONS[key];

    // Return the word itself if no translation (for non-English targets)
    return `${word} (translation)`;
}

export { EXERCISE_TEMPLATES, getExercisesForLesson };

