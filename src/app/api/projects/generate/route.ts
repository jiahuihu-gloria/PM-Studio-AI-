import { NextResponse } from "next/server";
import { z } from "zod";
import { generateProductWorkspace } from "@/lib/agents/orchestrator";
import { enhanceWorkspaceWithOpenAI } from "@/lib/ai/workspace-enhancer";
import { InMemoryProjectRepository } from "@/lib/storage/project-repository";

const GenerateSchema = z.object({
  idea: z.string().min(4, "请至少用一句话描述你的产品想法。").max(500)
});

const repository = new InMemoryProjectRepository();

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = GenerateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "产品想法无效",
        issues: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const generated = await generateProductWorkspace(parsed.data.idea);
  const enhanced = await enhanceWorkspaceWithOpenAI(generated);
  const saved = await repository.save(enhanced);

  return NextResponse.json({ workspace: saved });
}
