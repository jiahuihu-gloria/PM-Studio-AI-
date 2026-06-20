import { clampScore } from "@/lib/domain/frameworks";
import type { AgentResult } from "./agent-types";
import type { EvaluationScore, ProductWorkspace } from "@/lib/domain/product-workspace";

export async function runEvaluationAgent(
  workspace: Omit<ProductWorkspace, "evaluation">
): Promise<AgentResult<EvaluationScore[]>> {
  const hasHumanLoop = workspace.architecture.humanInLoop;
  const riskCoverage = workspace.risks.length >= 4 ? 90 : 72;
  const artifactDepth = workspace.userStories.length >= 3 && workspace.experiments.length >= 3 ? 88 : 76;
  const aiFit = workspace.architecture.useRag === "yes" ? 91 : 78;
  const mvpDiscipline = workspace.mvp.excluded.length >= 3 ? 89 : 74;

  const scores: EvaluationScore[] = [
    {
      label: "PM 完整度",
      score: clampScore(artifactDepth),
      finding: "核心 PM 产物均来自同一个产品上下文，避免各模块各说各话。"
    },
    {
      label: "AI 架构匹配度",
      score: clampScore(aiFit),
      finding: "RAG、Agent、护栏和评估方式与产品风险画像保持一致。"
    },
    {
      label: "风险覆盖度",
      score: clampScore(hasHumanLoop ? riskCoverage + 4 : riskCoverage),
      finding: hasHumanLoop
        ? "高风险工作流已包含人工复核和可审计性设计。"
        : "已覆盖主要风险缓解措施，该类别可将人工复核设为可选。"
    },
    {
      label: "MVP 克制度",
      score: clampScore(mvpDiscipline),
      finding: "MVP 在获得验证数据前排除了高复杂度或高风险功能。"
    }
  ];

  return {
    data: scores,
    trace: {
      agent: "QA Agent",
      objective: "评估工作区的 PM 质量、AI 匹配度、风险覆盖和 MVP 现实性。",
      outputSummary: `生成了 ${scores.length} 项质量评分，平均分为 ${Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length)}。`,
      confidence: 86
    }
  };
}
