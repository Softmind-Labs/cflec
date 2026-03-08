
-- Part A: Update all 41 modules + Module 99 with exact curriculum content
-- STAGE 1: PRIMARY (Modules 1-10)

-- M1: What Is Money?
UPDATE modules SET
  learning_objective = 'Learners understand money as a tool people use to exchange value.',
  key_ideas = 'Money is something people agree to use to buy and sell things.; Long ago, people exchanged goods directly (barter), but it was difficult.; Money makes trading easier, faster, and fairer.; Money itself is not food or shelter — it helps us get them.',
  teaching_guide = 'Start with: ''What happens if you have rice and I have shoes?'' Act out a barter problem (no exact match of needs). Introduce money as the ''helper.'' Avoid numbers. Avoid value judgments.',
  practical_activity = 'Role-play market exchange with paper tokens.',
  assessment_check = 'Learner explains in one sentence why money is useful.',
  progression_link = 'Prepares learner to understand earning and choice.'
WHERE id = '887efe7f-eef2-496a-a233-8ddc2d02bd94';

-- M2: Needs vs Wants
UPDATE modules SET
  learning_objective = 'Learners can classify basic needs and wants.',
  key_ideas = 'Needs are things we must have to live (food, shelter, clothing).; Wants are things that make life enjoyable but are not necessary.; Money cannot buy everything at once, so people must choose.; Choosing wisely helps families live well.',
  teaching_guide = 'Use pictures. Ask: ''Can you live without this?'' Do not shame wants — teach balance.',
  practical_activity = 'Picture sorting (needs vs wants).',
  assessment_check = 'Learner correctly classifies 4 out of 5 items.',
  progression_link = 'Foundation for budgeting later.'
WHERE id = '4e01e30a-957a-498a-ad58-742fb79532ff';

-- M3: How People Earn Money
UPDATE modules SET
  learning_objective = 'Learners understand money is earned through work and service.',
  key_ideas = 'People earn money by helping others with skills or labor.; Different jobs solve different problems.; Money is a reward for effort and value given.',
  teaching_guide = 'Highlight dignity of work. Avoid salary comparisons.',
  practical_activity = 'Job role-play day.',
  assessment_check = 'Learner explains one job and how it helps people.',
  progression_link = 'Introduces value creation.'
WHERE id = '0c09595e-9492-4451-93f8-3d0c9593e1b3';

-- M4: Saving Money
UPDATE modules SET
  learning_objective = 'Learners practice saving for future goals.',
  key_ideas = 'Saving means not spending all money now.; People save for emergencies, goals, and the future.; Saving requires patience and planning.',
  teaching_guide = 'Use story: ''Two children, one saves, one spends.''',
  practical_activity = 'Personal savings goal chart.',
  assessment_check = 'Learner sets a realistic saving goal.',
  progression_link = 'Prepares learner for delayed gratification and investing.'
WHERE id = 'fd6d4d60-4f3d-4565-b4dd-f55f0f296f32';

