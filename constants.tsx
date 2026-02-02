
import { FoodItem, WeightRecord } from './types';

export const MOCK_FOODS: FoodItem[] = [
  // --- MEAT & PROTEIN ---
  {
    id: 'm1',
    name: 'Chicken Breast (100g)',
    calories: 165, carbs: 0, protein: 31, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, cholesterol: 85,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop',
    group: 'Meat', category: 'Lunch'
  },
  {
    id: 'm2',
    name: 'Ground Beef 90% (100g)',
    calories: 176, carbs: 0, protein: 20, fat: 10, fiber: 0, sugar: 0, sodium: 66, cholesterol: 71,
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=400&fit=crop',
    group: 'Meat', category: 'Dinner'
  },
  {
    id: 'm3',
    name: 'Salmon Fillet (100g)',
    calories: 208, carbs: 0, protein: 20, fat: 13, fiber: 0, sugar: 0, sodium: 59, cholesterol: 55,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
    group: 'Meat', category: 'Dinner'
  },
  {
    id: 'm4',
    name: 'Turkey Breast (100g)',
    calories: 135, carbs: 0, protein: 30, fat: 1, fiber: 0, sugar: 0, sodium: 50, cholesterol: 70,
    image: 'https://images.unsplash.com/photo-1518492104633-ac30d33122f2?w=400&h=400&fit=crop',
    group: 'Meat', category: 'Lunch'
  },
  {
    id: 'm5',
    name: 'Egg (Large)',
    calories: 78, carbs: 0.6, protein: 6, fat: 5, fiber: 0, sugar: 0.6, sodium: 62, cholesterol: 186,
    image: 'https://images.unsplash.com/photo-1582722653846-d2932973719b?w=400&h=400&fit=crop',
    group: 'Meat', category: 'Breakfast'
  },
  {
    id: 'm6',
    name: 'Sirloin Steak (100g)',
    calories: 244, carbs: 0, protein: 27, fat: 15, fiber: 0, sugar: 0, sodium: 58, cholesterol: 80,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop',
    group: 'Meat', category: 'Dinner'
  },
  {
    id: 'm7',
    name: 'Shrimp (100g)',
    calories: 99, carbs: 0.2, protein: 24, fat: 0.3, fiber: 0, sugar: 0, sodium: 111, cholesterol: 189,
    image: 'https://images.unsplash.com/photo-1551248429-42405d28f005?w=400&h=400&fit=crop',
    group: 'Meat', category: 'Dinner'
  },
  {
    id: 'm8',
    name: 'Tofu Firm (100g)',
    calories: 144, carbs: 3, protein: 15, fat: 8, fiber: 2, sugar: 1, sodium: 12, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    group: 'Meat', category: 'Lunch'
  },

  // --- VEGETABLES ---
  {
    id: 'v1',
    name: 'Broccoli (100g)',
    calories: 34, carbs: 7, protein: 2.8, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=400&fit=crop',
    group: 'Vegetables', category: 'Lunch'
  },
  {
    id: 'v2',
    name: 'Carrots (100g)',
    calories: 41, carbs: 10, protein: 0.9, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop',
    group: 'Vegetables', category: 'Lunch'
  },
  {
    id: 'v3',
    name: 'Spinach (100g)',
    calories: 23, carbs: 3.6, protein: 2.9, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop',
    group: 'Vegetables', category: 'Dinner'
  },
  {
    id: 'v4',
    name: 'Asparagus (100g)',
    calories: 20, carbs: 3.9, protein: 2.2, fat: 0.1, fiber: 2.1, sugar: 1.9, sodium: 2, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1515471209610-dae1c92d8777?w=400&h=400&fit=crop',
    group: 'Vegetables', category: 'Dinner'
  },
  {
    id: 'v5',
    name: 'Mushrooms (100g)',
    calories: 22, carbs: 3.3, protein: 3.1, fat: 0.3, fiber: 1, sugar: 2, sodium: 5, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1504670073073-6123e39e0754?w=400&h=400&fit=crop',
    group: 'Vegetables', category: 'Lunch'
  },

  // --- CARBS ---
  {
    id: 'c1',
    name: 'White Rice (100g cooked)',
    calories: 130, carbs: 28, protein: 2.7, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=400&fit=crop',
    group: 'Carbs', category: 'Lunch'
  },
  {
    id: 'c2',
    name: 'Sweet Potato (100g)',
    calories: 86, carbs: 20, protein: 1.6, fat: 0.1, fiber: 3, sugar: 4.2, sodium: 55, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400&h=400&fit=crop',
    group: 'Carbs', category: 'Dinner'
  },
  {
    id: 'c3',
    name: 'Quinoa (100g cooked)',
    calories: 120, carbs: 21, protein: 4.4, fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop',
    group: 'Carbs', category: 'Lunch'
  },
  {
    id: 'c4',
    name: 'Whole Wheat Pasta (100g)',
    calories: 124, carbs: 27, protein: 5.3, fat: 0.5, fiber: 4.5, sugar: 0.5, sodium: 1, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1551462147-37885acc3c44?w=400&h=400&fit=crop',
    group: 'Carbs', category: 'Dinner'
  },
  {
    id: 'c5',
    name: 'Oatmeal (1 cup)',
    calories: 150, carbs: 27, protein: 5, fat: 3, fiber: 4, sugar: 1, sodium: 2, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=400&fit=crop',
    group: 'Carbs', category: 'Breakfast'
  },

  // --- FRUITS ---
  {
    id: 'f1',
    name: 'Banana (Medium)',
    calories: 105, carbs: 27, protein: 1.3, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1571771894821-ad9961d35d4e?w=400&h=400&fit=crop',
    group: 'Fruits', category: 'Snack'
  },
  {
    id: 'f2',
    name: 'Blueberries (100g)',
    calories: 57, carbs: 14, protein: 0.7, fat: 0.3, fiber: 2.4, sugar: 10, sodium: 1, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop',
    group: 'Fruits', category: 'Breakfast'
  },
  {
    id: 'f3',
    name: 'Strawberries (100g)',
    calories: 32, carbs: 7.7, protein: 0.7, fat: 0.3, fiber: 2, sugar: 4.9, sodium: 1, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1543528176-61b2395143a4?w=400&h=400&fit=crop',
    group: 'Fruits', category: 'Snack'
  },

  // --- DAIRY ---
  {
    id: 'd1',
    name: 'Greek Yogurt (150g)',
    calories: 120, carbs: 6, protein: 15, fat: 4, fiber: 0, sugar: 6, sodium: 50, cholesterol: 10,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
    group: 'Dairy', category: 'Breakfast'
  },
  {
    id: 'd2',
    name: 'Cottage Cheese (100g)',
    calories: 98, carbs: 3.4, protein: 11, fat: 4.3, fiber: 0, sugar: 2.7, sodium: 364, cholesterol: 17,
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400&h=400&fit=crop',
    group: 'Dairy', category: 'Snack'
  },

  // --- FATS ---
  {
    id: 'fa1',
    name: 'Avocado (Half)',
    calories: 160, carbs: 8.5, protein: 2, fat: 14.7, fiber: 6.7, sugar: 0.7, sodium: 7, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop',
    group: 'Fats', category: 'Breakfast'
  },
  {
    id: 'fa2',
    name: 'Almonds (28g)',
    calories: 164, carbs: 6.1, protein: 6, fat: 14.2, fiber: 3.5, sugar: 1.2, sodium: 0, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d96?w=400&h=400&fit=crop',
    group: 'Fats', category: 'Snack'
  },
  {
    id: 'fa3',
    name: 'Peanut Butter (1 tbsp)',
    calories: 94, carbs: 3, protein: 4, fat: 8, fiber: 1, sugar: 1, sodium: 75, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=400&fit=crop',
    group: 'Fats', category: 'Breakfast'
  }
];

export const MOCK_WEIGHT_HISTORY: WeightRecord[] = [
  { date: 'MON', weight: 158.2 },
  { date: 'TUE', weight: 157.5 },
  { date: 'WED', weight: 157.8 },
  { date: 'THU', weight: 156.4 },
  { date: 'FRI', weight: 156.9 },
  { date: 'SAT', weight: 155.2 },
  { date: 'SUN', weight: 155.0 },
];

export const MOCK_CALORIE_INTAKE = [
  { day: 'M', kcal: 2100 },
  { day: 'T', kcal: 1800 },
  { day: 'W', kcal: 2400, highlight: true },
  { day: 'T', kcal: 1950 },
  { day: 'F', kcal: 2200 },
  { day: 'S', kcal: 1750 },
  { day: 'S', kcal: 2000 },
];
