// CFLP Platform Type Definitions

export type AccountType = 'kid' | 'high_schooler' | 'adult';
export type CertificateLevel = 'green' | 'white' | 'gold' | 'blue';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';
export type GhanaianBank = 'absa' | 'fidelity' | 'ecobank' | 'gcb' | 'access' | 'umb' | 'uba';
export type MarketCategory = 'banking' | 'investment' | 'trading' | 'capital_markets';
export type LeaderboardScope = 'ghana' | 'west_africa' | 'global';

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string;
  account_type: AccountType;
  date_of_birth: string | null;
  phone: string | null;
  mothers_first_name: string | null;
  avatar_url: string | null;
  subscription_status: SubscriptionStatus;
  subscription_expires_at: string | null;
  country?: string;
  region?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BankAccountInfo {
  hasExistingAccount: boolean;
  selectedBank?: GhanaianBank;
  ghanaCardNumber?: string;
  ghanaCardExpiry?: string;
  occupation?: string;
  sourceOfIncome?: string;
}

export interface SignupFormData {
  // Step 1: Credentials
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  accountType: AccountType;
  dateOfBirth: string;
  phone: string;
  mothersFirstName: string;
  country: string;
  region: string;
  
  // Step 2: Bank Account
  bankInfo: BankAccountInfo;
  
  // Step 3: Checkout
  subscriptionPlan: 'yearly';
  paymentMethod: 'mobile_money' | 'card';
}

export interface Module {
  id: string;
  module_number: number;
  title: string;
  description: string | null;
  certificate_level: CertificateLevel;
  thumbnail_url: string | null;
  duration_minutes: number;
  has_simulation: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModuleContent {
  id: string;
  module_id: string;
  content_type: 'video' | 'text' | 'image';
  title: string;
  content: string | null;
  video_url: string | null;
  image_url: string | null;
  order_index: number;
  created_at: string;
}

export interface Quiz {
  id: string;
  module_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  order_index: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  module_id: string;
  video_completed: boolean;
  quiz_score: number | null;
  quiz_passed: boolean;
  simulation_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  certificate_level: CertificateLevel;
  earned_at: string;
  certificate_number: string;
}

export interface MockStock {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  previous_close: number | null;
  day_high: number | null;
  day_low: number | null;
  sector: string | null;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  cash_balance: number;
  created_at: string;
  updated_at: string;
}

export interface StockHolding {
  id: string;
  portfolio_id: string;
  stock_id: string;
  quantity: number;
  average_cost: number;
  created_at: string;
  updated_at: string;
  // Joined data
  stock?: MockStock;
}

export interface Transaction {
  id: string;
  portfolio_id: string;
  stock_id: string;
  transaction_type: 'buy' | 'sell';
  quantity: number;
  price_per_share: number;
  total_amount: number;
  created_at: string;
  // Joined data
  stock?: MockStock;
}

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  account_type: AccountType;
  country?: string;
  region?: string | null;
  cash_balance: number;
  holdings_value: number;
  total_value: number;
}

// Banking simulation types
export interface TreasuryBill {
  id: string;
  term_days: 91 | 182 | 364;
  interest_rate: number;
  min_investment: number;
}

export interface FixedDeposit {
  id: string;
  bank: GhanaianBank;
  term_months: number;
  interest_rate: number;
  min_amount: number;
}

export interface SavingsAccount {
  id: string;
  bank: GhanaianBank;
  interest_rate: number;
  balance: number;
}

// Certificate requirements mapping
export const CERTIFICATE_REQUIREMENTS: Record<CertificateLevel, { minModule: number; maxModule: number; requiredFor: AccountType[] }> = {
  green: { minModule: 1, maxModule: 10, requiredFor: ['kid', 'high_schooler', 'adult'] },
  white: { minModule: 11, maxModule: 20, requiredFor: ['high_schooler', 'adult'] },
  gold: { minModule: 21, maxModule: 26, requiredFor: ['high_schooler', 'adult'] },
  blue: { minModule: 99, maxModule: 99, requiredFor: ['adult'] },
};

// Certificate display info
export const CERTIFICATE_INFO: Record<CertificateLevel, { name: string; color: string; description: string }> = {
  green: { name: 'Green Certificate', color: 'cflp-green', description: 'Financial Fundamentals' },
  white: { name: 'White Certificate', color: 'cflp-white', description: 'Investment Basics' },
  gold: { name: 'Gold Certificate', color: 'cflp-gold', description: 'Advanced Strategies' },
  blue: { name: 'Blue Certificate', color: 'cflp-blue', description: 'Wealth Management' },
};
