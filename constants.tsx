
import { FoodItem, WeightRecord } from './types';

export const MOCK_FOODS: FoodItem[] = [
  // --- MEAT ---
  {
    id: 'm1',
    name: 'Chicken Breast (100g)',
    calories: 165, carbs: 0, protein: 31, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, cholesterol: 85,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop',
    group: 'Meat', category: 'Lunch'
  },
  {
    id: 'm2',
    name: 'Ground Beef 90% (100g)',
    calories: 176, carbs: 0, protein: 20, fat: 10, fiber: 0, sugar: 0, sodium: 66, cholesterol: 71,
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=200&h=200&fit=crop',
    group: 'Meat', category: 'Dinner'
  },
  {
    id: 'm3',
    name: 'Salmon Fillet (100g)',
    calories: 208, carbs: 0, protein: 20, fat: 13, fiber: 0, sugar: 0, sodium: 59, cholesterol: 55,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
    group: 'Meat', category: 'Dinner'
  },
  {
    id: 'm4',
    name: 'Turkey Breast (100g)',
    calories: 135, carbs: 0, protein: 30, fat: 1, fiber: 0, sugar: 0, sodium: 50, cholesterol: 70,
    image: 'https://images.unsplash.com/photo-1518492104633-ac30d33122f2?w=200&h=200&fit=crop',
    group: 'Meat', category: 'Lunch'
  },
  {
    id: 'm5',
    name: 'Egg (Large)',
    calories: 78, carbs: 0.6, protein: 6, fat: 5, fiber: 0, sugar: 0.6, sodium: 62, cholesterol: 186,
    image: 'https://images.unsplash.com/photo-1582722653846-d2932973719b?w=200&h=200&fit=crop',
    group: 'Meat', category: 'Breakfast'
  },

  // --- VEGETABLES ---
  {
    id: 'v1',
    name: 'Broccoli (100g)',
    calories: 34, carbs: 7, protein: 2.8, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=200&h=200&fit=crop',
    group: 'Vegetables', category: 'Lunch'
  },
  {
    id: 'v2',
    name: 'Carrots (100g)',
    calories: 41, carbs: 10, protein: 0.9, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop',
    group: 'Vegetables', category: 'Lunch'
  },
  {
    id: 'v3',
    name: 'Spinach (100g)',
    calories: 23, carbs: 3.6, protein: 2.9, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop',
    group: 'Vegetables', category: 'Dinner'
  },
  {
    id: 'v4',
    name: 'Bell Pepper (100g)',
    calories: 31, carbs: 6, protein: 1, fat: 0.3, fiber: 2.1, sugar: 4.2, sodium: 4, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1566114169550-49247c43654e?w=200&h=200&fit=crop',
    group: 'Vegetables', category: 'Snack'
  },
  {
    id: 'v5',
    name: 'Cauliflower (100g)',
    calories: 25, carbs: 5, protein: 1.9, fat: 0.3, fiber: 2, sugar: 1.9, sodium: 30, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ec3?w=200&h=200&fit=crop',
    group: 'Vegetables', category: 'Dinner'
  },

  // --- CARBS ---
  {
    id: 'c1',
    name: 'Potato (100g)',
    calories: 77, carbs: 17, protein: 2, fat: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop',
    group: 'Carbs', category: 'Lunch'
  },
  {
    id: 'c2',
    name: 'White Rice (100g cooked)',
    calories: 130, carbs: 28, protein: 2.7, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200&h=200&fit=crop',
    group: 'Carbs', category: 'Lunch'
  },
  {
    id: 'c3',
    name: 'Sweet Potato (100g)',
    calories: 86, carbs: 20, protein: 1.6, fat: 0.1, fiber: 3, sugar: 4.2, sodium: 55, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=200&h=200&fit=crop',
    group: 'Carbs', category: 'Dinner'
  },
  {
    id: 'c4',
    name: 'Oatmeal (1 cup)',
    calories: 150, carbs: 27, protein: 5, fat: 3, fiber: 4, sugar: 1, sodium: 2, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop',
    group: 'Carbs', category: 'Breakfast'
  },
  {
    id: 'c5',
    name: 'Whole Grain Bread (1 slice)',
    calories: 80, carbs: 15, protein: 4, fat: 1, fiber: 2, sugar: 1, sodium: 150, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
    group: 'Carbs', category: 'Breakfast'
  },

  // --- FRUITS ---
  {
    id: 'f1',
    name: 'Banana (Medium)',
    calories: 105, carbs: 27, protein: 1.3, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1571771894821-ad9961d35d4e?w=200&h=200&fit=crop',
    group: 'Fruits', category: 'Snack'
  },
  {
    id: 'f2',
    name: 'Apple (Medium)',
    calories: 95, carbs: 25, protein: 0.5, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop',
    group: 'Fruits', category: 'Snack'
  },
  {
    id: 'f3',
    name: 'Blueberries (100g)',
    calories: 57, carbs: 14, protein: 0.7, fat: 0.3, fiber: 2.4, sugar: 10, sodium: 1, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=200&h=200&fit=crop',
    group: 'Fruits', category: 'Breakfast'
  },

  // --- DAIRY ---
  {
    id: 'd1',
    name: 'Greek Yogurt (150g)',
    calories: 120, carbs: 6, protein: 15, fat: 4, fiber: 0, sugar: 6, sodium: 50, cholesterol: 10,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop',
    group: 'Dairy', category: 'Breakfast'
  },
  {
    id: 'd2',
    name: 'Cheddar Cheese (28g)',
    calories: 115, carbs: 0.4, protein: 7, fat: 9, fiber: 0, sugar: 0.1, sodium: 180, cholesterol: 30,
    image: 'https://images.unsplash.com/photo-1485962391945-4200e615433a?w=200&h=200&fit=crop',
    group: 'Dairy', category: 'Snack'
  },

  // --- FATS ---
  {
    id: 'fa1',
    name: 'Avocado (Half)',
    calories: 160, carbs: 8.5, protein: 2, fat: 14.7, fiber: 6.7, sugar: 0.7, sodium: 7, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&h=200&fit=crop',
    group: 'Fats', category: 'Breakfast'
  },
  {
    id: 'fa2',
    name: 'Almonds (28g)',
    calories: 164, carbs: 6.1, protein: 6, fat: 14.2, fiber: 3.5, sugar: 1.2, sodium: 0, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d96?w=200&h=200&fit=crop',
    group: 'Fats', category: 'Snack'
  },
  {
    id: 'fa3',
    name: 'Olive Oil (1 tbsp)',
    calories: 119, carbs: 0, protein: 0, fat: 13.5, fiber: 0, sugar: 0, sodium: 0, cholesterol: 0,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbacf84c?w=200&h=200&fit=crop',
    group: 'Fats', category: 'Lunch'
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
