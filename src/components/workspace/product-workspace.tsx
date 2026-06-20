"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Database,
  Download,
  FileText,
  Flag,
  Layers3,
  LineChart,
  Loader2,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users
} from "lucide-react";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { ScoreRing } from "@/components/workspace/score-ring";
import type {
  AgentName,
  ProductWorkflowStep,
  ProductWorkspace as ProductWorkspaceType,
  RiskLevel,
  WorkspaceSection
} from "@/lib/domain/product-workspace";
import { cn } from "@/lib/utils";

const defaultIdea = "我想做一个 AI 简历筛选产品。";

const tabs: { id: WorkspaceSection; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "概览", icon: Target },
  { id: "prd", label: "PRD", icon: FileText },
  { id: "users", label: "用户", icon: Users },
  { id: "stories", label: "故事", icon: ClipboardList },
  { id: "workflow", label: "流程", icon: Network },
  { id: "architecture", label: "AI 架构", icon: BrainCircuit },
  { id: "competitors", label: "市场", icon: Layers3 },
  { id: "mvp", label: "MVP", icon: Flag },
  { id: "kpis", label: "指标", icon: LineChart },
  { id: "experiments", label: "实验", icon: Sparkles },
  { id: "risks", label: "风险", icon: ShieldCheck },
  { id: "evaluation", label: "评估", icon: CheckCircle2 }
];

const agentSteps: {
  agent: AgentName;
  label: string;
  short: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { agent: "PM Agent", label: "PM Agent", short: "产品定义", icon: Target },
  { agent: "Research Agent", label: "Research Agent", short: "市场研究", icon: Search },
  { agent: "UX Agent", label: "UX Agent", short: "用户体验", icon: Users },
  { agent: "AI Architect Agent", label: "AI Architect Agent", short: "AI 架构", icon: BrainCircuit },
  { agent: "Data Analyst Agent", label: "Data Analyst Agent", short: "数据指标", icon: Database },
  { agent: "QA Agent", label: "QA Agent", short: "质量风控", icon: ShieldCheck }
];

const riskLabel: Record<RiskLevel, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险"
};

const ownerLabel: Record<ProductWorkflowStep["owner"], string> = {
  User: "用户",
  AI: "AI",
  System: "系统",
  "Human reviewer": "人工复核"
};

const decisionLabel = {
  yes: "建议使用",
  no: "不建议",
  later: "后续引入",
  limited: "受控使用",
  required: "必须",
  optional: "可选"
};

type SectionMeta = {
  title: string;
  decisionQuestion: string;
  portfolioSignal: string;
  reviewCriteria: string[];
};

