import type { AgentResult } from "./agent-types";
import type { ProductContext, RiskItem } from "@/lib/domain/product-workspace";

export async function runRiskAgent(context: ProductContext): Promise<AgentResult<RiskItem[]>> {
  const highRisk = context.riskLevel === "high";
  const risks: RiskItem[] = [
    {
      risk: "过度依赖 AI 推荐",
      severity: highRisk ? "high" : "medium",
      whyItMatters: "即使证据不完整，用户也可能把 AI 输出当成权威结论。",
      mitigation: "引入人工确认、置信度标签、来源证据和显式不确定性提示。"
    },
    {
      risk: "无依据或幻觉式结论",
      severity: "high",
      whyItMatters: "如果生成产物包含没有上下文或来源支撑的事实，产品信任会迅速下降。",
      mitigation: "事实性结论必须引用来源，并把 AI 假设与证据明确分开。"
    },
    {
      risk: "工作流不匹配",
      severity: "medium",
      whyItMatters: "即使 AI 能力很强，如果不贴合真实业务流程，也很难被持续使用。",
      mitigation: "先聚焦一个窄工作流，跟踪完成率，并分析用户编辑行为。"
    },
    {
      risk: highRisk ? "监管、公平性或合规风险" : "数据隐私风险",
      severity: highRisk ? "high" : "medium",
      whyItMatters: highRisk
        ? "高风险工作流如果自动化决策且不透明，可能伤害用户并带来法律风险。"
        : "用户提供的文档可能包含敏感业务数据。",
      mitigation: highRisk
        ? "避免自动化最终决策，保留审计日志，并让判断标准可复核。"
        : "使用访问控制、数据留存限制和清晰的数据处理政策。"
    }
  ];

  return {
    data: risks,
    trace: {
      agent: "QA Agent",
      objective: "识别法律、伦理、UX 和商业风险，并给出缓解措施。",
      outputSummary: `识别了 ${risks.length} 项风险，其中 ${risks.filter((risk) => risk.severity === "high").length} 项为高风险。`,
      confidence: 89
    }
  };
}
