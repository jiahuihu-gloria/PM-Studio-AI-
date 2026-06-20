export type RiskLevel = "low" | "medium" | "high";

export type AgentName =
  | "PM Agent"
  | "Research Agent"
  | "UX Agent"
  | "AI Architect Agent"
  | "Data Analyst Agent"
  | "QA Agent";

export type WorkspaceSection =
  | "overview"
  | "prd"
  | "users"
  | "stories"
  | "workflow"
  | "architecture"
  | "competitors"
  | "mvp"
  | "kpis"
  | "experiments"
  | "risks"
  | "evaluation";

export interface ClarifyingQuestion {
  id: string;
  question: string;
  whyItMatters: string;
  options: string[];
  recommendedOption: string;
}

export interface ProductContext {
  idea: string;
  domain: string;
  productType: string;
  riskLevel: RiskLevel;
  targetCustomers: string[];
  likelyUsers: string[];
  assumptions: string[];
  clarificationQuestions: ClarifyingQuestion[];
}

export interface Persona {
  name: string;
  role: string;
  jobToBeDone: string;
  painPoints: string[];
  successCriteria: string[];
}

export interface UserStory {
  persona: string;
  story: string;
  priority: "P0" | "P1" | "P2";
  acceptanceCriteria: string[];
}

export interface CompetitorInsight {
  category: string;
  examples: string[];
  gap: string;
  differentiation: string;
}

export interface ProductWorkflowStep {
  title: string;
  description: string;
  owner: "User" | "AI" | "System" | "Human reviewer";
}

export interface AIArchitectureRecommendation {
  summary: string;
  useRag: "yes" | "no" | "later";
  useAgents: "yes" | "no" | "limited";
  humanInLoop: boolean;
  components: string[];
  dataSources: string[];
  guardrails: string[];
  evaluationMetrics: string[];
}

export interface MVPRecommendation {
  scope: string;
  included: string[];
  excluded: string[];
  firstMilestone: string;
}

export interface KPISet {
  product: string[];
  aiQuality: string[];
  business: string[];
}

export interface ExperimentPlan {
  name: string;
  hypothesis: string;
  method: string;
  successCriteria: string;
  decisionRule: string;
}

export interface RiskItem {
  risk: string;
  severity: RiskLevel;
  whyItMatters: string;
  mitigation: string;
}

export interface PRD {
  problem: string;
  goals: string[];
  nonGoals: string[];
  functionalRequirements: string[];
  aiRequirements: string[];
  uxRequirements: string[];
  openQuestions: string[];
}

export interface EvaluationScore {
  label: string;
  score: number;
  finding: string;
}

export interface AgentTrace {
  agent: AgentName;
  objective: string;
  outputSummary: string;
  confidence: number;
}

export interface ProductWorkspace {
  id: string;
  title: string;
  createdAt: string;
  context: ProductContext;
  thesis: string;
  positioning: string;
  personas: Persona[];
  userStories: UserStory[];
  prd: PRD;
  competitors: CompetitorInsight[];
  workflow: ProductWorkflowStep[];
  architecture: AIArchitectureRecommendation;
  mvp: MVPRecommendation;
  kpis: KPISet;
  experiments: ExperimentPlan[];
  userJourney: ProductWorkflowStep[];
  risks: RiskItem[];
  evaluation: EvaluationScore[];
  agentTraces: AgentTrace[];
}

export interface GenerateWorkspaceRequest {
  idea: string;
}
