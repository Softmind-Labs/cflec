
-- ============================================================
-- STEP 1: Database Restructure & Data Seeding (ALL IN ONE)
-- ============================================================

-- 1A: Create new tables
CREATE TABLE IF NOT EXISTS stages (
  id SERIAL PRIMARY KEY,
  stage_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  certificate_name TEXT NOT NULL,
  target_group TEXT,
  age_range_min INTEGER,
  age_range_max INTEGER,
  pedagogical_principle TEXT,
  total_modules INTEGER NOT NULL,
  color_primary TEXT,
  color_secondary TEXT,
  learning_outcomes JSONB,
  audience_coverage JSONB,
  core_goals JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bands (
  id SERIAL PRIMARY KEY,
  stage_id INTEGER REFERENCES stages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  module_start INTEGER NOT NULL,
  module_end INTEGER NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certification_requirements (
  id SERIAL PRIMARY KEY,
  stage_id INTEGER REFERENCES stages(id) ON DELETE CASCADE,
  requirement_text TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1B: Alter profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS primary_stage_id INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age INTEGER;

-- 1C: Alter modules - add new columns
ALTER TABLE modules ADD COLUMN IF NOT EXISTS stage_id INTEGER REFERENCES stages(id);
ALTER TABLE modules ADD COLUMN IF NOT EXISTS band_id INTEGER REFERENCES bands(id);
ALTER TABLE modules ADD COLUMN IF NOT EXISTS learning_objective TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS key_ideas TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS teaching_guide TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS practical_activity TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS assessment_check TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS progression_link TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS is_compulsory BOOLEAN DEFAULT false;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Drop unique constraint on module_number
ALTER TABLE modules DROP CONSTRAINT IF EXISTS modules_module_number_key;

-- 1D: Clear dependent data
DELETE FROM user_progress;
DELETE FROM module_content;
DELETE FROM quizzes;
DELETE FROM modules;

-- 1E: Seed stages
INSERT INTO stages (stage_number, title, certificate_name, target_group, age_range_min, age_range_max, pedagogical_principle, total_modules, color_primary, color_secondary, learning_outcomes, audience_coverage, core_goals) VALUES
(1, 'Primary Level', 'Foundation Certificate in Money Awareness', 'Ages ~6-11 (Primary 1-6)', 6, 11, 'Behavior > Understanding > Curiosity', 10, '#22c55e', '#eab308',
 '["Explain what money is and why it exists","Distinguish needs from wants","Demonstrate saving behavior","Understand how people earn money","Recognize banks and digital money safely","Develop positive money values"]'::jsonb, NULL, NULL),
(2, 'Junior High School (JHS 1-3)', 'Certificate in Personal Financial Skills', 'Ages ~12-15', 12, 15, NULL, 10, '#14b8a6', '#38bdf8',
 '["Actively manage money","Budget income realistically","Use banking and digital financial products responsibly","Understand risk, debt, and basic insurance","Begin thinking like an investor","Understand how money systems affect daily life"]'::jsonb,
 '["In-school JHS learners","Out-of-school youth","Entry-level workers","First-time bank/mobile money users"]'::jsonb, NULL),
(3, 'Senior High School (SHS 1-3)', 'Certificate in Wealth Building & Markets', 'Ages ~16-18', 16, 18, NULL, 10, '#1d4ed8', '#eab308',
 '["Analyze personal finances strategically","Understand and use financial instruments","Apply risk and return thinking","Understand basic investing in stocks, bonds, forex, and crypto","Prepare for tertiary-level wealth-building"]'::jsonb,
 '["SHS learners","Out-of-school youth with secondary knowledge","Young workers seeking financial independence"]'::jsonb, NULL),
(4, 'Tertiary Level', 'Professional Certificate in Financial Systems & Investing', 'Ages ~18+ (University students, adult learners, working professionals)', 18, 99, NULL, 5, '#7c3aed', '#f59e0b',
 '["Analyze financial statements and market data","Understand stocks, forex, crypto, and bonds professionally","Construct and manage diversified portfolios","Apply risk management and ethical investment principles","Integrate e-commerce and entrepreneurial finance"]'::jsonb,
 '["University students","Adult learners","Working professionals"]'::jsonb, NULL),
(5, 'Advanced / Professional Level', 'Advanced Certificate in Markets, Crypto & Wealth Strategy', 'Adult learners, professionals, and advanced tertiary students', 18, 99, NULL, 5, '#dc2626', '#f97316',
 '["Analyze and forecast markets using technical and fundamental strategies","Execute stocks, forex, and crypto trading with risk management","Construct, monitor, and rebalance complex portfolios","Apply ethical frameworks and regulatory compliance","Integrate entrepreneurial ventures and digital finance","Understand global financial trends and macroeconomic impacts"]'::jsonb,
 '["Adult learners","Professionals","Advanced tertiary students"]'::jsonb, NULL);

-- 1F: Seed bands
INSERT INTO bands (stage_id, name, label, module_start, module_end, sort_order) VALUES
(1, 'Band A', 'Lower Primary (P1-P2)', 1, 3, 1),
(1, 'Band B', 'Middle Primary (P3-P4)', 4, 6, 2),
(1, 'Band C', 'Upper Primary (P5-P6)', 7, 10, 3),
(2, 'JHS 1', 'Foundations of Control', 1, 3, 1),
(2, 'JHS 2', 'Systems, Risk & Protection', 4, 6, 2),
(2, 'JHS 3', 'Wealth Thinking & Markets Intro', 7, 10, 3),
(3, 'SHS 1', 'Strategic Personal Finance', 1, 3, 1),
(3, 'SHS 2', 'Markets, Investments & Risk', 4, 7, 2),
(3, 'SHS 3', 'Advanced Market Analysis & Portfolio Thinking', 8, 10, 3);

-- 1G: Seed Stage 1 modules (10)
INSERT INTO modules (stage_id, band_id, module_number, title, certificate_level, learning_objective, key_ideas, teaching_guide, practical_activity, assessment_check, progression_link, duration_minutes, is_compulsory, sort_order, has_simulation) VALUES
(1, (SELECT id FROM bands WHERE stage_id=1 AND name='Band A'), 1, 'What Is Money?', 'green', 'Learners understand money as a tool people use to exchange value.', 'Money is something people agree to use to buy and sell things. Long ago, people exchanged goods directly (barter), but it was difficult. Money makes trading easier, faster, and fairer.', 'Start with barter problem. Introduce money as the helper. Avoid numbers and value judgments.', 'Role-play market exchange with paper tokens.', 'Learner explains in one sentence why money is useful.', 'Prepares learner to understand earning and choice.', 15, false, 1, false),
(1, (SELECT id FROM bands WHERE stage_id=1 AND name='Band A'), 2, 'Needs vs Wants', 'green', 'Learners can classify basic needs and wants.', 'Needs are things we must have to live. Wants make life enjoyable but are not necessary. Money cannot buy everything at once, so people must choose wisely.', 'Use picture cards. Sort into needs and wants.', 'Sorting game with picture cards.', 'Learner correctly sorts 5 items into needs vs wants.', 'Introduces choice and trade-offs.', 15, false, 2, false),
(1, (SELECT id FROM bands WHERE stage_id=1 AND name='Band A'), 3, 'How People Earn Money', 'green', 'Learners understand money is earned through work and service.', 'People earn money by helping others with skills or labor. Different jobs solve different problems. Money is a reward for effort and value given.', 'Highlight dignity of work. Avoid salary comparisons.', 'Job role-play day.', 'Learner explains one job and how it helps people.', 'Introduces value creation.', 15, false, 3, false),
(1, (SELECT id FROM bands WHERE stage_id=1 AND name='Band B'), 4, 'Saving Money', 'green', 'Learners practice saving for future goals.', 'Saving means not spending all money now. People save for emergencies, goals, and the future. Saving requires patience and planning.', 'Use story: Two children, one saves, one spends.', 'Personal savings goal chart.', 'Learner sets a realistic saving goal.', 'Prepares learner for delayed gratification and investing.', 20, false, 4, false),
(1, (SELECT id FROM bands WHERE stage_id=1 AND name='Band B'), 5, 'Simple Budgeting', 'green', 'Learners plan how money will be used before spending.', 'A budget is a plan for money. Income comes in; expenses go out. Planning helps avoid regret.', 'Use pocket-money examples only.', 'Plan a small event exercise.', 'Learner completes a simple income-expense plan.', 'Introduces financial control.', 20, false, 5, false),
(1, (SELECT id FROM bands WHERE stage_id=1 AND name='Band B'), 6, 'Introduction to Banks', 'green', 'Learners understand the basic role of banks.', 'Banks keep money safe. Banks help people save and pay. Banks support communities and businesses.', 'Use classroom bank simulation.', 'Deposit/withdrawal simulation.', 'Learner explains one role of a bank.', 'Foundation for formal financial systems.', 20, false, 6, true),
(1, (SELECT id FROM bands WHERE stage_id=1 AND name='Band C'), 7, 'History of Money (Simplified)', 'green', 'Learners understand how money evolved over time.', 'Money has changed forms: shells, beads, coins, paper, digital. Each form solved problems of the previous one.', 'Use timeline visuals.', 'Create a money timeline poster.', 'Learner describes at least 3 forms money has taken.', 'Connects past to present financial systems.', 20, false, 7, false),
(1, (SELECT id FROM bands WHERE stage_id=1 AND name='Band C'), 8, 'Digital Money & Safety', 'green', 'Learners safely recognize non-physical money.', 'Money can exist digitally (cards, mobile money). Digital money needs security and responsibility. Never share secrets or passwords.', 'Stress safety over technology.', 'Safe vs unsafe behavior scenarios.', 'Learner identifies safe practices.', 'Foundation for digital financial literacy.', 20, false, 8, false),
(1, (SELECT id FROM bands WHERE stage_id=1 AND name='Band C'), 9, 'Introduction to Investing (Conceptual)', 'green', 'Learners understand money can grow over time.', 'Saving keeps money safe; investing helps it grow. Growth takes time and patience. Risk exists, but learning reduces mistakes.', 'Use planting analogy.', 'Growth story mapping.', 'Learner explains difference between saving and investing.', 'Introduces growth mindset for money.', 20, false, 9, false),
(1, (SELECT id FROM bands WHERE stage_id=1 AND name='Band C'), 10, 'Money, Values & Giving', 'green', 'Learners connect money with character.', 'Money reflects choices and values. Giving helps communities. Honesty builds trust.', 'Avoid moral preaching; encourage reflection.', 'Class giving project.', 'Learner articulates one value related to money.', 'Capstone for Stage 1.', 20, false, 10, false);

-- 1H: Seed Stage 2 modules (10)
INSERT INTO modules (stage_id, band_id, module_number, title, certificate_level, learning_objective, key_ideas, teaching_guide, practical_activity, assessment_check, progression_link, duration_minutes, is_compulsory, sort_order, has_simulation) VALUES
(2, (SELECT id FROM bands WHERE stage_id=2 AND name='JHS 1'), 1, 'Understanding Income and Expenses', 'white', 'Learners track and categorize income and expenses to understand cash flow.', 'Income is money received. Expenses are costs to live. Cash flow is the difference. Positive cash flow creates freedom; negative creates stress.', 'Use real-life examples: allowance, small trading. Introduce simple tracking.', 'Track one week of income and expenses.', 'Learner identifies whether cash flow is positive or negative.', 'Foundation for budgeting discipline.', 25, false, 1, false),
(2, (SELECT id FROM bands WHERE stage_id=2 AND name='JHS 1'), 2, 'Practical Budgeting (Real Life)', 'white', 'Learners create and follow a simple personal budget.', 'A budget is a decision tool, not a restriction. Budgets help prioritize needs, savings, and wants. Introduce fixed vs variable expenses.', 'Correct the myth that budgeting is only for poor people.', 'Create a monthly budget from a given income scenario.', 'Learner produces a balanced budget.', 'Prepares for saving, debt, and investing.', 25, false, 2, false),
(2, (SELECT id FROM bands WHERE stage_id=2 AND name='JHS 1'), 3, 'Saving Strategies & Goals', 'white', 'Learners save intentionally using clear goals.', 'Saving without purpose often fails. Goals should be specific, realistic, and time-bound. Introduce emergency savings.', 'Use examples of school fees, devices, skill acquisition.', 'Design a 3-month savings plan.', 'Learner explains why emergency savings matter.', 'Bridges saving to investing mindset.', 25, false, 3, false),
(2, (SELECT id FROM bands WHERE stage_id=2 AND name='JHS 2'), 4, 'Banks, Mobile Money & Financial Products', 'white', 'Learners understand and safely use financial institutions.', 'Banks and mobile money providers are financial intermediaries. Every product has benefits and costs. Introduce Account, Fees, Interest.', 'Focus on consumer awareness, not promotion.', 'Compare two financial products.', 'Learner identifies one cost and one benefit of an account.', 'Foundation for financial systems.', 25, false, 4, false),
(2, (SELECT id FROM bands WHERE stage_id=2 AND name='JHS 2'), 5, 'Debt, Credit & Interest', 'white', 'Learners understand how borrowing works and its risks.', 'Debt is using future income today. Interest is the cost of borrowing. Distinguish productive debt vs consumptive debt.', 'Use mobile loan examples common in Ghana.', 'Debt scenario analysis.', 'Learner explains when debt is dangerous.', 'Connects to risk management.', 25, false, 5, false),
(2, (SELECT id FROM bands WHERE stage_id=2 AND name='JHS 2'), 6, 'Risk & Insurance (Life Reality)', 'white', 'Learners understand risk and basic protection mechanisms.', 'Risk is uncertainty with potential loss. Insurance spreads risk among many people. Some risks should be managed, not avoided.', 'Use health, accident, and property examples.', 'Risk identification exercise.', 'Learner distinguishes risk avoidance from risk management.', 'Prepares for investment risk concepts.', 25, false, 6, false),
(2, (SELECT id FROM bands WHERE stage_id=2 AND name='JHS 3'), 7, 'Assets vs Liabilities', 'white', 'Learners distinguish wealth-building items from wealth-draining ones.', 'Assets put money into your pocket over time. Liabilities take money out. Ownership and cash flow matter more than appearance.', 'Avoid oversimplification; explain context.', 'Classify everyday items.', 'Learner correctly classifies 5 items.', 'Foundation for investing.', 25, false, 7, false),
(2, (SELECT id FROM bands WHERE stage_id=2 AND name='JHS 3'), 8, 'Introduction to Investing & Compounding', 'white', 'Learners understand how money grows over time.', 'Investing is committing money to grow it. Compounding means growth on growth. Time is more powerful than amount.', 'Use charts and stories, not formulas.', 'Compounding timeline illustration.', 'Learner explains why starting early matters.', 'Bridges to financial markets.', 25, false, 8, false),
(2, (SELECT id FROM bands WHERE stage_id=2 AND name='JHS 3'), 9, 'Introduction to Financial Markets (Non-Technical)', 'white', 'Learners understand what markets are and why they exist.', 'Markets connect people who need money with those who have it. Stocks, bonds, and currencies serve different purposes. Prices move due to information and demand.', 'Use marketplace analogies. Keep conceptual.', 'Market role-play exercise.', 'Learner explains why financial markets exist.', 'Gateway to Stage 3.', 25, false, 9, false),
(2, (SELECT id FROM bands WHERE stage_id=2 AND name='JHS 3'), 10, 'Financial Goal Setting & Review', 'white', 'Learners set comprehensive financial goals and review their learning.', 'Financial goals should be specific, measurable, and time-bound. Combine budgeting, saving, and investing knowledge.', 'Encourage reflection on all modules completed.', 'Create a personal financial plan.', 'Learner presents a coherent personal financial plan.', 'Capstone for Stage 2.', 25, false, 10, false);

-- 1I: Seed Stage 3 modules (10)
INSERT INTO modules (stage_id, band_id, module_number, title, certificate_level, learning_objective, key_ideas, teaching_guide, practical_activity, assessment_check, progression_link, duration_minutes, is_compulsory, sort_order, has_simulation) VALUES
(3, (SELECT id FROM bands WHERE stage_id=3 AND name='SHS 1'), 1, 'Advanced Budgeting & Cash Flow Management', 'gold', 'Learners design detailed budgets with savings, discretionary spending, and investment allocation.', 'Budgeting is proactive. 50/30/20 allocation. Track inflows and outflows systematically. Emergency funds are critical.', 'Use real-life scenarios: student income, allowances, small businesses.', 'Create a monthly budget with allocations.', 'Learner produces a balanced budget with investment allocation.', 'Foundation for wealth-building.', 30, false, 1, false),
(3, (SELECT id FROM bands WHERE stage_id=3 AND name='SHS 1'), 2, 'Savings & Emergency Funds Strategy', 'gold', 'Learners establish tiered savings strategies.', 'Short-term: within 1 year. Medium-term: 1-5 years. Long-term: >5 years. Safety and liquidity differ by goal.', 'Use visual timelines; plan for real-life scenarios.', 'Set up a 3-tiered savings plan.', 'Learner explains rationale for each tier.', 'Prepares for credit and investment decisions.', 30, false, 2, false),
(3, (SELECT id FROM bands WHERE stage_id=3 AND name='SHS 1'), 3, 'Introduction to Credit & Personal Debt Strategy', 'gold', 'Learners understand credit, debt, interest, and responsible borrowing.', 'Credit can grow wealth if used responsibly. Distinguish good debt vs bad debt. Interest reduces freedom if unmanaged.', 'Discuss local examples: mobile loans, school fees loans, microfinance.', 'Scenario-based debt analysis.', 'Learner identifies safe vs risky debt.', 'Connects to market and investment risk.', 30, false, 3, false),
(3, (SELECT id FROM bands WHERE stage_id=3 AND name='SHS 2'), 4, 'Introduction to Financial Markets', 'gold', 'Learners understand how financial markets work.', 'Markets connect buyers and sellers. Types: stock, bond, forex, commodities. Price by supply, demand, and information.', 'Use market stall analogies.', 'Simulate buying and selling in classroom market.', 'Learner explains why prices change.', 'Gateway to specific instruments.', 30, false, 4, true),
(3, (SELECT id FROM bands WHERE stage_id=3 AND name='SHS 2'), 5, 'Introduction to Stock Investing', 'gold', 'Learners understand stock ownership and basic mechanics.', 'Stocks represent ownership. Returns through dividends and capital gains. Diversification reduces risk.', 'Use simple company examples. Focus on learning, not speculation.', 'Mock stock investment with tokens.', 'Learner explains dividends vs capital gains.', 'Foundation for trading simulator.', 30, false, 5, true),
(3, (SELECT id FROM bands WHERE stage_id=3 AND name='SHS 2'), 6, 'Introduction to Forex (Currency Markets)', 'gold', 'Learners understand how currency markets work.', 'Forex involves exchanging currencies. Rates influenced by trade, policy, speculation.', 'Use GHS/USD examples. Keep conceptual.', 'Currency exchange role-play.', 'Learner explains what affects exchange rates.', 'Prepares for forex simulation.', 30, false, 6, true),
(3, (SELECT id FROM bands WHERE stage_id=3 AND name='SHS 2'), 7, 'Introduction to Cryptocurrency', 'gold', 'Learners understand crypto basics and its role in modern finance.', 'Crypto = digital money on blockchain. Key features: decentralization, security, transparency. High risk and volatility.', 'Focus on concepts, not trading. Avoid promoting buying.', 'Crypto analogy game with supply rules.', 'Learner explains crypto vs fiat currency.', 'Foundation for advanced crypto.', 30, false, 7, false),
(3, (SELECT id FROM bands WHERE stage_id=3 AND name='SHS 3'), 8, 'Investment Strategy & Portfolio Diversification', 'gold', 'Learners apply basic portfolio principles to reduce risk.', 'Don''t put all money in one asset. Diversification spreads risk. Risk tolerance varies by age, goal, capital.', 'Use mock portfolio simulation.', 'Design a diversified portfolio.', 'Learner justifies allocation based on risk/reward.', 'Prepares for professional portfolio management.', 30, false, 8, true),
(3, (SELECT id FROM bands WHERE stage_id=3 AND name='SHS 3'), 9, 'Basic Technical & Fundamental Analysis', 'gold', 'Learners understand simple methods to evaluate investments.', 'Fundamental: company performance, revenues, industry. Technical: price patterns. Both guide decisions.', 'Use charts and stories. No complex formulas.', 'Analyze mock company or currency.', 'Learner identifies good vs risky investment.', 'Bridges to professional analysis.', 30, false, 9, false),
(3, (SELECT id FROM bands WHERE stage_id=3 AND name='SHS 3'), 10, 'Capstone: Financial Markets Review', 'gold', 'Learners consolidate SHS-level financial knowledge.', 'Review stocks, forex, crypto. Revisit risk, diversification, analysis. Prepare mock investment presentation.', 'Encourage peer presentations.', 'Present a mock investment strategy.', 'Learner demonstrates integrated understanding.', 'Capstone for Stage 3.', 30, false, 10, false);

-- 1J: Seed Stage 4 modules (5)
INSERT INTO modules (stage_id, band_id, module_number, title, certificate_level, learning_objective, key_ideas, teaching_guide, practical_activity, assessment_check, progression_link, duration_minutes, is_compulsory, sort_order, has_simulation) VALUES
(4, NULL, 1, 'Advanced Financial Systems & Macro Understanding', 'blue', 'Learners understand how national and global financial systems operate.', 'Financial systems: banks, central banks, stock markets, fintech. Monetary policy, inflation, interest rates affect investments. Currency exchange reflects trade and policy.', 'Use Ghana Cedi vs USD, government bonds, mobile banking examples.', 'Analyze interest rate change impact on budget and investment.', 'Learner explains how macro policy affects personal finance.', 'Foundation for professional investing.', 45, false, 1, false),
(4, NULL, 2, 'Professional Stock Market Investing', 'blue', 'Learners apply professional techniques for stock evaluation and trading.', 'Fundamental: financial ratios, income statements, balance sheets. Technical: charts, trends, volume, momentum. Diversification reduces risk.', 'Use case studies of real companies.', 'Build simulated stock portfolio with analysis.', 'Learner justifies stock picks with reasoning.', 'Prepares for multi-asset portfolio.', 45, false, 2, true),
(4, NULL, 3, 'Forex and Currency Markets (Professional)', 'blue', 'Learners understand currency markets, strategies, and risk management.', 'Forex is largest global market. Currencies influenced by rates, trade balances, geopolitics. Leverage amplifies gains and losses.', 'Use GHS/USD, EUR/USD. Explain position sizing, stop-loss, leverage.', 'Simulated forex trading with risk management.', 'Learner evaluates risk and return of currency trade.', 'Connects to portfolio diversification.', 45, false, 3, true),
(4, NULL, 4, 'Cryptocurrency & Digital Assets', 'blue', 'Learners analyze cryptocurrencies with professional frameworks.', 'Decentralized, blockchain-based. Exchanges, wallets, security critical. Strategies: hodling, trading, staking. Regulatory frameworks must be understood.', 'Focus on professional understanding and risk awareness.', 'Simulate crypto portfolio with security rules.', 'Learner explains risk, volatility, and security measures.', 'Bridges to portfolio management.', 45, false, 4, false),
(4, NULL, 5, 'Portfolio Construction, Risk Management & Wealth Strategy', 'blue', 'Learners design comprehensive portfolios aligned with goals and ethics.', 'Portfolio = stocks, bonds, cash, crypto, alternatives. Risk: volatility, correlation, liquidity. Wealth strategy: goals, time horizon, tax, ethics.', 'Use portfolio simulation tools. Long-term thinking.', 'Build multi-asset portfolio with risk analysis.', 'Learner presents portfolio with risk justification.', 'Capstone for Stage 4.', 45, false, 5, true);

-- 1K: Seed Stage 5 modules (5)
INSERT INTO modules (stage_id, band_id, module_number, title, certificate_level, learning_objective, key_ideas, teaching_guide, practical_activity, assessment_check, progression_link, duration_minutes, is_compulsory, sort_order, has_simulation) VALUES
(5, NULL, 1, 'Advanced Stock Market Analysis & Trading', 'blue', 'Learners analyze and trade stocks professionally with advanced strategies.', 'Fundamental: earnings, P/E, cash flows. Technical: candlesticks, RSI, MACD. Strategies: swing, day, position trading. Risk: stop-loss, position sizing, hedging.', 'Use simulated accounts. Emphasize risk awareness.', 'Create simulated 6-month stock trading portfolio.', 'Learner produces trade log with analysis and risk management.', 'Mastery-level stock trading.', 60, false, 1, true),
(5, NULL, 2, 'Professional Forex Trading', 'blue', 'Learners execute forex trades using professional tools and risk strategies.', 'Currency pairs, spreads, leverage. Fundamental: central bank policies. Technical: Fibonacci, support/resistance. Risk: never risk >1-2% per trade.', 'Simulate live trading with demo accounts.', 'Execute simulated forex trades with risk documentation.', 'Learner demonstrates risk-managed trading.', 'Professional forex competency.', 60, false, 2, true),
(5, NULL, 3, 'Advanced Cryptocurrency & Digital Assets', 'blue', 'Learners manage crypto investments professionally.', 'Blockchain mechanics, tokenomics, smart contracts, stablecoins. Trading: swing, arbitrage, staking. Security: cold wallets, 2FA.', 'Use simulation platforms. Research-first approach.', 'Build simulated crypto portfolio with diversification.', 'Learner explains construction rationale and security.', 'Professional crypto competency.', 60, false, 3, false),
(5, NULL, 4, 'Portfolio Optimization, Risk & Wealth Management', 'blue', 'Learners optimize multi-asset portfolios with long-term wealth strategies.', 'Modern Portfolio Theory: diversification, correlation, efficient frontier. Risk: volatility, market, liquidity, tail risk. Wealth: goals, tax, ethics.', 'Case studies with professional portfolio tools.', 'Develop 3-year investment plan.', 'Learner presents full portfolio strategy.', 'Mastery-level wealth management.', 60, false, 4, true),
(5, NULL, 5, 'Entrepreneurship, E-Commerce & Global Financial Strategy', 'blue', 'Learners integrate entrepreneurship and digital finance into wealth-building.', 'Small business finance: capital, expenses, profit. E-commerce: payments, marketing, supply chain. Global trends: fintech, AI, cross-border trading.', 'Use case studies of small businesses and online stores.', 'Design business plan with financial strategy.', 'Learner presents comprehensive wealth-building strategy.', 'Capstone for Stage 5.', 60, false, 5, false);

-- 1L: Module 99 (Compulsory)
INSERT INTO modules (stage_id, band_id, module_number, title, certificate_level, learning_objective, key_ideas, teaching_guide, practical_activity, assessment_check, progression_link, duration_minutes, is_compulsory, sort_order, has_simulation) VALUES
(NULL, NULL, 99, 'Ghana Financial Systems & Current Affairs (BOG & SEC Updates)', 'green', 'Learners gain comprehensive understanding of Ghana''s central financial institutions including BOG and SEC.', 'Bank of Ghana: Structure, governance, monetary policies, inflation control, financial inclusion. SEC: Regulatory framework, investor education, compliance. Ministry of Finance: Fiscal policies, government budgeting, public investment programs.', 'Dynamic module refreshed regularly with new policies and regulatory changes.', 'Policy Review Exercise. Simulation Activity. Discussion Forum.', 'Learner explains BOG and SEC roles. Demonstrates understanding of policy impacts. Produces short report.', NULL, 30, true, 99, false);

-- 1M: Seed certification requirements
INSERT INTO certification_requirements (stage_id, requirement_text, requirement_type, sort_order) VALUES
(1, 'Complete all 10 modules', 'module_completion', 1),
(1, 'Submit one Personal Money Project', 'project_submission', 2),
(1, 'Demonstrate behavioral understanding', 'demonstration', 3),
(2, 'Complete all 10 modules', 'module_completion', 1),
(2, 'Pass a competency-based assessment', 'assessment', 2),
(2, 'Submit a Personal Financial Plan (basic)', 'project_submission', 3),
(3, 'Complete all 10 modules', 'module_completion', 1),
(3, 'Submit a Personal Investment Simulation Portfolio', 'project_submission', 2),
(3, 'Pass a competency-based assessment', 'assessment', 3),
(4, 'Complete all 5 modules', 'module_completion', 1),
(4, 'Submit a comprehensive portfolio simulation', 'project_submission', 2),
(4, 'Pass a competency-based assessment (written + practical)', 'assessment', 3),
(4, 'Demonstrate understanding of ethical and regulatory frameworks', 'demonstration', 4),
(5, 'Complete all 5 modules', 'module_completion', 1),
(5, 'Submit live or simulated multi-asset portfolios', 'project_submission', 2),
(5, 'Present a comprehensive wealth-building strategy', 'project_submission', 3),
(5, 'Pass practical competency-based assessments', 'assessment', 4),
(5, 'Demonstrate understanding of ethics, risk management, and global financial systems', 'demonstration', 5);

-- 1N: Enable RLS on new tables
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view stages" ON stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view bands" ON bands FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view certification requirements" ON certification_requirements FOR SELECT TO authenticated USING (true);
