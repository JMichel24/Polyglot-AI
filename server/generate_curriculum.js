// Curriculum Generator Script
// Run with: node generate_curriculum.js

const fs = require('fs');

// Helper to generate lessons for a module
function generateLessons(langCode, level, modules) {
    const lessons = [];
    let lessonNum = 1;

    modules.forEach(mod => {
        for (let i = 1; i <= mod.count; i++) {
            lessons.push({
                module: mod.module,
                id: `${langCode}-${level.toLowerCase()}-${lessonNum}`,
                title: `${mod.unitPrefix} ${lessonNum}: ${mod.topics[i - 1] || mod.topics[0]}`,
                topic: mod.topics[i - 1] || mod.topicBase
            });
            lessonNum++;
        }
    });

    // Add exam
    lessons.push({
        module: 'Assessment',
        id: `${langCode}-${level.toLowerCase()}-exam`,
        type: 'exam',
        title: `${level} Final Exam`,
        topic: `${level} Proficiency Assessment`,
        requiredScore: 80
    });

    return lessons;
}

// Define expanded curriculum structure per language
const CURRICULUM = {
    // ENGLISH - 200+ classes
    'English': {
        'A1': [], 'A2': [], 'B1': [], 'B2': [], 'C1': [], 'C2': []
    },
    'Korean': {
        'A1': [], 'A2': [], 'B1': [], 'B2': [], 'C1': [], 'C2': []
    },
    'Japanese': {
        'A1': [], 'A2': [], 'B1': [], 'B2': [], 'C1': [], 'C2': []
    },
    'Spanish': {
        'A1': [], 'A2': [], 'B1': [], 'B2': [], 'C1': [], 'C2': []
    },
    'Italian': {
        'A1': [], 'A2': [], 'B1': [], 'B2': [], 'C1': [], 'C2': []
    },
    'French': {
        'A1': [], 'A2': [], 'B1': [], 'B2': [], 'C1': [], 'C2': []
    },
    'German': {
        'A1': [], 'A2': [], 'B1': [], 'B2': [], 'C1': [], 'C2': []
    }
};

