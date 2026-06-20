import { inferDomain, inferRiskLevel } from "@/lib/domain/frameworks";
import type { AgentResult } from "./agent-types";
import type { ProductContext } from "@/lib/domain/product-workspace";

const riskText = {
  low: "低风险",
  medium: "中风险",
  high: "高风险"
};

export async function runIntakeAgent(idea: string): Promise<AgentResult<ProductContext>> {
  const inferred = inferDomain(idea);
  const riskLevel = inferRiskLevel(idea);

  const context: ProductContext = {
    idea,
    domain: inferred.domain,
    productType: inferred.productType,
    riskLevel,
    targetCustomers: inferred.targetCustomers,
    likelyUsers: inferred.likelyUsers,
    assumptions: [
      "产品应先从辅助决策工作流切入，而不是直接自动化最终决策。",
      "第一版必须证明清晰的效率或质量提升。",
      "AI 生成的建议必须可解释、可编辑、可追溯。"
    ],
    clarificationQuestions: [
      {
        id: "first-customer",
        question: "这个产品最先应该赢下哪类客户？",
        whyItMatters: "首个客户群会决定工作流深度、合规要求和付费意愿。",
        options: inferred.targetCustomers,
        recommendedOption: inferred.targetCustomers[0]
      },
      {
        id: "ai-authority",
        question: "AI 在流程中应该拥有多大决策权限？",
        whyItMatters: "AI 权限会直接影响风险、信任、交互体验和合规边界。",
        options: ["只提供辅助建议", "给出推荐但必须人工复核", "自动完成决策"],
        recommendedOption: riskLevel === "high" ? "给出推荐但必须人工复核" : "只提供辅助建议"
      },
      {
        id: "primary-outcome",
        question: "MVP 最应该优化哪一个核心业务结果？",
        whyItMatters: "好的 MVP 需要一个能指导取舍的北极星指标。",
        options: ["节省时间", "提升决策质量", "提高转化率", "降低运营风险"],
        recommendedOption: "提升决策质量"
      }
    ]
  };

  return {
    data: context,
    trace: {
      agent: "PM Agent",
      objective: "把一句话想法转成结构化产品上下文。",
      outputSummary: `识别到领域为${context.domain}，产品类型为${context.productType}，风险等级为${riskText[context.riskLevel]}。`,
      confidence: riskLevel === "high" ? 91 : 84
    }
  };
}