const sectionMeta: Record<WorkspaceSection, SectionMeta> = {
  overview: {
    title: "Strategy Brief",
    decisionQuestion: "这个产品为什么值得做，第一批客户是谁，为什么现在切入？",
    portfolioSignal: "展示产品战略、客户选择、问题 framing 和 MVP wedge 判断。",
    reviewCriteria: ["目标客户是否聚焦", "产品主张是否可防守", "MVP 是否服务于核心学习"]
  },
  prd: {
    title: "PRD",
    decisionQuestion: "团队是否能基于这份 PRD 对齐范围、目标、非目标和 AI 行为边界？",
    portfolioSignal: "展示需求拆解、范围克制、AI 行为规范和跨职能沟通能力。",
    reviewCriteria: ["目标和非目标是否清晰", "AI 需求是否可验证", "开放问题是否影响决策"]
  },
  users: {
    title: "User Model",
    decisionQuestion: "用户是谁，他们的真实工作任务和成功标准是什么？",
    portfolioSignal: "展示用户研究、JTBD、角色拆分和购买/使用者区分能力。",
    reviewCriteria: ["Persona 是否贴近业务场景", "痛点是否高频且有代价", "成功标准是否可衡量"]
  },
  stories: {
    title: "User Stories",
    decisionQuestion: "工程和设计是否能从用户故事直接理解优先级和验收标准？",
    portfolioSignal: "展示从用户需求到可交付范围的转译能力。",
    reviewCriteria: ["故事是否围绕真实任务", "P0 是否支撑 MVP", "验收标准是否具体"]
  },
  workflow: {
    title: "Product Workflow",
    decisionQuestion: "AI 应该嵌入到哪个业务环节，哪里必须保留人工控制？",
    portfolioSignal: "展示端到端流程设计、责任边界和人机协作判断。",
    reviewCriteria: ["流程是否闭环", "AI/人工/系统职责是否清楚", "高风险节点是否可审计"]
  },
  architecture: {
    title: "AI Architecture",
    decisionQuestion: "这个产品应该用 RAG、Agent、规则、评估还是人工复核，为什么？",
    portfolioSignal: "展示 AI 产品架构判断、数据依赖、护栏设计和评估意识。",
    reviewCriteria: ["架构是否匹配风险", "RAG/Agent 决策是否有理由", "评估指标是否覆盖质量风险"]
  },
  competitors: {
    title: "Market Map",
    decisionQuestion: "这个产品在市场里如何定位，差异化为什么成立？",
    portfolioSignal: "展示竞品分层、市场缺口识别和 positioning 能力。",
    reviewCriteria: ["竞品类别是否正确", "差异化是否具体", "切入点是否可防守"]
  },
  mvp: {
    title: "MVP Scope",
    decisionQuestion: "第一版应该证明什么，不应该做什么？",
    portfolioSignal: "展示 MVP 克制、学习目标、范围取舍和执行现实感。",
    reviewCriteria: ["范围是否足够窄", "排除项是否合理", "首个里程碑是否能验证核心假设"]
  },
  kpis: {
    title: "Metrics",
    decisionQuestion: "如何同时衡量产品价值、AI 质量和商业结果？",
    portfolioSignal: "展示数据指标设计、质量度量和业务闭环能力。",
    reviewCriteria: ["是否区分产品/AI/商业指标", "指标是否可采集", "是否能指导迭代决策"]
  },
  experiments: {
    title: "Experiment Plan",
    decisionQuestion: "在投入工程资源前，如何低成本验证需求、信任和可行性？",
    portfolioSignal: "展示实验设计、假设验证、决策规则和学习速度。",
    reviewCriteria: ["假设是否可证伪", "成功标准是否明确", "实验是否低成本且能指导下一步"]
  },
  risks: {
    title: "Risk Review",
    decisionQuestion: "这个 AI 产品最可能在哪里伤害用户、业务或信任？如何缓解？",
    portfolioSignal: "展示 AI 安全、合规、公平性、信任和业务风险判断。",
    reviewCriteria: ["高风险是否被正视", "缓解措施是否产品化", "是否避免过度自动化"]
  },
  evaluation: {
    title: "Evaluation",
    decisionQuestion: "如何判断 AI 产物是否足够可靠，可以进入用户测试？",
    portfolioSignal: "展示 AI 评估体系、质量门禁和 PM 自我校验能力。",
    reviewCriteria: ["评估维度是否覆盖 PM 质量", "是否覆盖 AI groundedness", "评分是否能驱动改进"]
  }
};

