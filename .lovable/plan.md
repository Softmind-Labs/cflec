

# Remove "How It Works", Restore Feature Cards

## Change
Replace the "How It Works" 3-step section (lines 99-130) with the original "Everything You Need to Succeed" 4-image-card grid that was there before the rewrite.

## In `src/pages/Index.tsx`:

1. **Add imports** for the 4 feature images:
   - `onlineLearningImg` from `@/assets/features/online-learning.jpg`
   - `certificatesImg` from `@/assets/features/certificates.jpg`
   - `tradingSimulatorImg` from `@/assets/features/trading-simulator.jpg`
   - `aiAssistedImg` from `@/assets/features/ai-assisted.jpg`

2. **Replace** the `steps` array (lines 15-34) with a `features` array using the updated copy from Step 4c:
   - "41 Modules" / "Structured video lessons from money basics to professional investing"
   - "5 Certificates" / "Achieve Green, White, Gold, Blue, and Black certifications as you level up"
   - "Stock Simulator" / "Practice with $500 virtual money in real market conditions risk-free"
   - "AI-Powered Support" / "Get personalized guidance and instant answers as you learn"

3. **Replace** the "How It Works" section (lines 99-130) with a "Everything You Need to Succeed" section:
   - 2x2 grid of image cards (`md:grid-cols-2 lg:grid-cols-4`)
   - Each card: rounded image on top, title + description below
   - Hover lift effect: `hover:-translate-y-1 hover:shadow-xl transition-all duration-200`

4. **Remove** unused `BarChart3` import (only used by old steps)

