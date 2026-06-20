# PM Studio AI

PM Studio AI is a professional AI Product Manager workspace that turns a one-sentence product idea into a structured product strategy system.

It is intentionally not a chatbot. The product is designed as an enterprise AI workspace with a visual multi-agent workflow, dashboard-based artifacts, and decision-quality evaluation.

## Demo Scenario

Input:

> 我想做一个 AI 简历筛选产品。

Output:

- Product strategy brief
- PRD
- User research
- Competitive analysis
- Product workflow
- AI architecture recommendation
- RAG / Agent decision
- MVP scope
- KPIs
- Experiment plan
- Risk analysis
- Evaluation dashboard

## Agent Workflow

```text
PM Agent
↓
Research Agent
↓
UX Agent
↓
AI Architect Agent
↓
Data Analyst Agent
↓
QA Agent
```

Each agent owns a distinct product-management judgment:

- PM Agent defines the product thesis, MVP, PRD, goals, non-goals, and product tradeoffs.
- Research Agent analyzes market categories, competitors, positioning, and differentiation.
- UX Agent identifies personas, Jobs to be Done, user stories, and journey steps.
- AI Architect Agent recommends RAG, agents, human review, data flow, guardrails, and evaluation.
- Data Analyst Agent defines product metrics, AI quality metrics, business metrics, and experiments.
- QA Agent evaluates product completeness, risk coverage, AI architecture fit, and MVP discipline.

## Why This Is Portfolio-Level

This project demonstrates AI product management capability rather than prompt wrapping:

- Ambiguous idea to structured product strategy
- Multi-agent product workflow design
- Human-in-the-loop AI product judgment
- AI architecture recommendation with RAG/Agent tradeoffs
- Product, AI quality, and business KPI design
- Experiment design before overbuilding
- Risk governance for high-stakes AI workflows
- Dashboard-based enterprise UX instead of chat UI

## Project Structure

```text
pm-studio-ai/
├── README.md
├── docs/
├── design/
├── demo/
├── src/
└── portfolio/
```

## Local Development

This project uses Next.js, TypeScript, TailwindCSS, and the OpenAI API.

```bash
pnpm install
pnpm dev
```

Optional environment variables:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

If no OpenAI key is provided, the app runs with deterministic demo outputs for portfolio review.

