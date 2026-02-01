
export enum AppView {
  HOME = 'HOME',
  LOG = 'LOG',
  REPORTS = 'REPORTS',
  PROFILE = 'PROFILE',
  AUTH = 'AUTH',
  DETAILS = 'DETAILS',
  SCAN = 'SCAN'
}

export type FoodGroup = 'Meat' | 'Vegetables' | 'Carbs' | 'Fruits' | 'Dairy' | 'Fats' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  currentWeight: number;
  targetWeight: number;
  dailyCalories: number;
  proteinGoal: number;
  activityLevel: string;
  profilePic: string;
  units: 'Imperial' | 'Metric';
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  image: string;
  group: FoodGroup;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface CustomMeal {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  items: string[]; // Names of ingredients
}

export interface LoggedMeal {
  id: string;
  foodId: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  portion: number;
  timestamp: number;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface WeightRecord {
  date: string;
  weight: number;
}
