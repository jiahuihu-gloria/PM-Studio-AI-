import type {
  AgentTrace,
  AIArchitectureRecommendation,
  CompetitorInsight,
  EvaluationScore,
  ExperimentPlan,
  KPISet,
  MVPRecommendation,
  Persona,
  PRD,
  ProductContext,
  ProductWorkflowStep,
  RiskItem,
  UserStory
} from "@/lib/domain/product-workspace";

export interface AgentOutputMap {
  intake: ProductContext;
  personas: Persona[];
  stories: UserStory[];
  prd: PRD;
  competitors: CompetitorInsight[];
  workflow: ProductWorkflowStep[];
  architecture: AIArchitectureRecommendation;
  mvp: MVPRecommendation;
  kpis: KPISet;
  experiments: ExperimentPlan[];
  journey: ProductWorkflowStep[];
  risks: RiskItem[];
  evaluation: EvaluationScore[];
}

export interface AgentResult<T> {
  data: T;
  trace: AgentTrace;
}
