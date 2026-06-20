# PRD: PM Studio AI

## Product Summary

PM Studio AI is an AI Product Manager workspace that transforms a one-sentence product idea into a structured product strategy package. The product is designed for founders, builders, and aspiring AI Product Managers who need to demonstrate product thinking, AI workflow design, and decision quality.

## Problem

Most AI PM portfolio projects look like generic LLM wrappers. They generate documents, but they do not show how a senior AI PM thinks through users, markets, AI architecture, risks, evaluation, and business value.

Users need a system that:

- Starts from ambiguity
- Clarifies the highest-impact assumptions
- Produces structured PM artifacts
- Recommends AI architecture
- Evaluates risk and quality
- Shows the reasoning path behind each recommendation

## Target Users

- Aspiring AI Product Managers preparing for FAANG or top-tier AI PM interviews
- Founders validating AI product ideas
- Product builders who want structured PM guidance
- Portfolio reviewers evaluating product thinking and AI system judgment

## Goals

- Turn a one-sentence idea into a complete AI product workspace
- Demonstrate structured AI PM thinking, not chatbot output
- Support a visual multi-agent workflow
- Generate portfolio-ready PM artifacts
- Make AI architecture and evaluation decisions explicit
- Include risk governance for high-stakes AI products

## Non-Goals

- Replace a real product team
- Fully automate product strategy decisions
- Build a chat-first interface
- Provide live market data in the MVP
- Build deep third-party integrations in the first version

## Core User Flow

1. User enters one product idea.
2. PM Agent extracts product context and defines strategy.
3. Research Agent analyzes market and competitors.
4. UX Agent generates personas, journey, and stories.
5. AI Architect Agent recommends RAG, agents, guardrails, and evaluation.
6. Data Analyst Agent defines KPIs and experiments.
7. QA Agent evaluates risks, completeness, and MVP discipline.
8. User reviews the workspace dashboard and exports the product brief.

## Functional Requirements

- Accept one-sentence product idea input
- Generate a structured product context object
- Run the agent workflow in a defined sequence
- Render dashboard-based artifacts
- Show agent confidence and output summaries
- Provide product strategy, PRD, personas, stories, workflow, AI architecture, KPIs, experiments, risks, and evaluation
- Export a Markdown product brief

## AI Requirements

- Separate assumptions from evidence
- Recommend RAG only when grounding or private knowledge is needed
- Recommend agentic workflows only when multi-step reasoning or tool use is useful
- Require human review for high-risk domains
- Include evaluation metrics for AI output quality
- Flag unsupported claims and risk exposure

## Success Metrics

- Time from idea to complete product workspace
- Artifact completeness score
- User trust score
- Quality of AI architecture recommendation
- Number of actionable experiments generated
- Risk coverage score

## Open Questions

- Should future versions support live competitor research?
- Should users be able to customize the agent workflow?
- Should the system support multiple product archetypes?
- Should exports include DOCX, PDF, Notion, and pitch deck formats?

