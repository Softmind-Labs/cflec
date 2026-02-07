// CFLP Platform Constants

export const APP_NAME = 'CFLP';
export const APP_FULL_NAME = 'Certified Financial Literacy Platform';

export const STARTING_PORTFOLIO_BALANCE = 500.00;

export const QUIZ_PASS_THRESHOLD = 70; // Percentage required to pass

// Subscription pricing
export const SUBSCRIPTION_PRICE = {
  amount: 312,
  currency: 'GHS',
  period: 'year',
  formatted: 'GHS 312/year',
} as const;

// Ghanaian Banks
export const GHANAIAN_BANKS = {
  absa: 'Absa Bank Ghana',
  fidelity: 'Fidelity Bank Ghana',
  ecobank: 'Ecobank Ghana',
  gcb: 'GCB Bank',
  access: 'Access Bank Ghana',
  umb: 'Universal Merchant Bank',
  uba: 'United Bank for Africa Ghana',
} as const;

// Ghana Regions
export const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Central',
  'Eastern',
  'Volta',
  'Northern',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
  'Western North',
  'Oti',
  'North East',
  'Savannah',
] as const;

// West African Countries
export const WEST_AFRICAN_COUNTRIES = [
  'Ghana',
  'Nigeria',
  'Senegal',
  "Côte d'Ivoire",
  'Cameroon',
  'Mali',
  'Burkina Faso',
  'Niger',
  'Guinea',
  'Benin',
  'Togo',
  'Sierra Leone',
  'Liberia',
  'Mauritania',
  'Gambia',
  'Guinea-Bissau',
  'Cape Verde',
] as const;

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  MODULES: '/modules',
  MODULE_PLAYER: '/modules/:id',
  SIMULATOR: '/simulator',
  SIMULATOR_BANKING: '/simulator/banking',
  SIMULATOR_INVESTMENT: '/simulator/investment',
  SIMULATOR_TRADING: '/simulator/trading',
  SIMULATOR_CAPITAL_MARKETS: '/simulator/capital-markets',
  TRADE: '/simulator/trade',
  LEADERBOARD: '/simulator/leaderboard',
  CERTIFICATES: '/certificates',
  PROFILE: '/profile',
  // Kids routes
  KIDS: '/kids',
  KIDS_DASHBOARD: '/kids/dashboard',
  KIDS_MODULES: '/kids/modules',
  KIDS_MODULE_PLAYER: '/kids/modules/:id',
} as const;

export const CERTIFICATE_COLORS = {
  green: {
    bg: 'bg-cflp-green',
    text: 'text-cflp-green-foreground',
    border: 'border-cflp-green',
  },
  white: {
    bg: 'bg-cflp-white',
    text: 'text-cflp-white-foreground',
    border: 'border-gray-300',
  },
  gold: {
    bg: 'bg-cflp-gold',
    text: 'text-cflp-gold-foreground',
    border: 'border-cflp-gold',
  },
  blue: {
    bg: 'bg-cflp-blue',
    text: 'text-cflp-blue-foreground',
    border: 'border-cflp-blue',
  },
} as const;

export const ACCOUNT_TYPE_LABELS = {
  kid: 'Kids (6-12)',
  high_schooler: 'High Schooler (13-17)',
  adult: 'Adult (18+)',
} as const;

// Market Categories
export const MARKET_CATEGORIES = {
  banking: {
    title: 'Banking',
    description: 'Treasury Bills, Fixed Deposits, Savings',
    icon: 'building-2',
    color: 'primary',
  },
  investment: {
    title: 'Investment',
    description: 'Ghana Stock Exchange, World Stock Market',
    icon: 'trending-up',
    color: 'cflp-green',
  },
  trading: {
    title: 'Trading',
    description: 'Forex, Commodities, Crypto Demo',
    icon: 'candlestick-chart',
    color: 'cflp-gold',
  },
  capital_markets: {
    title: 'Capital Markets',
    description: 'Bonds, Mutual Funds, ETFs',
    icon: 'landmark',
    color: 'cflp-blue',
  },
} as const;
