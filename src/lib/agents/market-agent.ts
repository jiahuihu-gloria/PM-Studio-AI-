import type { AgentResult } from "./agent-types";
import type { CompetitorInsight, ProductContext } from "@/lib/domain/product-workspace";

export async function runMarketAgent(context: ProductContext): Promise<AgentResult<CompetitorInsight[]>> {
  const isHiring = context.domain === "HR 科技";
  const competitors: CompetitorInsight[] = isHiring
    ? [
        {
          category: "带 AI 筛选能力的 ATS 平台",
          examples: ["Greenhouse", "Lever", "Workday Recruiting"],
          gap: "AI 推荐通常嵌在复杂 ATS 工作流里，解释性和可控性不足。",
          differentiation: "定位为进入 ATS 前的透明筛选层，强调证据、复核和可审计。"
        },
        {
          category: "简历解析与匹配 API",
          examples: ["Sovren", "RChilli", "Textkernel"],
          gap: "解析能力只解决数据结构化，并不能解决招聘者信任、流程复核和决策包装。",
          differentiation: "占据完整工作流：标准确认、证据映射、风险提示和候选名单理由。"
        },
        {
          category: "招聘自动化工具",
          examples: ["hireEZ", "Eightfold", "SeekOut"],
          gap: "很多工具优化寻访和匹配，但以合规和解释为中心的筛选体验仍有空间。",
          differentiation: "从人工复核的筛选质量控制切入，而不是一开始做自动化招聘决策。"
        }
      ]
    : [
        {
          category: "通用 AI Copilot",
          examples: ["ChatGPT", "Claude", "Gemini"],
          gap: "通用工具能生成草稿，但不会约束领域流程、评估标准和业务指标。",
          differentiation: "构建专用工作流：结构化输出、状态管理和可衡量的业务结果。"
        },
        {
          category: "垂直 SaaS 存量平台",
          examples: ["垂直行业平台", "工作流套件", "传统系统"],
          gap: "存量平台有数据入口，但 AI 原生体验和快速迭代可能较慢。",
          differentiation: "通过聚焦的 AI 工作流设计、更快迭代和显式质量控制建立优势。"
        }
      ];

  return {
    data: competitors,
    trace: {
      agent: "Research Agent",
      objective: "梳理竞品类别，并找到可防守的切入点。",
      outputSummary: `识别了 ${competitors.length} 类竞品与对应差异化机会。`,
      confidence: isHiring ? 82 : 75
    }
  };
}
