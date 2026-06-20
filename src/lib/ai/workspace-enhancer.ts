import type { ProductWorkspace } from "@/lib/domain/product-workspace";
import { OpenAIJsonClient } from "./openai-client";

interface WorkspaceEnhancement {
  thesis: string;
  positioning: string;
}

export async function enhanceWorkspaceWithOpenAI(
  workspace: ProductWorkspace
): Promise<ProductWorkspace> {
  const ai = new OpenAIJsonClient();
  const fallback: WorkspaceEnhancement = {
    thesis: workspace.thesis,
    positioning: workspace.positioning
  };

  const enhancement = await ai.generateJson<WorkspaceEnhancement>({
    system:
      "你是一位资深 AI 产品经理。只返回严格 JSON，字段为 thesis 和 positioning。请使用简体中文，保持判断克制、具体、可落地，不要夸大。",
    user: JSON.stringify({
      idea: workspace.context.idea,
      domain: workspace.context.domain,
      productType: workspace.context.productType,
      riskLevel: workspace.context.riskLevel,
      targetCustomers: workspace.context.targetCustomers,
      currentThesis: workspace.thesis,
      currentPositioning: workspace.positioning
    }),
    fallback
  });

  return {
    ...workspace,
    thesis: enhancement.thesis || workspace.thesis,
    positioning: enhancement.positioning || workspace.positioning
  };
}
