import type { AgentResult } from "./agent-types";
import type { ExperimentPlan, ProductContext } from "@/lib/domain/product-workspace";

export async function runExperimentAgent(context: ProductContext): Promise<AgentResult<ExperimentPlan[]>> {
  const experiments: ExperimentPlan[] = [
    {
      name: "问题验证",
      hypothesis: `目标用户会把${context.productType}相关问题视为前三大工作流痛点，并愿意为此改变行为。`,
      method: "访谈 10 位目标用户，梳理当前流程、时间成本和决策痛点。",
      successCriteria: "10 位用户中至少 7 位认为该问题高频、痛、且与预算或业务目标相关。",
      decisionRule: "只有当需求紧迫性和流程 owner 清晰时，才进入原型验证。"
    },
    {
      name: "原型信任测试",
      hypothesis: "当证据、假设和不确定性同时展示时，用户会更愿意信任 AI 建议。",
      method: "使用真实感材料，邀请 6 位用户完成可点击原型测试。",
      successCriteria: "至少 5 位用户能解释 AI 为什么推荐某个下一步。",
      decisionRule: "如果用户无法核验推荐理由，先重做解释体验，再推进更深自动化。"
    },
    {
      name: "礼宾式 MVP",
      hypothesis: "人工复核型 AI 工作流可以降低分析时间，同时不降低决策质量。",
      method: "用 AI 辅助综合和后台人工 QA 跑 3 个真实工作流。",
      successCriteria: "完成时间降低 30%，同时用户信心评分持平或提升。",
      decisionRule: "只有当礼宾式流程可重复，才建设自动化 MVP。"
    }
  ];

  return {
    data: experiments,
    trace: {
      agent: "Data Analyst Agent",
      objective: "设计验证需求、信任和 MVP 可行性的实验。",
      outputSummary: `生成了 ${experiments.length} 个实验，覆盖问题验证、原型信任测试和礼宾式 MVP。`,
      confidence: 85
    }
  };
}
