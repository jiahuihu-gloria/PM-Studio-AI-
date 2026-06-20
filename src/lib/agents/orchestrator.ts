import { titleFromIdea } from "@/lib/domain/frameworks";
import type { AgentTrace, ProductWorkspace } from "@/lib/domain/product-workspace";
import { runAIArchitectAgent } from "./ai-architect-agent";
import { runEvaluationAgent } from "./evaluation-agent";
import { runExperimentAgent } from "./experiment-agent";
import { runIntakeAgent } from "./intake-agent";
import { runMarketAgent } from "./market-agent";
import { runProductStrategyAgent } from "./product-strategy-agent";
import { runRiskAgent } from "./risk-agent";
import { runUserResearchAgent } from "./user-research-agent";

function average(...scores: number[]) {
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

export async function generateProductWorkspace(idea: string): Promise<ProductWorkspace> {
  const intake = await runIntakeAgent(idea);
  const context = intake.data;

  const strategy = await runProductStrategyAgent(context);
  const market = await runMarketAgent(context);
  const research = await runUserResearchAgent(context);
  const architecture = await runAIArchitectAgent(context);
  const experiments = await runExperimentAgent(context);
  const risks = await runRiskAgent(context);

  const baseWorkspace: Omit<ProductWorkspace, "evaluation"> = {
    id: crypto.randomUUID(),
    title: titleFromIdea(idea),
    createdAt: new Date().toISOString(),
    context,
    thesis: `${context.targetCustomers[0]}需要一种更安全的方式使用${context.productType}：既提升决策质量，又保留人的最终判断。`,
    positioning: `面向${context.domain}的 AI 产品管理式工作流：结构化输入、专家 Agent 评审、证据支撑输出和可衡量验证。`,
    personas: research.data.personas,
    userStories: research.data.stories,
    prd: strategy.data.prd,
    competitors: market.data,
    workflow: strategy.data.workflow,
    architecture: architecture.data,
    mvp: strategy.data.mvp,
    kpis: strategy.data.kpis,
    experiments: experiments.data,
    userJourney: research.data.journey,
    risks: risks.data,
    agentTraces: []
  };

  const evaluation = await runEvaluationAgent(baseWorkspace);

  const agentTraces: AgentTrace[] = [
    {
      agent: "PM Agent",
      objective: "理解产品想法，定义产品方向、PRD、MVP 和核心取舍。",
      outputSummary: `${intake.trace.outputSummary} ${strategy.trace.outputSummary}`,
      confidence: average(intake.trace.confidence, strategy.trace.confidence)
    },
    {
      agent: "Research Agent",
      objective: "分析市场、竞品类别、差异化机会和可防守切入点。",
      outputSummary: market.trace.outputSummary,
      confidence: market.trace.confidence
    },
    {
      agent: "UX Agent",
      objective: "生成目标用户、JTBD、用户故事和端到端体验旅程。",
      outputSummary: research.trace.outputSummary,
      confidence: research.trace.confidence
    },
    architecture.trace,
    {
      agent: "Data Analyst Agent",
      objective: "定义产品指标、AI 质量指标、商业指标和验证实验。",
      outputSummary: `${experiments.trace.outputSummary} 已补充 ${strategy.data.kpis.product.length + strategy.data.kpis.aiQuality.length + strategy.data.kpis.business.length} 个 KPI。`,
      confidence: experiments.trace.confidence
    },
    {
      agent: "QA Agent",
      objective: "检查风险覆盖、MVP 克制度、AI 架构匹配度和产物质量。",
      outputSummary: `${risks.trace.outputSummary} ${evaluation.trace.outputSummary}`,
      confidence: average(risks.trace.confidence, evaluation.trace.confidence)
    }
  ];

  return {
    ...baseWorkspace,
    evaluation: evaluation.data,
    agentTraces
  };
}
