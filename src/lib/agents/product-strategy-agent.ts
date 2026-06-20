import type { AgentResult } from "./agent-types";
import type { KPISet, MVPRecommendation, PRD, ProductContext, ProductWorkflowStep } from "@/lib/domain/product-workspace";

export async function runProductStrategyAgent(
  context: ProductContext
): Promise<AgentResult<{ prd: PRD; workflow: ProductWorkflowStep[]; mvp: MVPRecommendation; kpis: KPISet }>> {
  const workflow: ProductWorkflowStep[] = [
    { title: "创建工作区", description: "用户发起新的产品或决策工作流，并明确目标。", owner: "User" },
    { title: "提供上下文", description: "用户上传或输入判断标准、原始材料和限制条件。", owner: "User" },
    { title: "提取标准", description: "AI 将零散输入转成结构化标准和关键假设。", owner: "AI" },
    { title: "复核标准", description: "人工复核者在分析前编辑和确认标准。", owner: "Human reviewer" },
    { title: "生成建议", description: "AI 生成带排序、引用和不确定性提示的建议。", owner: "AI" },
    { title: "打包决策", description: "系统生成可分享的简报、审计记录和下一步计划。", owner: "System" }
  ];

  const prd: PRD = {
    problem: `计划使用${context.productType}的团队，需要一种可靠方式把混乱输入转成可解释建议，同时不丢失人的专业判断。`,
    goals: [
      "减少重复分析耗时",
      "提升推荐结果的一致性和可解释性",
      "让第一版 MVP 足够安全，能够进入真实用户测试"
    ],
    nonGoals: [
      "完全自动化最终决策",
      "第一版就做深度企业系统集成",
      "替代专家或业务人员的最终判断"
    ],
    functionalRequirements: [
      "接收任务目标和相关原始材料",
      "从用户提供的上下文中提取结构化标准",
      "生成带证据和不确定性标签的建议",
      "允许用户在输出定稿前编辑假设",
      "导出决策简报"
    ],
    aiRequirements: [
      "在存在原始材料时，事实性判断必须基于上下文",
      "区分证据和推断",
      "标记缺失、冲突或低置信度信息",
      "记录模型输入和输出，用于评估"
    ],
    uxRequirements: [
      "让用户看见 AI 每一步在做什么",
      "推荐结果必须易扫读、可编辑",
      "对高风险决策给出醒目提醒，但不阻断探索"
    ],
    openQuestions: [
      "哪个首批客户群的需求最紧迫？",
      "MVP 必须接入哪些数据来源或系统？",
      "用户愿意信任该流程前，需要达到怎样的准确率或质量阈值？"
    ]
  };

  const mvp: MVPRecommendation = {
    scope: `一个聚焦的人工复核型${context.productType} MVP：基于用户确认的标准生成可解释建议。`,
    included: [
      "一句话项目输入",
      "标准提取与编辑",
      "基于证据的建议生成",
      "风险与不确定性标签",
      "可导出的决策简报"
    ],
    excluded: [
      "自动化最终决策",
      "复杂企业权限体系",
      "超出基础导入/导出的原生集成",
      "在缺少标注数据前进行模型微调"
    ],
    firstMilestone: "验证目标用户是否会在一个窄工作流中信任并复用证据支撑的建议。"
  };

  const kpis: KPISet = {
    product: ["首次获得可用建议的时间", "工作流完成率", "用户信任评分", "重复创建项目率"],
    aiQuality: ["证据引用准确率", "无依据断言率", "标准提取准确率", "人工编辑率"],
    business: ["激活率", "试用转付费率", "周活跃团队数", "可扩展客户信号"]
  };

  return {
    data: { prd, workflow, mvp, kpis },
    trace: {
      agent: "PM Agent",
      objective: "生成 PRD、产品流程、MVP 边界和成功指标。",
      outputSummary: "定义了人工复核型 MVP，并拆分出产品、AI 质量和商业指标。",
      confidence: 87
    }
  };
}
