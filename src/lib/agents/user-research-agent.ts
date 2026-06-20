import type { AgentResult } from "./agent-types";
import type { Persona, ProductContext, ProductWorkflowStep, UserStory } from "@/lib/domain/product-workspace";

export async function runUserResearchAgent(
  context: ProductContext
): Promise<AgentResult<{ personas: Persona[]; stories: UserStory[]; journey: ProductWorkflowStep[] }>> {
  const isHiring = context.domain === "HR 科技";
  const personas: Persona[] = isHiring
    ? [
        {
          name: "林悦",
          role: "招聘专员",
          jobToBeDone: "在高简历量场景下快速筛选候选人，并形成可信的候选名单。",
          painPoints: ["人工看简历耗时长", "不同面试官的筛选标准不一致", "候选人推荐理由难以解释"],
          successCriteria: ["筛选时间明显下降", "候选名单理由清晰", "用人经理愿意信任输出"]
        },
        {
          name: "周明",
          role: "用人经理",
          jobToBeDone: "不必逐份阅读简历，也能理解候选人为什么值得进入面试。",
          painPoints: ["候选名单缺少证据", "关键资质容易被漏看", "面试前团队对标准理解不一致"],
          successCriteria: ["收到有证据支撑的候选摘要", "能一致地比较候选人", "低匹配面试减少"]
        },
        {
          name: "陈岚",
          role: "HR 运营管理员",
          jobToBeDone: "让筛选流程保持一致、可审计，并尽量降低合规风险。",
          painPoints: ["筛选决策不透明", "标准执行不一致", "偏见风险难以监控"],
          successCriteria: ["存在审计记录", "筛选标准经过人工确认", "风险提示清晰可见"]
        }
      ]
    : context.likelyUsers.slice(0, 3).map((role, index) => ({
        name: ["林安", "苏禾", "江远"][index] ?? "许然",
        role,
        jobToBeDone: `使用${context.productType}完成一个高频工作流，减少人工重复劳动并提升判断质量。`,
        painPoints: ["工作信息分散", "决策理由难以解释", "人工复核耗时太长"],
        successCriteria: ["处理效率提升", "推荐理由更清晰", "决策信心更高"]
      }));

  const stories: UserStory[] = [
    {
      persona: personas[0].role,
      story: `作为${personas[0].role}，我希望在 AI 分析前先确认任务标准，以便推荐结果贴合真实业务流程。`,
      priority: "P0",
      acceptanceCriteria: ["标准可以被编辑", "AI 展示标准如何影响输出", "修改后会更新最终建议"]
    },
    {
      persona: personas[0].role,
      story: `作为${personas[0].role}，我希望每条 AI 建议都附带证据，以便快速核验。`,
      priority: "P0",
      acceptanceCriteria: ["每条建议都有引用证据", "缺失证据会被明确标注", "无依据的断言会被阻止"]
    },
    {
      persona: personas[1].role,
      story: `作为${personas[1].role}，我希望看到简洁的决策摘要，以便不用逐条阅读原始材料也能行动。`,
      priority: "P1",
      acceptanceCriteria: ["摘要能在一屏内读完", "关键取舍清晰可见", "未决问题被列出"]
    }
  ];

  const journey: ProductWorkflowStep[] = [
    { title: "触发", description: "用户遇到高频或高风险的判断型工作流。", owner: "User" },
    { title: "配置", description: "用户提供任务背景、判断标准和原始材料。", owner: "User" },
    { title: "AI 分析", description: "系统提取证据，对照标准，并标记不确定性。", owner: "AI" },
    { title: "人工复核", description: "用户审阅推荐、修改假设，并确认下一步。", owner: "Human reviewer" },
    { title: "决策包", description: "系统生成可分享、可审计的决策摘要。", owner: "System" }
  ];

  return {
    data: { personas, stories, journey },
    trace: {
      agent: "UX Agent",
      objective: "识别目标用户、JTBD、用户故事和关键旅程。",
      outputSummary: `生成了 ${personas.length} 个用户画像和 ${stories.length} 条优先级用户故事。`,
      confidence: 88
    }
  };
}
