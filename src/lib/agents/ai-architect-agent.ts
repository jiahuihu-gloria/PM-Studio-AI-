import type { AgentResult } from "./agent-types";
import type { AIArchitectureRecommendation, ProductContext } from "@/lib/domain/product-workspace";

const ragText = {
  yes: "建议使用",
  no: "不建议",
  later: "后续再引入"
};

const agentText = {
  yes: "建议使用",
  no: "不建议",
  limited: "受控使用"
};

export async function runAIArchitectAgent(
  context: ProductContext
): Promise<AgentResult<AIArchitectureRecommendation>> {
  const highRisk = context.riskLevel === "high";
  const architecture: AIArchitectureRecommendation = {
    summary: `建议采用受控的多 Agent 工作流，结合检索增强、结构化抽取和明确的人工复核。${highRisk ? "由于这是高风险场景，AI 应负责辅助、解释和提醒，而不是独立做最终决策。" : "架构可以先轻量启动，在涉及私有知识或动态资料时再加强检索能力。"}`,
    useRag: "yes",
    useAgents: highRisk ? "limited" : "yes",
    humanInLoop: highRisk,
    components: [
      "想法与上下文输入",
      "领域分类器",
      "标准抽取服务",
      "上传资料/来源文档检索层",
      "专家 Agent 运行时",
      "结构化产物生成器",
      "评估与审计日志"
    ],
    dataSources: [
      "用户输入的产品上下文",
      "上传文档或调研笔记",
      "精选领域方法库",
      "竞品与市场调研资料",
      "评估日志和人工编辑记录"
    ],
    guardrails: [
      "事实性结论必须提供来源引用",
      "高风险最终决策必须经过人工复核",
      "标记不确定性和证据缺口",
      "避免把受保护或敏感属性纳入评分",
      "保存提示词和输出，便于审计"
    ],
    evaluationMetrics: [
      "证据 groundedness",
      "无依据断言率",
      "推荐一致性",
      "风险覆盖度",
      "人工覆盖/改写率"
    ]
  };

  return {
    data: architecture,
    trace: {
      agent: "AI Architect Agent",
      objective: "推荐 RAG、Agent、数据流、护栏和评估方式。",
      outputSummary: `RAG：${ragText[architecture.useRag]}；Agent：${agentText[architecture.useAgents]}；人工复核：${architecture.humanInLoop ? "需要" : "可选"}。`,
      confidence: 90
    }
  };
}
