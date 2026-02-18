# gigaspec AI Collaboration - Example Workflow

This shows how an AI assistant (Claude, Kimi, etc.) collaborates with a user through the gigaspec framework.

---

## User Story: Building a Math Learning App

### Step 1: User Describes Project

```
User: "I want to build a math learning app for kids. It should have 
interactive lessons, progress tracking, and a reward system. Parents 
should be able to see their child's progress."
```

### Step 2: AI Creates Analysis Prompt

The AI runs gigaspec to create an analysis prompt:

```bash
$ gigaspec analyze "math learning app for kids with interactive lessons, 
progress tracking, and reward system. Parents can see progress"
```

**Output (analysis-prompt.txt):**
```
You are a Staff+ Engineer and Technical Architect.
Your task is to analyze a project description and make intelligent technical decisions.

PROJECT DESCRIPTION:
math learning app for kids with interactive lessons, progress tracking, 
and reward system. Parents can see progress

Analyze this project deeply. Consider:

1. WHAT is being built? (Core functionality, user flows)
2. WHO are the users? (End users, admins, scale)
3. WHAT are the constraints? (Performance, security, compliance)
4. WHAT are the integrations? (External APIs, services)
5. WHAT is the timeline and team size?

Based on your analysis, answer these questions:

--- ANALYSIS ---

Core Purpose: [What is the fundamental problem being solved?]

User Types: [Who will use this? How many?]

Key Features: [What are the 3-5 most important features?]

Technical Challenges: [What will be hardest to build?]

Scale Expectations: [How many users? What traffic?]

--- TECHNICAL DECISIONS ---

Recommended Stack: [Language/Framework with specific version]
Why: [Explain your reasoning based on the analysis]

Alternative Stacks: [2 other options with pros/cons]

Database: [Which database and why]

Cache Strategy: [What to cache and how]

External Services: [What 3rd party services are needed?]

Deployment Platform: [Where to deploy and why]

--- QUESTIONS FOR USER ---

What questions do you have that would help you make better recommendations?
List 3-5 specific questions.

--- CONFIDENCE ---
How confident are you in these recommendations? (High/Medium/Low)
What information would increase your confidence?
```

### Step 3: AI Analyzes and Asks Questions

The AI (Claude/Kimi) analyzes the prompt and responds:

```
AI: I've analyzed your math learning app. Here's my assessment:

--- ANALYSIS ---

Core Purpose: An educational platform that makes math learning engaging 
for children through interactive content, while giving parents visibility 
into their child's progress.

User Types:
- Primary: Children (ages 6-12) - the learners
- Secondary: Parents - monitoring progress
- Tertiary: Teachers (potential future feature)

Key Features:
1. Interactive math lessons with visual explanations
2. Progress tracking and analytics
3. Reward/gamification system (badges, points)
4. Parent dashboard with progress reports
5. User management (child accounts linked to parents)

Technical Challenges:
- Real-time progress sync between child and parent views
- Handling media (images, animations for lessons)
- GDPR/COPPA compliance for children's data
- Offline capability for learning on-the-go

Scale Expectations:
- Start: 100-1000 users
- Growth: 10K-100K users within 2 years
- Traffic: Moderate, mostly read-heavy

--- TECHNICAL DECISIONS ---

Recommended Stack: Node.js 18 + Next.js 14
Why: 
- Next.js provides excellent developer experience for React apps
- Easy deployment to Vercel (optimized for Next.js)
- Great ecosystem for auth (NextAuth.js)
- Good performance for interactive content

Alternative Stacks:
1. Elixir/Phoenix - Better for real-time, but steeper learning curve
2. Python/Django - Great for data/analytics, less optimal for interactive UI

Database: PostgreSQL 15
Why: Reliable, great JSON support for flexible lesson content, 
excellent analytics capabilities for progress tracking

Cache Strategy: Redis for session management and frequently accessed 
lesson data. CDN for static assets (images, videos).

External Services:
- Auth0 or Clerk (authentication)
- Stripe (subscriptions if monetized)
- SendGrid (email notifications to parents)
- Cloudflare R2 or AWS S3 (media storage)
- Vercel (hosting)

Deployment Platform: Vercel
Why: Optimized for Next.js, automatic preview deployments, 
edge network for global performance

--- QUESTIONS FOR USER ---

1. What's your target age range for children? (affects UI/UX complexity)
2. Do you need offline capability for lessons?
3. Will this be free or subscription-based?
4. Any specific compliance requirements (COPPA, GDPR-K)?
5. Do you have a preference for mobile app vs web app?

--- CONFIDENCE ---
Confidence: Medium-High
I'd be more confident with answers to the questions above.
```

### Step 4: User Answers Questions

```
User: 
1. Ages 8-12
2. Yes, offline would be great
3. Freemium model
4. Yes, COPPA compliance needed
5. Web app first, maybe mobile later
```

### Step 5: AI Refines Recommendations

The AI updates its analysis:

