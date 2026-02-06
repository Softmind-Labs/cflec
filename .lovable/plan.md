

# CFLP - Certified Financial Literacy Platform

## Overview
A comprehensive financial literacy learning platform with three distinct user experiences (Kids, High Schoolers, Adults), certificate-based progression, and an integrated stock trading simulator.

---

## 🎨 Design & Theme
- **Adult/High School Portal:** Professional university-style design with clean, modern UI (think Coursera meets Bloomberg)
- **Kids Portal:** Fun, colorful, gamified interface with friendly characters and animations
- **Color Coding:** Green, White, Gold, and Blue accents matching certificate levels

---

## 🔐 Authentication System

### Three Login Options:
1. **Phone + DOB + Mother's First Name** - Security questions approach
2. **Phone + OTP** - One-time password via SMS
3. **Email + Password** - Traditional login

### Account Types:
- Kids Account (Ages 6-12)
- High Schooler Account (Ages 13-17)
- Adult Account (18+)

### Registration Flow:
- User selects account type during signup
- Age verification determines available portals
- Annual subscription payment after account creation

---

## 📚 Learning Module System

### Certificate Structure:

| Certificate | Modules | Available To |
|-------------|---------|--------------|
| 🟢 GREEN | 1-10 | All users |
| ⚪ WHITE | 11-30 | High Schoolers & Adults |
| 🟡 GOLD | 31-40 | High Schoolers & Adults |
| 🔵 BLUE | Module 99 | Adults only |

### Module Features:
- **Video Lessons** - Primary content delivery
- **Text & Images** - Supporting materials and summaries
- **Quizzes** - Knowledge assessment
- **Simulation Assignments** - Practical trading exercises (where applicable)

### Progression Rules:
- Modules unlock sequentially (must complete current to access next)
- Completion requires: All videos watched + Quiz passed + Simulation passed (if included)
- Certificate awarded upon completing all modules in a level
- High Schoolers/Adults can optionally take Green modules first

---

## 📊 Stock Trading Simulator

### Features:
- **Starting Balance:** $500 virtual money
- **Basic Trading:** Buy/sell stocks with market orders
- **Portfolio Tracking:** View holdings, gains/losses, transaction history
- **Leaderboards:** Compete with other learners
- **Trading Tutorials:** Guided lessons on how to trade

### Technical Approach (MVP):
- Mock stock data with realistic price movements
- Simulated market behavior
- Ready to plug in real API later (Yahoo Finance, Alpha Vantage, etc.)

---

## 🖥️ Key Pages & Features

### 1. Landing Page
- Platform overview and value proposition
- "Start Learning" call-to-action
- Toggle between Adult/High School and Kids entry points

### 2. Authentication Pages
- Login with three method options
- Registration with account type selection
- Subscription payment integration (Stripe)

### 3. Dashboard (Adult/High School)
- Progress overview with certificate tracking
- Current module with continue button
- Upcoming modules (locked/unlocked status)
- Simulation performance summary
- Leaderboard preview

### 4. Dashboard (Kids)
- Fun, gamified progress display
- Current lesson with friendly prompts
- Stars/badges earned
- Simple navigation

### 5. Module Player
- Video player with progress tracking
- Reading materials section
- Quiz component
- Simulation assignment launcher

### 6. Trading Simulator
- Stock search and selection
- Buy/sell interface
- Portfolio view with charts
- Transaction history
- Performance analytics
- Leaderboard rankings

### 7. Certificate Gallery
- Earned certificates display
- Download/share options
- Progress toward next certificate

### 8. Profile & Settings
- Account management
- Subscription status
- Learning history

---

## 💳 Payment Integration
- **Stripe** for annual subscription processing
- Subscription management (upgrade, cancel, renew)
- Payment history

---

## 🗄️ Backend Requirements (Lovable Cloud)

### Database Tables:
- Users (with account type, subscription status)
- Modules (content, requirements, certificate mapping)
- User Progress (video completion, quiz scores, simulation results)
- Certificates (earned certificates per user)
- Portfolios (simulation holdings and cash balance)
- Transactions (buy/sell history)
- Leaderboard (rankings and scores)

### Authentication:
- Multi-method auth (email, phone+OTP, phone+security)
- Account type verification

---

## 📱 Responsive Design
- Desktop-first for Adults/High Schoolers
- Tablet-friendly for all users
- Mobile-responsive for on-the-go learning

---

## MVP Scope (Phase 1)

### Included:
✅ Landing page with dual entry points
✅ Authentication with all three login methods
✅ User registration with account type selection
✅ Adult/High School dashboard
✅ Kids dashboard (separate themed interface)
✅ Module listing with lock/unlock logic
✅ Module player (video, text, quiz)
✅ Stock trading simulator with mock data
✅ Portfolio tracking and leaderboards
✅ Certificate display and tracking
✅ Stripe subscription integration
✅ Basic profile management

### Deferred to Later:
- Real stock API integration
- SMS OTP (will simulate for MVP)
- Advanced analytics
- Mobile app

---

## Next Steps After Plan Approval:
1. Set up Lovable Cloud (database & auth)
2. Build authentication system
3. Create landing page and dual portals
4. Implement module system with progression
5. Build trading simulator
6. Integrate Stripe payments
7. Polish and test

