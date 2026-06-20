# AI Architecture

## System Overview

PM Studio AI uses a structured multi-agent workflow rather than a single LLM prompt.

```text
Idea Input
↓
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
↓
Structured Workspace
```

## Core Services

- Frontend workspace: Next.js dashboard UI
- API route: project generation endpoint
- Agent orchestrator: sequential multi-agent workflow
- Domain layer: typed product workspace model
- AI client: OpenAI JSON enhancement boundary
- Repository: in-memory project persistence for MVP

## Agent Responsibilities

### PM Agent

- Product thesis
- PRD
- MVP
- Goals and non-goals
- Strategic assumptions

### Research Agent

- Competitor categories
- Market gaps
- Differentiation opportunities
- Positioning

### UX Agent

- Personas
- Jobs to Be Done
- User stories
- User journey

### AI Architect Agent

- RAG recommendation
- Agent recommendation
- Data sources
- Guardrails
- Human-in-loop decision
- Evaluation metrics

### Data Analyst Agent

- Product KPIs
- AI quality KPIs
- Business KPIs
- Experiment plans

### QA Agent

- Risk analysis
- Quality scoring
- MVP discipline
- Product completeness checks

## RAG Decision Logic

Use RAG when:

- Outputs must be grounded in uploaded or private documents
- Claims require citation
- Knowledge changes frequently
- The task depends on domain-specific context

## Agent Decision Logic

Use agents when:

- The workflow has distinct reasoning stages
- Different expert lenses are needed
- Downstream output depends on upstream decisions
- QA, critique, and evaluation are required

## Human-In-The-Loop Logic

Require human review when:

- The domain is high-stakes
- Decisions affect employment, finance, health, legal, or safety outcomes
- AI recommendations may introduce bias or compliance risk