```
AI: Thank you! Based on your answers, I've refined my recommendations:

--- REFINED ANALYSIS ---

Target: Ages 8-12 means we can use more complex UI patterns than 
for younger kids, but still need engaging visuals.

Offline capability suggests:
- Service Workers for caching
- Local storage for progress
- Sync when back online

Freemium + COPPA means:
- Parent consent flows required
- Careful data handling
- Stripe for payments (COPPA compliant)

--- FINAL TECHNICAL STACK ---

Stack: Node.js 18 + Next.js 14 with PWA capabilities
Frontend: React 18 + Tailwind CSS + Framer Motion (animations)
Database: PostgreSQL 15 (Supabase for easy setup)
Cache: Redis (Upstash for serverless)
Services:
  - Clerk (auth with COPPA compliance)
  - Stripe (payments)
  - SendGrid (emails)
  - Cloudflare R2 (media)
  - Supabase (database + realtime)
Deployment: Vercel (with edge functions)

--- RATIONALE ---

Next.js PWA gives us offline capability through service workers.
Supabase provides PostgreSQL + realtime subscriptions for progress sync.
Clerk has built-in COPPA compliance features.
Vercel edge functions keep API routes close to users globally.

--- TIMELINE BREAKDOWN ---

Phase 1 (Weeks 1-3): Foundation
- Setup Next.js project with PWA config
- Setup Supabase database schema
- Implement Clerk authentication
- Basic lesson content structure

Phase 2 (Weeks 4-7): Core Features  
- Interactive lesson player
- Progress tracking system
- Parent dashboard
- Reward/badge system

Phase 3 (Weeks 8-10): Polish & Compliance
- COPPA compliance implementation
- Offline sync logic
- Payment integration (Stripe)
- Email notifications

Phase 4 (Weeks 11-12): Launch Prep
- Performance optimization
- Testing & bug fixes
- Deployment & monitoring

--- RISKS & MITIGATION ---

Risk: COPPA compliance complexity
Mitigation: Use Clerk's COPPA features, consult legal early

Risk: Offline sync conflicts
Mitigation: Implement conflict resolution strategy, last-write-wins

Risk: Media storage costs
Mitigation: Compress images, use R2 (cheaper than S3)
```

### Step 6: User Approves

```
User: "This looks great! Let's proceed with this stack."
```

### Step 7: AI Generates Specification

The AI runs gigaspec to generate all documentation:

```bash
$ gigaspec generate \
    --name "MathLearn" \
    --stack "Node.js 18 + Next.js 14" \
    --frontend "React 18 + Tailwind" \
    --database "PostgreSQL 15 (Supabase)" \
    --cache "Redis (Upstash)" \
    --services "Clerk,Stripe,SendGrid,R2,Supabase" \
    --deploy "Vercel" \
    --weeks "12"
```

**Output:**
```
[1/1] Generating specification files
    ✓ AGENT.md
    ✓ ARCHITECTURE.md
    ✓ PLAN.md
    ✓ STATE.md
    ✓ WORKFLOW.md
    ✓ SETUP.md
    ✓ DEPLOYMENT.md
    ✓ ENVIRONMENT.md
    ✓ scripts/validate-state.sh
    ✓ .hooks/pre-commit
    ✓ .github/workflows/ai-compliance.yml
    ✓ prompts/{plan,implement,verify,fix}.md
    ✓ .cursorrules
    ✓ CLAUDE.md

──────────────────────────────────────────────────────────────────
✓ Files generated!
──────────────────────────────────────────────────────────────────
```

### Step 8: Project Structure

```
math-learn/
├── AGENT.md              # AI coding standards for Next.js
├── ARCHITECTURE.md       # System design with PWA architecture
├── PLAN.md              # 12-week roadmap
├── STATE.md             # Current project status
├── WORKFLOW.md          # AI development protocols
├── SETUP.md             # Local development guide
├── DEPLOYMENT.md        # Vercel deployment guide
├── ENVIRONMENT.md       # Secrets management
├── CLAUDE.md            # Claude Code guide
├── .cursorrules         # Cursor IDE rules
├── .env.example         # Environment template
├── .gitignore           # Git ignore
├── scripts/
│   └── validate-state.sh
├── .hooks/
│   └── pre-commit
├── .github/workflows/
│   └── ai-compliance.yml
└── prompts/
    ├── plan.md
    ├── implement.md
    ├── verify.md
    └── fix.md
```

### Step 9: Development Begins

```
User: "What should I work on first?"

AI: Let me check the project status.

[AI runs: gigaspec status]

AI: You're in Phase 1 (Foundation). The next priority tasks are:
1. Set up Next.js project with PWA config
2. Setup Supabase database schema
3. Implement Clerk authentication

Shall I help you with the first task?

User: "Yes, let's set up the project."

AI: [Proceeds to help implement following AGENT.md standards]
```

---

## Key Differences from Keyword Detection

| Keyword Detection | AI Collaboration |
|------------------|------------------|
| "real-time" → Elixir | AI analyzes: "Do we actually need real-time?" |
| "ml" → Python | AI analyzes: "What kind of ML? Is it needed now?" |
| Static rules | Dynamic questions and reasoning |
| One-size-fits-all | Tailored to specific requirements |
| No clarification | Asks questions to understand better |

---

## How the Framework Helps

1. **Structured Analysis**: The framework provides prompts that guide the AI to think deeply about requirements

2. **Question-Answer Flow**: The AI can ask clarifying questions instead of guessing

3. **Transparent Reasoning**: The AI explains WHY it made each recommendation

4. **Human Approval**: User reviews and approves before proceeding

5. **Complete Documentation**: Once approved, all 8 specification files are generated

---

## For AI Assistants

When using gigaspec, the AI should:

1. **Run analysis**: `gigaspec analyze "description"`
2. **Think deeply**: Analyze requirements, don't just match keywords
3. **Ask questions**: Use the question section to clarify
4. **Explain reasoning**: Show why you made each recommendation
5. **Get approval**: Wait for user confirmation
6. **Generate docs**: `gigaspec generate --stack "..."`
7. **Follow specs**: During development, follow AGENT.md standards

---

*This is AI-human collaboration, not automation.*
