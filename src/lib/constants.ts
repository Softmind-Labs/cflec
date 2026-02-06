// CFLP Platform Constants

export const APP_NAME = 'CFLP';
export const APP_FULL_NAME = 'Certified Financial Literacy Platform';

export const STARTING_PORTFOLIO_BALANCE = 500.00;

export const QUIZ_PASS_THRESHOLD = 70; // Percentage required to pass

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  MODULES: '/modules',
  MODULE_PLAYER: '/modules/:id',
  SIMULATOR: '/simulator',
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