// English A1 - 60 lessons
const englishA1 = [
    { module: 'Module 1: Foundations', id: 'eng-a1-1', title: 'Unit 1: The Alphabet', topic: 'English alphabet, Phonics basics' },
    { module: 'Module 1: Foundations', id: 'eng-a1-2', title: 'Unit 2: Vowel Sounds', topic: 'A, E, I, O, U pronunciation' },
    { module: 'Module 1: Foundations', id: 'eng-a1-3', title: 'Unit 3: Consonant Sounds', topic: 'B, C, D, F, G... pronunciation' },
    { module: 'Module 1: Foundations', id: 'eng-a1-4', title: 'Unit 4: Greetings', topic: 'Hello, Hi, Good morning/afternoon/evening' },
    { module: 'Module 1: Foundations', id: 'eng-a1-5', title: 'Unit 5: Farewells', topic: 'Goodbye, See you, Take care' },
    { module: 'Module 1: Foundations', id: 'eng-a1-6', title: 'Unit 6: Introductions', topic: 'My name is..., Nice to meet you' },
    { module: 'Module 1: Foundations', id: 'eng-a1-7', title: 'Unit 7: Verb To Be (I/You)', topic: 'I am, You are' },
    { module: 'Module 1: Foundations', id: 'eng-a1-8', title: 'Unit 8: Verb To Be (He/She/It)', topic: 'He is, She is, It is' },
    { module: 'Module 1: Foundations', id: 'eng-a1-9', title: 'Unit 9: Verb To Be (We/They)', topic: 'We are, They are' },
    { module: 'Module 1: Foundations', id: 'eng-a1-10', title: 'Unit 10: Subject Pronouns', topic: 'I, You, He, She, It, We, They' },
    { module: 'Module 1: Foundations', id: 'eng-a1-11', title: 'Unit 11: Articles', topic: 'A, An, The' },
    { module: 'Module 1: Foundations', id: 'eng-a1-12', title: 'Unit 12: This/That/These/Those', topic: 'Demonstrative pronouns' },
    { module: 'Module 2: Numbers & Colors', id: 'eng-a1-13', title: 'Unit 13: Numbers 1-10', topic: 'One through ten' },
    { module: 'Module 2: Numbers & Colors', id: 'eng-a1-14', title: 'Unit 14: Numbers 11-20', topic: 'Eleven through twenty' },
    { module: 'Module 2: Numbers & Colors', id: 'eng-a1-15', title: 'Unit 15: Numbers 21-100', topic: 'Twenty-one through one hundred' },
    { module: 'Module 2: Numbers & Colors', id: 'eng-a1-16', title: 'Unit 16: Large Numbers', topic: 'Hundreds, thousands, millions' },
    { module: 'Module 2: Numbers & Colors', id: 'eng-a1-17', title: 'Unit 17: Ordinal Numbers', topic: 'First, Second, Third...' },
    { module: 'Module 2: Numbers & Colors', id: 'eng-a1-18', title: 'Unit 18: Basic Colors', topic: 'Red, Blue, Green, Yellow' },
    { module: 'Module 2: Numbers & Colors', id: 'eng-a1-19', title: 'Unit 19: More Colors', topic: 'Orange, Purple, Pink, Brown' },
    { module: 'Module 2: Numbers & Colors', id: 'eng-a1-20', title: 'Unit 20: Describing Objects', topic: 'It is + color, It is + size' },
    { module: 'Module 3: Family & People', id: 'eng-a1-21', title: 'Unit 21: Immediate Family', topic: 'Mother, Father, Sister, Brother' },
    { module: 'Module 3: Family & People', id: 'eng-a1-22', title: 'Unit 22: Extended Family', topic: 'Grandfather, Grandmother, Aunt, Uncle' },
    { module: 'Module 3: Family & People', id: 'eng-a1-23', title: 'Unit 23: Family Relations', topic: 'Cousin, Nephew, Niece' },
    { module: 'Module 3: Family & People', id: 'eng-a1-24', title: 'Unit 24: Possessive Adjectives', topic: 'My, Your, His, Her, Our, Their' },
    { module: 'Module 3: Family & People', id: 'eng-a1-25', title: 'Unit 25: Possessive Pronouns', topic: 'Mine, Yours, His, Hers, Ours, Theirs' },
    { module: 'Module 3: Family & People', id: 'eng-a1-26', title: 'Unit 26: Describing People (Appearance)', topic: 'Tall, Short, Young, Old' },
    { module: 'Module 3: Family & People', id: 'eng-a1-27', title: 'Unit 27: Describing People (Character)', topic: 'Nice, Kind, Funny, Smart' },
    { module: 'Module 3: Family & People', id: 'eng-a1-28', title: 'Unit 28: Physical Features', topic: 'Hair, Eyes, Face' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-29', title: 'Unit 29: Daily Routines Morning', topic: 'Wake up, Get up, Take a shower' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-30', title: 'Unit 30: Daily Routines Day', topic: 'Go to work/school, Have lunch' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-31', title: 'Unit 31: Daily Routines Evening', topic: 'Come home, Have dinner, Go to bed' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-32', title: 'Unit 32: Present Simple (I/You/We/They)', topic: 'I work, You study, We play' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-33', title: 'Unit 33: Present Simple (He/She/It)', topic: 'She works, He studies' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-34', title: 'Unit 34: Present Simple Negative', topic: 'I do not work, She does not study' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-35', title: 'Unit 35: Present Simple Questions', topic: 'Do you work? Does she study?' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-36', title: 'Unit 36: Telling Time (Hours)', topic: 'It is one oclock, two oclock' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-37', title: 'Unit 37: Telling Time (Minutes)', topic: 'Half past, Quarter past/to' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-38', title: 'Unit 38: Days of the Week', topic: 'Monday through Sunday' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-39', title: 'Unit 39: Months of the Year', topic: 'January through December' },
    { module: 'Module 4: Daily Life', id: 'eng-a1-40', title: 'Unit 40: Seasons', topic: 'Spring, Summer, Autumn, Winter' },
    { module: 'Module 5: Food & Drink', id: 'eng-a1-41', title: 'Unit 41: Fruits', topic: 'Apple, Orange, Banana, Grape' },
    { module: 'Module 5: Food & Drink', id: 'eng-a1-42', title: 'Unit 42: Vegetables', topic: 'Carrot, Tomato, Potato, Onion' },
    { module: 'Module 5: Food & Drink', id: 'eng-a1-43', title: 'Unit 43: Meat & Fish', topic: 'Chicken, Beef, Pork, Fish' },
    { module: 'Module 5: Food & Drink', id: 'eng-a1-44', title: 'Unit 44: Dairy & Bread', topic: 'Milk, Cheese, Bread, Eggs' },
    { module: 'Module 5: Food & Drink', id: 'eng-a1-45', title: 'Unit 45: Hot Drinks', topic: 'Coffee, Tea, Hot chocolate' },
    { module: 'Module 5: Food & Drink', id: 'eng-a1-46', title: 'Unit 46: Cold Drinks', topic: 'Water, Juice, Soda' },
    { module: 'Module 5: Food & Drink', id: 'eng-a1-47', title: 'Unit 47: Likes & Dislikes', topic: 'I like..., I do not like...' },
    { module: 'Module 5: Food & Drink', id: 'eng-a1-48', title: 'Unit 48: At a Restaurant', topic: 'Can I have...?, The bill please' },
    { module: 'Module 5: Food & Drink', id: 'eng-a1-49', title: 'Unit 49: Ordering Food', topic: 'I would like..., For me...' },
    { module: 'Module 5: Food & Drink', id: 'eng-a1-50', title: 'Unit 50: Meals', topic: 'Breakfast, Lunch, Dinner' },
    { module: 'Module 6: Places & Weather', id: 'eng-a1-51', title: 'Unit 51: Places in Town', topic: 'Bank, Hospital, School, Park' },
    { module: 'Module 6: Places & Weather', id: 'eng-a1-52', title: 'Unit 52: Shops', topic: 'Supermarket, Bakery, Pharmacy' },
    { module: 'Module 6: Places & Weather', id: 'eng-a1-53', title: 'Unit 53: There is/There are', topic: 'Describing locations' },
    { module: 'Module 6: Places & Weather', id: 'eng-a1-54', title: 'Unit 54: Weather Vocabulary', topic: 'Sunny, Rainy, Cloudy, Windy' },
    { module: 'Module 6: Places & Weather', id: 'eng-a1-55', title: 'Unit 55: Weather Expressions', topic: 'It is hot, It is cold, It is raining' },
    { module: 'Module 6: Places & Weather', id: 'eng-a1-56', title: 'Unit 56: Prepositions of Place', topic: 'In, On, At, Next to, Behind' },
    { module: 'Module 6: Places & Weather', id: 'eng-a1-57', title: 'Unit 57: Giving Directions', topic: 'Go straight, Turn left/right' },
    { module: 'Module 7: Transport & Clothes', id: 'eng-a1-58', title: 'Unit 58: Transport Types', topic: 'Bus, Train, Car, Plane, Bike' },
    { module: 'Module 7: Transport & Clothes', id: 'eng-a1-59', title: 'Unit 59: Using Transport', topic: 'Take the bus, Drive a car' },
    { module: 'Module 7: Transport & Clothes', id: 'eng-a1-60', title: 'Unit 60: Clothes Upper Body', topic: 'Shirt, T-shirt, Jacket, Sweater' },
    { module: 'Module 7: Transport & Clothes', id: 'eng-a1-61', title: 'Unit 61: Clothes Lower Body', topic: 'Pants, Jeans, Skirt, Shorts' },
    { module: 'Module 7: Transport & Clothes', id: 'eng-a1-62', title: 'Unit 62: Footwear & Accessories', topic: 'Shoes, Boots, Hat, Bag' },
    { module: 'Module 7: Transport & Clothes', id: 'eng-a1-63', title: 'Unit 63: Present Continuous Form', topic: 'I am eating, She is working' },
    { module: 'Module 7: Transport & Clothes', id: 'eng-a1-64', title: 'Unit 64: Present Continuous Use', topic: 'Actions happening now' },
    { module: 'Module 7: Transport & Clothes', id: 'eng-a1-65', title: 'Unit 65: Present Simple vs Continuous', topic: 'Habits vs current actions' },
    { module: 'Assessment', id: 'eng-a1-exam', type: 'exam', title: 'A1 Final Exam', topic: 'Beginner Proficiency Assessment', requiredScore: 80 }
];

CURRICULUM['English']['A1'] = englishA1;

// Count and output
let total = 0;
Object.keys(CURRICULUM).forEach(lang => {
    let langTotal = 0;
    Object.keys(CURRICULUM[lang]).forEach(level => {
        langTotal += CURRICULUM[lang][level].length;
    });
    console.log(`${lang}: ${langTotal} classes`);
    total += langTotal;
});
console.log(`\nTotal: ${total} classes`);

// For now, let's output just the structure
console.log('\nCurriculum structure created. English A1 has', CURRICULUM['English']['A1'].length, 'lessons');
