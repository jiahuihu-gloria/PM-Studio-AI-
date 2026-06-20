import type { RiskLevel } from "./product-workspace";

const highRiskTerms = [
  "resume",
  "简历",
  "hiring",
  "招聘",
  "筛选",
  "medical",
  "医疗",
  "健康",
  "health",
  "legal",
  "法律",
  "credit",
  "信贷",
  "loan",
  "贷款",
  "insurance",
  "保险",
  "children",
  "儿童",
  "education",
  "教育",
  "screening",
  "diagnosis"
];

export function inferRiskLevel(idea: string): RiskLevel {
  const normalized = idea.toLowerCase();

  if (highRiskTerms.some((term) => normalized.includes(term))) {
    return "high";
  }

  if (
    normalized.includes("finance") ||
    normalized.includes("payment") ||
    normalized.includes("security")
  ) {
    return "medium";
  }

  return "low";
}

export function titleFromIdea(idea: string) {
  const normalized = idea.toLowerCase();
  if (
    normalized.includes("resume") ||
    normalized.includes("hiring") ||
    idea.includes("简历") ||
    idea.includes("招聘")
  ) {
    return "AI 简历筛选产品";
  }

  const cleaned = idea
    .replace(/^i\s+want\s+to\s+build\s+/i, "")
    .replace(/^我想(要)?(做|构建|开发|打造|建设)一个?/i, "")
    .replace(/^an?\s+/i, "")
    .replace(/[。.]$/, "");

  const title = cleaned
    .split(" ")
    .slice(0, 7)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return title || "AI 产品项目";
}

export function inferDomain(idea: string) {
  const normalized = idea.toLowerCase();

  if (normalized.includes("resume") || normalized.includes("hiring") || idea.includes("简历") || idea.includes("招聘")) {
    return {
      domain: "HR 科技",
      productType: "AI 辅助简历筛选",
      targetCustomers: ["招聘团队", "猎头与人力外包机构", "HR 运营负责人"],
      likelyUsers: ["招聘专员", "用人经理", "HR 运营管理员", "合规负责人"]
    };
  }

  if (normalized.includes("sales") || normalized.includes("crm") || idea.includes("销售") || idea.includes("客户关系")) {
    return {
      domain: "B2B 销售运营",
      productType: "AI 销售流程 Copilot",
      targetCustomers: ["营收团队", "销售管理者", "客户成功团队"],
      likelyUsers: ["销售代表", "销售经理", "RevOps 分析师"]
    };
  }

  if (normalized.includes("support") || normalized.includes("ticket") || idea.includes("客服") || idea.includes("工单")) {
    return {
      domain: "客户支持",
      productType: "AI 客服运营 Copilot",
      targetCustomers: ["客服团队", "客户运营负责人", "SaaS 公司"],
      likelyUsers: ["客服专员", "客服经理", "客户成功经理"]
    };
  }

  return {
    domain: "AI 效率软件",
    productType: "AI 工作流 Copilot",
    targetCustomers: ["中小团队", "运营负责人", "产品驱动型创业公司"],
    likelyUsers: ["业务操作者", "团队经理", "系统管理员"]
  };
}

export function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}