-- M5: Simple Budgeting
UPDATE modules SET
  learning_objective = 'Learners plan how money will be used before spending.',
  key_ideas = 'A budget is a plan for money.; Income comes in; expenses go out.; Planning helps avoid regret.',
  teaching_guide = 'Use pocket-money examples only.',
  practical_activity = '''Plan a small event'' exercise.',
  assessment_check = 'Learner completes a simple income–expense plan.',
  progression_link = 'Introduces financial control.'
WHERE id = 'e5c6f8c4-c5bf-46b2-bad5-bc6df2e8ded4';

-- M6: Introduction to Banks
UPDATE modules SET
  learning_objective = 'Learners understand the basic role of banks.',
  key_ideas = 'Banks keep money safe.; Banks help people save and pay.; Banks support communities and businesses.',
  teaching_guide = 'Use classroom ''bank.'' No interest discussion yet.',
  practical_activity = 'Deposit/withdrawal simulation.',
  assessment_check = 'Learner explains one role of a bank.',
  progression_link = 'Foundation for formal financial systems.'
WHERE id = '82d857e2-f286-43b6-86f2-dcc9224c15d2';

-- M7: History of Money (Simplified)
UPDATE modules SET
  learning_objective = 'Learners understand money evolves with society.',
  key_ideas = 'Barter → commodity money → coins → paper → digital.; Each change solved a problem of the past.; Money reflects technology and trust.',
  teaching_guide = 'Use timelines and storytelling.',
  practical_activity = 'Draw a money timeline.',
  assessment_check = 'Learner explains one evolution stage.',
  progression_link = 'Prepares learner for digital and crypto money later.'
WHERE id = 'f4b7a910-c691-4370-a4e7-fa956bf4b264';

-- M8: Digital Money & Safety
UPDATE modules SET
  learning_objective = 'Learners safely recognize non-physical money.',
  key_ideas = 'Money can exist digitally (cards, mobile money).; Digital money needs security and responsibility.; Never share secrets or passwords.',
  teaching_guide = 'Stress safety over technology.',
  practical_activity = 'Safe vs unsafe behavior scenarios.',
  assessment_check = 'Learner identifies safe practices.',
  progression_link = NULL
WHERE id = '0b3f45d6-8c1f-44fe-98e7-e10f39ab4a59';

-- M9: Introduction to Investing (Conceptual)
UPDATE modules SET
  learning_objective = 'Learners understand money can grow over time.',
  key_ideas = 'Saving keeps money safe; investing helps it grow.; Growth takes time and patience.; Risk exists, but learning reduces mistakes.',
  teaching_guide = 'Use planting analogy. No instruments mentioned yet.',
  practical_activity = 'Growth story mapping.',
  assessment_check = 'Learner explains difference between saving and investing.',
  progression_link = NULL
WHERE id = 'fd32346d-69c0-418f-821d-8483ad987497';

-- M10: Money, Values & Giving
UPDATE modules SET
  learning_objective = 'Learners connect money with character.',
  key_ideas = 'Money reflects choices and values.; Giving helps communities.; Honesty builds trust.',
  teaching_guide = 'Avoid moral preaching; encourage reflection.',
  practical_activity = 'Class giving project.',
  assessment_check = 'Learner articulates one value related to money.',
  progression_link = NULL
WHERE id = '85f369dd-65e2-4cbe-a23e-ec3a1e187956';

-- STAGE 2: JHS (Modules 1-10)

-- M1: Income, Expenses & Cash Flow (TITLE FIX)
UPDATE modules SET
  title = 'Income, Expenses & Cash Flow',
  learning_objective = 'Learners understand how money flows in and out of their lives.',
  key_ideas = 'Income is money received regularly or irregularly.; Expenses are costs incurred to live.; Cash flow is the difference between income and expenses.; Positive cash flow creates freedom; negative cash flow creates stress.',
  teaching_guide = 'Use real-life examples: allowance, small trading, gifts and stipends. Introduce simple tracking—not accounting.',
  practical_activity = 'Learner tracks one week of income and expenses.',
  assessment_check = 'Learner correctly identifies whether their cash flow is positive or negative.',
  progression_link = 'Foundation for budgeting and saving discipline.'
WHERE id = 'ebd721f3-863b-4f33-91bc-ab448b4cceb7';

-- M2: Practical Budgeting (Real Life)
UPDATE modules SET
  learning_objective = 'Learners create and follow a simple personal budget.',
  key_ideas = 'A budget is a decision tool, not a restriction.; Budgets help prioritize needs, savings, and wants.; Budgets must reflect reality, not wishes.',
  teaching_guide = 'Correct the myth that budgeting is only for ''poor people.'' Introduce fixed vs variable expenses.',
  practical_activity = 'Create a monthly budget from a given income scenario.',
  assessment_check = 'Learner produces a balanced budget.',
  progression_link = 'Prepares learner for saving, debt, and investing.'
WHERE id = '58831aa9-7e8d-4053-800c-2d4ddf3243dd';

-- M3: Saving Strategies & Goals
UPDATE modules SET
  learning_objective = 'Learners save intentionally using clear goals.',
  key_ideas = 'Saving without purpose often fails.; Goals should be specific, realistic, and time-bound.; Different savings goals require different discipline levels.',
  teaching_guide = 'Use examples of school fees, devices, skill acquisition. Introduce emergency savings.',
  practical_activity = 'Design a 3-month savings plan.',
  assessment_check = 'Learner explains why emergency savings matter.',
  progression_link = NULL
WHERE id = '3d4a997d-d905-46f6-a44f-8178ca2545fe';

-- M4: Banks, Mobile Money & Financial Products
UPDATE modules SET
  learning_objective = 'Learners understand and safely use financial institutions.',
  key_ideas = 'Banks and mobile money providers are financial intermediaries.; They provide storage, payments, and credit.; Every product has benefits and costs.',
  teaching_guide = 'Focus on consumer awareness, not promotion. Introduce basic terms: account, fees, interest (conceptual).',
  practical_activity = 'Compare two financial products.',
  assessment_check = 'Learner identifies one cost and one benefit of an account.',
  progression_link = NULL
WHERE id = '8a57d6a4-9670-431e-bcda-199e199958a9';

-- M5: Debt, Credit & Interest
UPDATE modules SET
  learning_objective = 'Learners understand how borrowing works and its risks.',
  key_ideas = 'Debt is using future income today.; Interest is the cost of borrowing money.; Debt can help or harm depending on purpose and control.',
  teaching_guide = 'Use mobile loan examples common in Ghana and Africa. Distinguish productive debt vs consumptive debt.',
  practical_activity = 'Debt scenario analysis.',
  assessment_check = 'Learner explains when debt is dangerous.',
  progression_link = NULL
WHERE id = 'b0fe20de-2625-484a-89b8-41d7e6296bfb';

-- M6: Risk & Insurance (Life Reality)
UPDATE modules SET
  learning_objective = 'Learners understand risk and basic protection mechanisms.',
  key_ideas = 'Risk is uncertainty with potential loss.; Insurance spreads risk among many people.; Not all risks should be avoided—some should be managed.',
  teaching_guide = 'Use health, accident, and property examples.',
  practical_activity = 'Risk identification exercise.',
  assessment_check = 'Learner distinguishes risk avoidance from risk management.',
  progression_link = NULL
WHERE id = 'a2b7599b-5442-42ef-9875-098c06de5ff0';

-- M7: Assets vs Liabilities
UPDATE modules SET
  learning_objective = 'Learners distinguish wealth-building items from wealth-draining ones.',
  key_ideas = 'Assets put money into your pocket over time.; Liabilities take money out over time.; Ownership and cash flow matter more than appearance.',
  teaching_guide = 'Avoid oversimplification; explain context.',
  practical_activity = 'Classify everyday items.',
  assessment_check = 'Learner correctly classifies 5 items.',
  progression_link = NULL
WHERE id = '746d029b-855d-4323-a209-fe57bbb7a247';

-- M8: Introduction to Investing & Compounding
UPDATE modules SET
  learning_objective = 'Learners understand how money grows over time.',
  key_ideas = 'Investing is committing money to grow it.; Compounding means growth on growth.; Time is more powerful than amount.',
  teaching_guide = 'Use charts and stories, not formulas. Introduce long-term thinking.',
  practical_activity = 'Compounding timeline illustration.',
  assessment_check = 'Learner explains why starting early matters.',
  progression_link = NULL
WHERE id = 'd937a8fd-373e-40ea-9abc-d00627069ef8';

-- M9: Introduction to Financial Markets (Non-Technical)
UPDATE modules SET
  learning_objective = 'Learners understand what markets are and why they exist.',
  key_ideas = 'Markets connect people who need money with those who have it.; Stocks, bonds, and currencies serve different purposes.; Prices move due to information and demand.',
  teaching_guide = 'Use marketplace analogies. No trading yet.',
  practical_activity = 'Simple market simulation.',
  assessment_check = 'Learner explains why prices change.',
  progression_link = NULL
WHERE id = '14253691-640c-481e-b832-d23bf9cee92e';

-- M10: Money, Technology & the Future (TITLE FIX - was "Financial Goal Setting & Review")
UPDATE modules SET
  title = 'Money, Technology & the Future',
  learning_objective = 'Learners recognize how technology changes money.',
  key_ideas = 'Money evolves with technology.; Digital finance increases speed and access.; New systems require new responsibility.',
  teaching_guide = 'Avoid hype; emphasize understanding. This module prepares the ground for crypto, stocks, and forex in SHS.',
  practical_activity = 'Future money brainstorming.',
  assessment_check = 'Learner identifies one opportunity and one risk of financial technology.',
  progression_link = 'Prepares the ground for crypto, stocks, and forex in SHS.'
WHERE id = '5412eced-5165-4f6a-b198-ea12afcafd90';

-- STAGE 3: SHS (Modules 1-10)

-- M1: Advanced Budgeting & Cash Flow Management
UPDATE modules SET
  learning_objective = 'Learners design detailed personal budgets including savings, discretionary spending, and investment allocation.',
  key_ideas = 'Budgeting is proactive, not reactive.; Introduce percent-based allocation (e.g., 50% needs, 30% wants, 20% savings/investment).; Track inflows and outflows systematically.; Emergency funds are critical.',
  teaching_guide = 'Use real-life scenarios: student income, allowances, small businesses. Teach how overspending reduces investment potential.',
  practical_activity = 'Create a monthly budget with allocations for saving, goals, and discretionary spending.',
  assessment_check = 'Learner produces a balanced, realistic budget with at least one allocation for investment.',
  progression_link = NULL
WHERE id = 'cec4d0fc-5b22-4a76-a759-431276a0c636';

-- M2: Savings & Emergency Funds Strategy
UPDATE modules SET
  learning_objective = 'Learners establish tiered savings strategies for short-term, medium-term, and long-term goals.',
  key_ideas = 'Short-term: purchases or fees within 1 year.; Medium-term: assets, education, skills (1–5 years).; Long-term: investments, business, retirement (>5 years).; Safety and liquidity considerations differ by goal.',
  teaching_guide = 'Use visual timelines; encourage learners to plan for real-life scenarios (school fees, emergencies, entrepreneurship).',
  practical_activity = 'Set up a 3-tiered savings plan with amounts, duration, and purpose.',
  assessment_check = 'Learner can explain rationale for each tier.',
  progression_link = NULL
WHERE id = 'e5c854c2-cc1f-4487-bfb5-b9bb8ca92f80';

-- M3: Introduction to Credit & Personal Debt Strategy
UPDATE modules SET
  learning_objective = 'Learners understand credit, debt, interest, and responsible borrowing.',
  key_ideas = 'Credit can be leveraged to grow wealth if used responsibly.; Distinguish good debt (education, productive loans) vs bad debt (consumer debt, high-interest loans).; Interest reduces financial freedom if unmanaged.',
  teaching_guide = 'Discuss local examples: mobile loans, school fees loans, microfinance.',
  practical_activity = 'Scenario-based debt analysis: students calculate interest cost of a short-term loan.',
  assessment_check = 'Learner identifies safe vs risky debt in given scenarios.',
  progression_link = NULL
WHERE id = '0937912e-813b-4d73-ba83-bdba07fc5e84';

-- M4: Introduction to Financial Markets
UPDATE modules SET
  learning_objective = 'Learners understand how financial markets work and why they exist.',
  key_ideas = 'Markets connect buyers and sellers of assets.; Types: stock markets, bond markets, forex, commodities.; Price is determined by supply, demand, and information.; Markets are influenced by news, policy, and investor psychology.',
  teaching_guide = 'Use simple analogies: market stalls → stock markets.',
  practical_activity = 'Simulate buying and selling items in a classroom market.',
  assessment_check = 'Learner explains why prices change in markets.',
  progression_link = NULL
WHERE id = 'df947176-38eb-432a-bb43-f2a4a518ca25';

-- M5: Introduction to Stock Investing
UPDATE modules SET
  learning_objective = 'Learners understand stock ownership and basic stock market mechanics.',
  key_ideas = 'Stocks represent ownership in companies.; Stocks can generate returns through dividends and capital gains.; Risk is inherent; diversification reduces unsystematic risk.; Long-term growth potential vs short-term volatility.',
  teaching_guide = 'Use simple company examples: local companies, popular brands. Avoid speculation; focus on learning market behavior.',
  practical_activity = 'Classroom mock stock investment using tokens or points.',
  assessment_check = 'Learner explains difference between dividend income and capital gains.',
  progression_link = NULL
WHERE id = '727e2f2f-7bee-4762-9450-177d68e13ae1';

-- M6: Introduction to Forex (Currency Markets)
UPDATE modules SET
  learning_objective = 'Learners understand how currencies are traded globally.',
  key_ideas = 'Forex = buying one currency using another.; Exchange rates fluctuate due to trade, policy, news, and speculation.; Forex markets are the largest global financial market.; Simple risk management: never trade money you cannot afford to lose.',
  teaching_guide = 'Use country examples: GHS ↔ USD, EUR, GBP. Show impact of exchange rate changes on everyday purchases.',
  practical_activity = 'Simulate forex trading with classroom points.',
  assessment_check = 'Learner identifies gain/loss scenarios in forex trades.',
  progression_link = NULL
WHERE id = 'ab59879c-a0ca-477e-96d9-91e3aefe2455';

-- M7: Introduction to Cryptocurrency
UPDATE modules SET
  learning_objective = 'Learners understand crypto basics and its role in modern finance.',
  key_ideas = 'Crypto = digital money using blockchain technology.; Key features: decentralization, security, transparency.; Crypto can be used for payments, store of value, and investment.; Risk and volatility are high; education is key before involvement.',
  teaching_guide = 'Focus on concepts, not trading. Avoid promoting buying; emphasize research and understanding.',
  practical_activity = 'Classroom crypto analogy game: tokens represent ''blockchain coins'' with supply rules.',
  assessment_check = 'Learner explains what makes crypto different from fiat currency.',
  progression_link = NULL
WHERE id = '0ea84c8b-78d5-41b0-8f16-26eba66b19cb';

-- M8: Investment Strategy & Portfolio Diversification
UPDATE modules SET
  learning_objective = 'Learners apply basic portfolio principles to reduce risk.',
  key_ideas = 'Don''t put all money in one asset.; Diversification spreads risk across sectors, instruments, and asset types.; Risk tolerance varies by age, goal, and capital.',
  teaching_guide = 'Use classroom mock portfolio simulation: stocks + points + ''crypto tokens''.',
  practical_activity = 'Design a simple diversified portfolio with classroom assets.',
  assessment_check = 'Learner explains why diversification reduces risk.',
  progression_link = NULL
WHERE id = 'd44fe2e0-0fb2-4c84-9114-2b9471a017c0';

-- M9: Basic Technical & Fundamental Analysis
UPDATE modules SET
  learning_objective = 'Learners understand simple methods to evaluate investments.',
  key_ideas = 'Fundamental analysis: study company performance, revenues, and industry.; Technical analysis: observe price movement patterns.; Both methods guide informed investment decisions.',
  teaching_guide = 'Use charts and story-based examples. No complex formulas.',
  practical_activity = 'Classroom analysis of mock company or currency.',
  assessment_check = 'Learner identifies a ''good vs risky'' investment based on analysis.',
  progression_link = NULL
WHERE id = '368c4c61-e0dc-4901-acbe-0f1bfd441410';

-- M10: Ethics, Regulation & Responsible Investing (TITLE FIX - was "Capstone: Financial Markets Review")
UPDATE modules SET
  title = 'Ethics, Regulation & Responsible Investing',
  learning_objective = 'Learners understand the importance of ethics in finance.',
  key_ideas = 'Insider trading, fraud, and misinformation are illegal and unethical.; Responsible investing considers social and environmental impact.; Transparency and honesty maintain trust in markets.',
  teaching_guide = 'Use local/regional examples; emphasize real consequences.',
  practical_activity = 'Discuss a news case of financial fraud and ethical alternative.',
  assessment_check = 'Learner identifies one ethical and one unethical investment behavior.',
  progression_link = NULL
WHERE id = 'e624885e-7942-4975-bb76-9ee5d925baa8';

-- STAGE 4: TERTIARY (Modules 1-5)

-- M1: Advanced Financial Systems & Macro Understanding
UPDATE modules SET
  learning_objective = 'Learners understand how national and global financial systems operate and impact personal and business finance.',
  key_ideas = 'Financial systems include banks, central banks, stock markets, insurance companies, and fintech.; Monetary policy, inflation, interest rates, and fiscal policy affect investments and savings.; Currency exchange rates reflect trade, policy, and macroeconomic trends.; Understanding financial systems allows strategic personal and business decisions.',
  teaching_guide = 'Use real-world examples: Ghana Cedi vs USD, government bonds, mobile banking ecosystems. Highlight the cause-effect chain: interest rates → borrowing costs → investment decisions.',
  practical_activity = 'Analyze the impact of an interest rate change on a personal budget and investment plan.',
  assessment_check = 'Learner explains how macro policy decisions affect personal finance and markets.',
  progression_link = NULL
WHERE id = 'de674f70-12f5-4a7c-84c1-6755eec775b1';

-- M2: Professional Stock Market Investing
UPDATE modules SET
  learning_objective = 'Learners apply professional techniques for stock evaluation, trading strategy, and long-term growth.',
  key_ideas = 'Stocks reflect ownership, voting rights, and potential dividends.; Fundamental analysis: financial ratios, income statements, balance sheets, sector performance.; Technical analysis: charts, trends, volume, momentum indicators.; Diversification reduces risk; sector allocation and correlation analysis matter.; Behavioral finance: market psychology affects stock prices.',
  teaching_guide = 'Introduce a mock portfolio for SHS graduates to manage professionally. Stress long-term vs short-term strategies.',
  practical_activity = 'Create a 3-asset portfolio: local stock + foreign stock + ETF simulation.',
  assessment_check = 'Learner justifies investment choices using analysis.',
  progression_link = NULL
WHERE id = 'faa691d6-1190-48af-8c8d-28c5eceaec4b';

-- M3: Forex and Currency Markets
UPDATE modules SET
  title = 'Forex and Currency Markets',
  learning_objective = 'Learners understand currency markets, trading strategies, and risk management.',
  key_ideas = 'Forex is largest global market, 24/5 liquidity, decentralized.; Currencies are influenced by interest rates, trade balances, geopolitics, and speculation.; Leverage amplifies gains and losses; risk management is essential.; Fundamental vs technical strategies applied in live or simulated environments.',
  teaching_guide = 'Use GHS/USD, EUR/USD pairs to illustrate trading mechanics. Explain position sizing, stop-loss, and leverage basics.',
  practical_activity = 'Simulated forex trading exercise with risk management rules.',
  assessment_check = 'Learner evaluates potential risk and return of a currency trade scenario.',
  progression_link = NULL
WHERE id = 'e314e81f-b2f5-4730-bfb0-60c3f603e72f';

-- M4: Cryptocurrency & Digital Assets
UPDATE modules SET
  learning_objective = 'Learners analyze cryptocurrencies and digital assets with professional frameworks.',
  key_ideas = 'Cryptocurrencies: decentralized, blockchain-based, finite supply (Bitcoin) or inflationary (ETH).; Exchanges, wallets, private/public keys, and security are critical.; Investment strategies include hodling, trading, staking, and yield farming.; Regulatory frameworks, taxation, and fraud risks must be understood.; Crypto integrates with traditional finance via derivatives, ETFs, and tokenized assets.',
  teaching_guide = 'Avoid speculative promotion; focus on professional understanding and risk awareness. Use simulation platforms for safe learning.',
  practical_activity = 'Simulate creating a small crypto portfolio with security and diversification rules.',
  assessment_check = 'Learner explains risk, volatility, and security measures for crypto investments.',
  progression_link = NULL
WHERE id = '336d9f4c-c455-4a3e-9ac9-7b7f19a5196e';

-- M5: Portfolio Construction, Risk Management & Wealth Strategy
UPDATE modules SET
  learning_objective = 'Learners design and manage a comprehensive portfolio aligned with risk tolerance, goals, and ethics.',
  key_ideas = 'Portfolio = combination of stocks, bonds, cash, crypto, and alternative assets.; Risk assessment: volatility, correlation, liquidity, and event risk.; Wealth strategy: goals, time horizon, asset allocation, tax efficiency, and ethical investing.; Continuous review and rebalancing ensures alignment with goals.; Entrepreneurial finance integrates investment and business decision-making.',
  teaching_guide = 'Case studies: local SME investments, stock portfolios, or crypto allocations. Emphasize long-term wealth building vs speculative trading.',
  practical_activity = 'Create a 5-year wealth plan, including diversified investments, savings, and entrepreneurial ventures.',
  assessment_check = 'Learner presents a comprehensive investment and wealth strategy with rationale.',
  progression_link = NULL
WHERE id = '554459b9-9d36-4173-92f2-27046bd53e24';

-- STAGE 5: ADVANCED / PROFESSIONAL (Modules 1-5)

-- M1: Advanced Stock Market Analysis & Trading
UPDATE modules SET
  learning_objective = 'Learners analyze and trade stocks professionally, applying advanced technical and fundamental strategies.',
  key_ideas = 'Fundamental analysis: earnings, P/E ratios, cash flows, industry cycles, and macroeconomic indicators.; Technical analysis: candlestick patterns, trendlines, moving averages, RSI, MACD, volume analysis.; Trading strategies: swing trading, day trading, position trading, dividend investing.; Risk controls: stop-loss, take-profit, position sizing, and hedging.; Behavioral finance: emotions, bias, and market psychology.',
  teaching_guide = 'Use live simulated or demo accounts. Emphasize risk awareness over profit chasing. Encourage reflective learning journals for trade decisions.',
  practical_activity = 'Create a simulated 6-month stock trading portfolio, applying technical/fundamental analysis.',
  assessment_check = 'Learner produces a trade log with analysis and reasoning for each trade, including risk management decisions.',
  progression_link = NULL
WHERE id = '0ffa09b8-99ee-476a-980e-1aa1c6636e1e';

-- M2: Professional Forex Trading
UPDATE modules SET
  learning_objective = 'Learners execute forex trades using professional tools, indicators, and risk strategies.',
  key_ideas = 'Understand currency pairs, spreads, and leverage.; Fundamental drivers: central bank policies, trade balances, geopolitical events.; Technical drivers: trends, Fibonacci retracements, support/resistance, moving averages.; Risk management: leverage control, stop-loss, position sizing, and exposure limits.',
  teaching_guide = 'Simulate live trading using demo accounts. Emphasize money management rules: never risk more than 1–2% of capital per trade.',
  practical_activity = 'Simulated trading over a 4-week ''forex challenge,'' tracking performance and risk adherence.',
  assessment_check = 'Learner produces trading report, detailing analysis, executed trades, and lessons learned.',
  progression_link = NULL
WHERE id = '4e2c2662-b82a-423d-9211-845b517403e8';

-- M3: Advanced Cryptocurrency & Digital Assets
UPDATE modules SET
  learning_objective = 'Learners manage crypto investments professionally and understand decentralized finance.',
  key_ideas = 'Crypto fundamentals: blockchain mechanics, tokenomics, smart contracts, stablecoins.; Trading strategies: swing trading, arbitrage, staking, yield farming.; Security: cold wallets, private keys, 2FA, anti-phishing practices.; Risk and volatility: portfolio allocation, correlation, regulatory awareness.; Integration with fiat markets: crypto ETFs, derivatives, and tokenized assets.',
  teaching_guide = 'Use simulation platforms or demo wallets. Emphasize research-first approach, never speculative hype.',
  practical_activity = 'Build a simulated crypto portfolio with multiple coins, applying diversification and risk management.',
  assessment_check = 'Learner explains portfolio construction rationale, security measures, and expected risk/reward.',
  progression_link = NULL
WHERE id = '62b8f994-7256-46e3-8d8f-ad5734dde558';

-- M4: Portfolio Optimization, Risk & Wealth Management
UPDATE modules SET
  learning_objective = 'Learners optimize multi-asset portfolios and develop long-term wealth strategies.',
  key_ideas = 'Asset classes: stocks, forex, crypto, bonds, real estate, and alternatives.; Modern Portfolio Theory: diversification, correlation, efficient frontier.; Risk assessment: volatility, market risk, liquidity risk, tail risk.; Wealth strategy: goals, time horizon, tax planning, ethical investing.; Monitoring and rebalancing: review portfolio periodically, adjust allocations.',
  teaching_guide = 'Case studies: real or simulated portfolios. Use spreadsheet or professional portfolio tools for modeling.',
  practical_activity = 'Develop a 3-year investment plan, including multiple asset classes and risk mitigation strategies.',
  assessment_check = 'Learner presents a full portfolio strategy, justifying allocation, risk control, and expected outcomes.',
  progression_link = NULL
WHERE id = '0c6c2adb-3e7f-4563-a58f-03f91f2e8f42';

-- M5: Entrepreneurship, E-Commerce & Global Financial Strategy
UPDATE modules SET
  learning_objective = 'Learners integrate entrepreneurship and digital finance into wealth-building strategies.',
  key_ideas = 'Small business finance: capital, expenses, profit, scaling.; E-commerce: online payments, digital marketing, supply chain.; Global trends: fintech, AI in finance, cross-border trading.; Combining trading, investment, and entrepreneurship for long-term wealth.',
  teaching_guide = 'Use real-life case studies of small businesses and online stores. Include digital payments and online financial tools.',
  practical_activity = 'Create a mock business plan integrating investment capital, e-commerce operations, and projected returns.',
  assessment_check = 'Learner presents a comprehensive wealth-building plan combining trading, investing, and business.',
  progression_link = NULL
WHERE id = '618dd012-6b5f-47ae-9b38-ff84d5be5280';

-- MODULE 99: Ghana Financial Systems & Current Affairs (BOG & SEC Updates)
UPDATE modules SET
  learning_objective = 'Learners will gain a comprehensive understanding of Ghana''s central financial institutions, including the Bank of Ghana (BOG) and Securities and Exchange Commission (SEC), their governance, operations, policies, and public initiatives. The module aims to empower citizens to make informed financial decisions, understand regulatory frameworks, and engage effectively with national financial systems.',
  key_ideas = 'Bank of Ghana: Structure, governance, and roles of central bank; Monetary policies, interest rates, inflation control, and their effects on citizens; Initiatives for financial inclusion, digital currency adoption, and banking innovations.; Securities and Exchange Commission: Regulatory framework for capital markets and investments; Public investor education programs; Updates on securities laws, compliance requirements, and market protection mechanisms.; Ministry of Finance: Fiscal policies, government budgeting, and public investment programs; Public announcements affecting taxation, banking, and financial markets.',
  teaching_guide = 'This module content is dynamic and will be refreshed regularly to incorporate the latest news, policy changes, regulatory updates, and public guidance from BOG, SEC, and Ministry of Finance.',
  practical_activity = 'Policy Review Exercise: Learners examine current BOG or SEC policies and summarize their impact on personal and business finances.; Simulation Activity: Analyze a public announcement (e.g., interest rate change or capital market update) and predict possible outcomes for everyday citizens.; Discussion Forum: Facilitate debate on a recent BOG or SEC initiative and how it affects saving, investing, and entrepreneurship.',
  assessment_check = 'Learner can explain the structure and role of BOG and SEC.; Learner demonstrates understanding of how current policies affect personal and professional financial decisions.; Learner produces a short report on a recent initiative or announcement by BOG or SEC and its relevance to citizens.',
  progression_link = NULL
WHERE id = '3756ffdb-a5e8-47f9-af6d-d94be2ade394';