export function ProductWorkspace() {
  const [idea, setIdea] = useState(defaultIdea);
  const [workspace, setWorkspace] = useState<ProductWorkspaceType | null>(null);
  const [activeTab, setActiveTab] = useState<WorkspaceSection>("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateWorkspace() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "无法生成工作区");
      }

      setWorkspace(payload.workspace);
      setActiveTab("overview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成时出现问题");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-ink">
      <div className="grid min-h-screen lg:grid-cols-[248px_minmax(0,1fr)]">
        <AppSidebar workspace={workspace} activeTab={activeTab} setActiveTab={setActiveTab} />
        <section className="min-w-0 border-l border-line bg-[#fbfcfe]">
          <WorkspaceHeader workspace={workspace} />
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6">
            <CommandBar
              idea={idea}
              setIdea={setIdea}
              onGenerate={generateWorkspace}
              isLoading={isLoading}
              error={error}
            />
            {workspace ? (
              <WorkspaceDashboard workspace={workspace} activeTab={activeTab} setActiveTab={setActiveTab} />
            ) : (
              <LaunchDashboard isLoading={isLoading} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function AppSidebar({
  workspace,
  activeTab,
  setActiveTab
}: {
  workspace: ProductWorkspaceType | null;
  activeTab: WorkspaceSection;
  setActiveTab: (tab: WorkspaceSection) => void;
}) {
  return (
    <aside className="hidden min-h-screen border-r border-line bg-white lg:flex lg:flex-col">
      <div className="border-b border-line px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-ink text-white">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink">PM Studio AI</p>
            <p className="text-xs text-muted">Enterprise AI Workspace</p>
          </div>
        </div>
      </div>

      <div className="border-b border-line px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">当前项目</p>
        <h2 className="mt-2 line-clamp-2 text-sm font-semibold text-ink">
          {workspace?.title ?? "等待产品想法"}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone={workspace?.context.riskLevel === "high" ? "red" : "blue"}>
            {workspace ? riskLabel[workspace.context.riskLevel] : "未生成"}
          </Badge>
          <Badge tone="teal">多 Agent</Badge>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              disabled={!workspace}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition",
                activeTab === tab.id && workspace
                  ? "bg-ink text-white"
                  : "text-slate-600 hover:bg-cloud hover:text-ink",
                !workspace && "cursor-not-allowed opacity-45"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-line p-4">
        <p className="text-xs leading-5 text-slate-500">
          面向作品集展示的 AI 产品管理系统：策略、研究、体验、架构、数据和 QA 由同一条工作流驱动。
        </p>
      </div>
    </aside>
  );
}

function WorkspaceHeader({ workspace }: { workspace: ProductWorkspaceType | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">AI 产品经理工作台</p>
          <h1 className="truncate text-sm font-semibold text-ink">
            {workspace ? workspace.title : "从一句话启动一条可审计的产品策略流程"}
          </h1>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Badge tone="blue">Dashboard-based</Badge>
          <Badge tone="teal">Visual workflow</Badge>
          <Badge>Enterprise-ready</Badge>
        </div>
      </div>
    </header>
  );
}

function CommandBar({
  idea,
  setIdea,
  onGenerate,
  isLoading,
  error
}: {
  idea: string;
  setIdea: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="grid gap-4 p-4 xl:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Badge tone="blue">Idea intake</Badge>
            <Badge tone="teal">结构化工作台</Badge>
            <Badge>Structured output</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <textarea
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              className="min-h-[76px] resize-none rounded-md border border-line bg-cloud px-3 py-3 text-sm outline-none transition focus:border-cobalt focus:bg-white focus:ring-4 focus:ring-blue-100"
              aria-label="产品想法"
            />
            <button
              type="button"
              onClick={onGenerate}
              disabled={isLoading}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              运行工作流
            </button>
          </div>
          {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
        </div>
        <div className="rounded-md border border-line bg-cloud px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">运行模式</p>
          <div className="mt-2 space-y-1">
            {agentSteps.map((step, index) => (
              <div key={step.agent}>
                <p className="text-sm font-semibold text-ink">{step.label}</p>
                {index < agentSteps.length - 1 ? <p className="text-xs text-muted">↓</p> : null}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-600">
            每个 Agent 输出结构化产物，并进入下游模块，形成可追溯的企业级产品决策链路。
          </p>
        </div>
      </div>
    </Panel>
  );
}

function LaunchDashboard({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Panel>
        <PanelHeader title="可视化 Agent 工作流" eyebrow="从想法到产品决策" />
        <div className="p-5">
          <AgentPipeline traces={[]} isLoading={isLoading} />
        </div>
      </Panel>
      <Panel>
        <PanelHeader title="工作区会生成什么" eyebrow="核心产物" />
        <div className="grid gap-3 p-4">
          {[
            ["产品定义", "PRD、MVP、非目标、关键假设"],
            ["研究洞察", "目标用户、竞品类别、差异化机会"],
            ["AI 系统", "RAG、Agent、数据流、护栏、评估"],
            ["经营指标", "产品指标、AI 质量指标、商业指标"],
            ["风险控制", "合规、信任、安全、QA 评分"]
          ].map(([title, copy]) => (
            <div key={title} className="rounded-md border border-line bg-white p-3">
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel className="xl:col-span-2">
        <PanelHeader title="企业级工作台结构" eyebrow="Workspace operating model" />
        <div className="grid gap-3 p-5 md:grid-cols-4">
          <LaunchMetric label="Artifact modules" value="12" copy="PRD、用户、流程、架构、风险等模块化产物" />
          <LaunchMetric label="Agent stages" value="6" copy="产品、研究、体验、架构、数据、QA 串联执行" />
          <LaunchMetric label="Quality gates" value="4" copy="完整度、架构匹配、风险覆盖、MVP 克制度" />
          <LaunchMetric label="Export format" value="MD" copy="生成中文产品简报，可用于作品集展示" />
        </div>
      </Panel>
      <Panel className="xl:col-span-2">
        <PanelHeader title="FAANG / Top AI PM 面试展示点" eyebrow="Portfolio review lens" />
        <div className="grid gap-3 p-5 md:grid-cols-3">
          <InterviewLens
            title="产品判断"
            copy="从模糊想法中识别客户、问题、MVP wedge、非目标和可验证假设。"
          />
          <InterviewLens
            title="AI 产品架构"
            copy="明确 RAG、Agent、人工复核、数据来源和评估指标之间的取舍。"
          />
          <InterviewLens
            title="商业闭环"
            copy="把用户价值、AI 质量、风险治理和业务指标连接成可执行 roadmap。"
          />
        </div>
      </Panel>
    </div>
  );
}

function WorkspaceDashboard({
  workspace,
  activeTab,
  setActiveTab
}: {
  workspace: ProductWorkspaceType;
  activeTab: WorkspaceSection;
  setActiveTab: (tab: WorkspaceSection) => void;
}) {
  const averageScore = useMemo(
    () => Math.round(workspace.evaluation.reduce((sum, item) => sum + item.score, 0) / workspace.evaluation.length),
    [workspace.evaluation]
  );

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_220px]">
        <Panel className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">产品主张</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{workspace.thesis}</p>
        </Panel>
        <StatPanel label="PM 质量评分" value={`${averageScore}`} icon={BarChart3} />
        <StatPanel label="风险等级" value={riskLabel[workspace.context.riskLevel]} icon={ShieldCheck} />
        <StatPanel label="Agent 阶段" value={`${workspace.agentTraces.length}/6`} icon={Network} />
      </div>

      <InterviewScoreboard workspace={workspace} />

      <Panel>
        <PanelHeader title="Agent Pipeline" eyebrow="Sequential multi-agent workflow" />
        <div className="p-5">
          <AgentPipeline traces={workspace.agentTraces} />
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <WorkspaceContent workspace={workspace} activeTab={activeTab} />
        <ArtifactRail workspace={workspace} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

function AgentPipeline({
  traces,
  isLoading = false
}: {
  traces: ProductWorkspaceType["agentTraces"];
  isLoading?: boolean;
}) {
  const traceByAgent = new Map(traces.map((trace) => [trace.agent, trace]));

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-2">
      {agentSteps.map((step, index) => {
        const trace = traceByAgent.get(step.agent);
        const Icon = step.icon;
        const isDone = Boolean(trace);

        return (
          <div key={step.agent}>
            <div
              className={cn(
                "grid gap-4 rounded-md border p-4 transition md:grid-cols-[56px_1fr_88px]",
                isDone ? "border-slate-300 bg-white" : "border-line bg-cloud",
                isLoading && !isDone && "animate-pulse"
              )}
            >
              <div className="flex items-center gap-3 md:block">
                <div className={cn("grid h-11 w-11 place-items-center rounded-md", isDone ? "bg-ink text-white" : "bg-white text-muted")}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-ink">{step.label}</p>
                  <Badge tone={isDone ? "teal" : "neutral"}>{step.short}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {trace?.outputSummary ?? "等待上游 Agent 输出结构化上下文。"}
                </p>
              </div>
              <div className="flex items-center md:justify-end">
                {trace ? <span className="text-sm font-bold text-teal">{trace.confidence}%</span> : <span className="text-xs text-muted">待运行</span>}
              </div>
            </div>
            {index < agentSteps.length - 1 ? (
              <div className="flex h-7 items-center justify-center text-muted">
                <ArrowDown className="h-4 w-4" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function InterviewScoreboard({ workspace }: { workspace: ProductWorkspaceType }) {
  return (
    <Panel>
      <PanelHeader title="面试作品集信号" eyebrow="What this case demonstrates" />
      <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
        <PortfolioSignal
          label="战略清晰度"
          value="首批客户 + MVP wedge"
          copy={`目标客户聚焦在${workspace.context.targetCustomers[0]}，避免泛化成通用 AI 工具。`}
        />
        <PortfolioSignal
          label="AI 判断力"
          value={`${decisionLabel[workspace.architecture.useRag]} RAG / ${decisionLabel[workspace.architecture.useAgents]} Agent`}
          copy="架构推荐基于任务风险、证据 grounding 和人工复核要求。"
        />
        <PortfolioSignal
          label="验证意识"
          value={`${workspace.experiments.length} 个实验`}
          copy="从问题验证、原型信任测试到礼宾式 MVP，降低工程投入前的不确定性。"
        />
        <PortfolioSignal
          label="风险治理"
          value={`${workspace.risks.filter((risk) => risk.severity === "high").length} 个高风险`}
          copy="把合规、幻觉、过度自动化和工作流错配显式纳入产品设计。"
        />
      </div>
    </Panel>
  );
}

function WorkspaceContent({ workspace, activeTab }: { workspace: ProductWorkspaceType; activeTab: WorkspaceSection }) {
  const meta = sectionMeta[activeTab];

  return (
    <div className="min-w-0">
      <ArtifactPageShell meta={meta}>
        {activeTab === "overview" && <Overview workspace={workspace} />}
        {activeTab === "prd" && <PRDView workspace={workspace} />}
        {activeTab === "users" && <UsersView workspace={workspace} />}
        {activeTab === "stories" && <StoriesView workspace={workspace} />}
        {activeTab === "workflow" && <FlowView title="产品工作流" items={workspace.workflow} />}
        {activeTab === "architecture" && <ArchitectureView workspace={workspace} />}
        {activeTab === "competitors" && <CompetitorView workspace={workspace} />}
        {activeTab === "mvp" && <MVPView workspace={workspace} />}
        {activeTab === "kpis" && <KPIView workspace={workspace} />}
        {activeTab === "experiments" && <ExperimentView workspace={workspace} />}
        {activeTab === "risks" && <RiskView workspace={workspace} />}
        {activeTab === "evaluation" && <EvaluationView workspace={workspace} />}
      </ArtifactPageShell>
    </div>
  );
}

function ArtifactPageShell({ meta, children }: { meta: SectionMeta; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <Panel className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="border-b border-line p-5 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">Portfolio artifact</Badge>
              <Badge tone="teal">Interview-ready</Badge>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-ink">{meta.title}</h2>
            <p className="mt-3 text-sm font-semibold text-slate-700">{meta.decisionQuestion}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{meta.portfolioSignal}</p>
          </div>
          <div className="bg-cloud p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">面试官会看什么</p>
            <ul className="mt-3 space-y-2">
              {meta.reviewCriteria.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-5 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>
      {children}
    </div>
  );
}

function ArtifactRail({
  workspace,
  activeTab,
  setActiveTab
}: {
  workspace: ProductWorkspaceType;
  activeTab: WorkspaceSection;
  setActiveTab: (tab: WorkspaceSection) => void;
}) {
  return (
    <aside className="space-y-4">
      <Panel>
        <PanelHeader title="产物目录" eyebrow="Artifacts" action={<ExportButton workspace={workspace} />} />
        <div className="grid gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm transition",
                  activeTab === tab.id ? "bg-ink text-white" : "text-slate-600 hover:bg-cloud hover:text-ink"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </Panel>
      <Panel className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">治理状态</p>
        <div className="mt-3 space-y-3">
          <GovernanceItem label="人工复核" value={workspace.architecture.humanInLoop ? "必须" : "可选"} />
          <GovernanceItem label="RAG" value={decisionLabel[workspace.architecture.useRag]} />
          <GovernanceItem label="Agent" value={decisionLabel[workspace.architecture.useAgents]} />
          <GovernanceItem label="风险项" value={`${workspace.risks.length} 项`} />
        </div>
      </Panel>
    </aside>
  );
}

function Overview({ workspace }: { workspace: ProductWorkspaceType }) {
  return (
    <div className="grid gap-5">
      <Panel>
        <PanelHeader title="产品策略概览" eyebrow={workspace.context.domain} />
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <KeyValue label="产品类型" value={workspace.context.productType} />
            <KeyValue label="定位" value={workspace.positioning} />
            <KeyValue label="MVP 主张" value={workspace.mvp.scope} />
          </div>
          <div className="rounded-md border border-line bg-cloud p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">目标客户</p>
            <div className="mt-3 grid gap-2">
              {workspace.context.targetCustomers.map((customer) => (
                <div key={customer} className="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700">
                  {customer}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
      <Panel>
        <PanelHeader title="智能澄清" eyebrow="最高杠杆问题" />
        <div className="grid gap-3 p-4 lg:grid-cols-3">
          {workspace.context.clarificationQuestions.map((question) => (
            <div key={question.id} className="rounded-md border border-line p-3">
              <p className="text-sm font-semibold text-ink">{question.question}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{question.whyItMatters}</p>
              <div className="mt-3">
                <Badge tone="blue">{question.recommendedOption}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function PRDView({ workspace }: { workspace: ProductWorkspaceType }) {
  const prd = workspace.prd;
  return (
    <Panel>
      <PanelHeader title="产品需求文档" eyebrow="结构化 PRD" action={<ExportButton workspace={workspace} />} />
      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <KeyValue label="问题" value={prd.problem} />
        <ListBlock title="目标" items={prd.goals} />
        <ListBlock title="非目标" items={prd.nonGoals} />
        <ListBlock title="功能需求" items={prd.functionalRequirements} />
        <ListBlock title="AI 需求" items={prd.aiRequirements} />
        <ListBlock title="体验需求" items={prd.uxRequirements} />
        <ListBlock title="待澄清问题" items={prd.openQuestions} />
      </div>
    </Panel>
  );
}

function UsersView({ workspace }: { workspace: ProductWorkspaceType }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {workspace.personas.map((persona) => (
        <Panel key={persona.name} className="p-5">
          <Badge tone="teal">{persona.role}</Badge>
          <h2 className="mt-4 text-xl font-bold text-ink">{persona.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{persona.jobToBeDone}</p>
          <ListBlock title="痛点" items={persona.painPoints} compact />
          <ListBlock title="成功标准" items={persona.successCriteria} compact />
        </Panel>
      ))}
    </div>
  );
}

function StoriesView({ workspace }: { workspace: ProductWorkspaceType }) {
  return (
    <Panel>
      <PanelHeader title="用户故事" eyebrow="按工作流风险排序" />
      <div className="divide-y divide-line">
        {workspace.userStories.map((story) => (
          <div key={story.story} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={story.priority === "P0" ? "red" : "blue"}>{story.priority}</Badge>
              <Badge>{story.persona}</Badge>
            </div>
            <p className="mt-3 text-base font-semibold text-ink">{story.story}</p>
            <ListBlock title="验收标准" items={story.acceptanceCriteria} compact />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function FlowView({ title, items }: { title: string; items: ProductWorkspaceType["workflow"] }) {
  return (
    <Panel>
      <PanelHeader title={title} eyebrow="可视化流程画布" />
      <div className="p-5">
        <div className="grid gap-3">
          {items.map((item, index) => (
            <div
              key={item.title}
              className="grid gap-3 rounded-md border border-line bg-white p-4 md:grid-cols-[42px_minmax(0,1fr)_140px]"
            >
              <div className="grid h-10 w-10 place-items-center rounded-md bg-ink text-sm font-bold text-white">{index + 1}</div>
              <div>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
              <Badge tone={item.owner === "AI" ? "blue" : item.owner === "Human reviewer" ? "amber" : "neutral"}>
                {ownerLabel[item.owner]}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function ArchitectureView({ workspace }: { workspace: ProductWorkspaceType }) {
  const architecture = workspace.architecture;
  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader title="AI 架构建议" eyebrow="RAG、Agent、护栏、评估" />
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="text-base leading-7 text-slate-700">{architecture.summary}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric label="RAG" value={decisionLabel[architecture.useRag]} />
              <Metric label="Agent" value={decisionLabel[architecture.useAgents]} />
              <Metric label="人工复核" value={architecture.humanInLoop ? decisionLabel.required : decisionLabel.optional} />
            </div>
          </div>
          <SystemPattern />
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <ListPanel title="系统模块" items={architecture.components} />
        <ListPanel title="数据来源" items={architecture.dataSources} />
        <ListPanel title="安全护栏" items={architecture.guardrails} />
        <ListPanel title="评估指标" items={architecture.evaluationMetrics} />
      </div>
    </div>
  );
}

function CompetitorView({ workspace }: { workspace: ProductWorkspaceType }) {
  return (
    <Panel>
      <PanelHeader title="竞品分析" eyebrow="品类地图" />
      <div className="grid gap-4 p-5">
        {workspace.competitors.map((competitor) => (
          <div key={competitor.category} className="rounded-md border border-line p-4">
            <h3 className="text-base font-semibold text-ink">{competitor.category}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {competitor.examples.map((example) => (
                <Badge key={example}>{example}</Badge>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <KeyValue label="市场缺口" value={competitor.gap} />
              <KeyValue label="差异化机会" value={competitor.differentiation} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MVPView({ workspace }: { workspace: ProductWorkspaceType }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel>
        <PanelHeader title="MVP 建议" eyebrow="范围克制" />
        <div className="space-y-5 p-5">
          <KeyValue label="范围" value={workspace.mvp.scope} />
          <KeyValue label="首个里程碑" value={workspace.mvp.firstMilestone} />
        </div>
      </Panel>
      <div className="grid gap-4">
        <ListPanel title="纳入 MVP" items={workspace.mvp.included} />
        <ListPanel title="暂不纳入" items={workspace.mvp.excluded} />
      </div>
    </div>
  );
}

function KPIView({ workspace }: { workspace: ProductWorkspaceType }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ListPanel title="产品指标" items={workspace.kpis.product} />
      <ListPanel title="AI 质量指标" items={workspace.kpis.aiQuality} />
      <ListPanel title="商业指标" items={workspace.kpis.business} />
    </div>
  );
}

function ExperimentView({ workspace }: { workspace: ProductWorkspaceType }) {
  return (
    <div className="grid gap-4">
      {workspace.experiments.map((experiment) => (
        <Panel key={experiment.name} className="p-5">
          <Badge tone="blue">实验</Badge>
          <h2 className="mt-3 text-xl font-bold text-ink">{experiment.name}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <KeyValue label="假设" value={experiment.hypothesis} />
            <KeyValue label="方法" value={experiment.method} />
            <KeyValue label="成功标准" value={experiment.successCriteria} />
            <KeyValue label="决策规则" value={experiment.decisionRule} />
          </div>
        </Panel>
      ))}
    </div>
  );
}

function RiskView({ workspace }: { workspace: ProductWorkspaceType }) {
  return (
    <Panel>
      <PanelHeader title="风险分析" eyebrow="信任、安全、商业风险" />
      <div className="grid gap-4 p-5">
        {workspace.risks.map((risk) => (
          <div key={risk.risk} className="rounded-md border border-line p-4">
            <div className="flex flex-wrap items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-coral" />
              <h3 className="font-semibold text-ink">{risk.risk}</h3>
              <Badge tone={risk.severity === "high" ? "red" : "amber"}>{riskLabel[risk.severity]}</Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <KeyValue label="为什么重要" value={risk.whyItMatters} />
              <KeyValue label="缓解方案" value={risk.mitigation} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function EvaluationView({ workspace }: { workspace: ProductWorkspaceType }) {
  return (
    <Panel>
      <PanelHeader title="评估看板" eyebrow="AI PM 质量检查" />
      <div className="grid gap-4 p-5 md:grid-cols-2">
        {workspace.evaluation.map((score) => (
          <div key={score.label} className="rounded-md border border-line p-4">
            <ScoreRing score={score.score} label={score.label} />
            <p className="mt-3 text-sm leading-6 text-slate-600">{score.finding}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SystemPattern() {
  return (
    <div className="rounded-md border border-line bg-cloud p-4">
      <p className="text-sm font-semibold text-ink">推荐系统模式</p>
      <div className="mt-4 space-y-3 text-sm text-slate-700">
        {["输入理解", "检索增强", "Agent 评审", "质量评估", "产物导出"].map((node, index, array) => (
          <div key={node} className="flex items-center gap-2">
            <span className="rounded-md bg-white px-3 py-2 font-medium">{node}</span>
            {index < array.length - 1 ? <ArrowRight className="h-4 w-4 text-muted" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatPanel({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <Icon className="h-4 w-4 text-muted" />
      </div>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
    </Panel>
  );
}

function LaunchMetric({ label, value, copy }: { label: string; value: string; copy: string }) {
  return (
    <div className="rounded-md border border-line bg-cloud p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-600">{copy}</p>
    </div>
  );
}

function InterviewLens({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-md border border-line bg-cloud p-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-teal" />
        <p className="text-sm font-semibold text-ink">{title}</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-600">{copy}</p>
    </div>
  );
}

function PortfolioSignal({ label, value, copy }: { label: string; value: string; copy: string }) {
  return (
    <div className="rounded-md border border-line bg-cloud p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-sm font-bold text-ink">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-600">{copy}</p>
    </div>
  );
}

function GovernanceItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-cloud px-3 py-2">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <span className="text-xs font-semibold text-ink">{value}</span>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function ListBlock({ title, items, compact = false }: { title: string; items: string[]; compact?: boolean }) {
  return (
    <div className={compact ? "mt-4" : ""}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <Panel className="p-5">
      <ListBlock title={title} items={items} />
    </Panel>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-cloud p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-ink">{value}</p>
    </div>
  );
}

function ExportButton({ workspace }: { workspace: ProductWorkspaceType }) {
  function exportMarkdown() {
    const markdown = [
      `# ${workspace.title}`,
      "",
      "## 产品主张",
      workspace.thesis,
      "",
      "## 定位",
      workspace.positioning,
      "",
      "## PRD",
      "### 问题",
      workspace.prd.problem,
      "",
      "### 目标",
      ...workspace.prd.goals.map((item) => `- ${item}`),
      "",
      "### 非目标",
      ...workspace.prd.nonGoals.map((item) => `- ${item}`),
      "",
      "### MVP",
      workspace.mvp.scope,
      "",
      "### 指标",
      ...workspace.kpis.product.map((item) => `- 产品指标：${item}`),
      ...workspace.kpis.aiQuality.map((item) => `- AI 质量指标：${item}`),
      ...workspace.kpis.business.map((item) => `- 商业指标：${item}`),
      "",
      "### 风险",
      ...workspace.risks.map((item) => `- ${item.risk}：${item.mitigation}`)
    ].join("\n");

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = workspace.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\\/:*?"<>|]/g, "");
    link.href = url;
    link.download = `${safeName || "ai-product"}-产品简报.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={exportMarkdown}
      className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-cloud"
    >
      <Download className="h-4 w-4" />
      导出
    </button>
  );
}
